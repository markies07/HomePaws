import React, { createContext, useContext, useId, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, writeBatch, increment, serverTimestamp, collection, where, getDocs, query, getDoc, setDoc, updateDoc, orderBy } from "firebase/firestore";
import { notifyErrorOrange, notifySuccessOrange } from "./CustomToast";
import defaultPic from '../../assets/icons/default-profile.svg';
import { AuthContext } from "./AuthProvider";

const LikesAndCommentsContext = createContext();

export const useLikesAndComments = () => {
    return useContext(LikesAndCommentsContext);
}

export const LikesAndCommentsProvider = ({children}) => {
    const { user, userData } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    // HANDLING LIKE CLICK
    const handleLike = async (postId, likerId, likerName) => {
        try {
            // Fetch the post document to get the post owner's userID
            const postRef = doc(db, 'userPosts', postId);
            const postSnapshot = await getDoc(postRef);
    
            // Check if the post exists
            if (!postSnapshot.exists()) {
                console.error('Post not found');
                return;
            }
    
            // Get the postOwnerId from the post data (stored as 'userID' in your document)
            const postOwnerId = postSnapshot.data().userID; // Make sure this is correct field name
    
            // Check if postOwnerId (userID) is valid
            if (!postOwnerId) {
                console.error('Post owner ID (userID) is missing in the post document!');
                return;
            }
    
            // Initialize a write batch
            const batch = writeBatch(db);
    
            // Storing data to 'likes' collection (this keeps track of likes from specific users)
            const likeRef = doc(collection(db, 'likes'), `${likerId}_${postId}`);
            batch.set(likeRef, {
                postId,
                userId: likerId, // The user who liked the post
                likedAt: serverTimestamp(),
            });
    
            // Increment the like count in 'userPosts'
            batch.update(postRef, {
                likeCount: increment(1),
            });

            if(user.uid !== postOwnerId){
                // Create a unique document ID for the notification based on the postId and postOwnerId
                const notificationId = `${postId}_${postOwnerId}_like`; // Ensuring a unique ID
        
                // Check if a notification for this post and action type (like) already exists for this post owner
                const notificationRef = doc(db, 'notifications', notificationId); // Use the predefined ID
        
                const notificationSnapshot = await getDoc(notificationRef);
        
                let otherUserCount = 0;
                let newNotificationMessage;
        
                if (notificationSnapshot.exists()) {
                    // If a notification already exists, update it
                    const existingNotification = notificationSnapshot.data();
        
                    otherUserCount = existingNotification.otherUserCount || 0;
                    otherUserCount += 1; // Increase the count of other users who liked the post
        
                    if (otherUserCount > 1) {
                        // More than 2 likes, update notification to show `likerName` + others
                        newNotificationMessage = `and ${otherUserCount} others liked your post.`;
                    } else {
                        // 2 or fewer likes, just show the likerName
                        newNotificationMessage = `liked your post.`;
                    }
        
                    // Update the notification
                    batch.update(notificationRef, {
                        content: newNotificationMessage,
                        otherUserCount, // Keep track of how many others have liked
                        senderName: likerName, // Update to show only the latest user who liked the post
                        image: userData.profilePictureURL,
                        timestamp: serverTimestamp(),
                    });
                } else {
                    // If no notification exists, create a new one with the predefined ID
                    newNotificationMessage = `liked your post.`;
        
                    batch.set(notificationRef, {
                        userId: postOwnerId, // The post owner who will receive the notification
                        type: 'like',
                        senderName: likerName, // Store only the most recent likerName
                        postID: postId,
                        content: newNotificationMessage,
                        image: userData.profilePictureURL,
                        otherUserCount: 0, // Start with 0 other users
                        isRead: false,
                        timestamp: serverTimestamp(),
                    });
                }
            }
    
    
            // Commit the batch
            await batch.commit();
    
            console.log('Like successfully added and notification sent/updated!');
        } catch (error) {
            console.error('Error liking the post: ', error);
        }
    };
    
    // HANDLING UNLIKE
    const handleUnlike = async (postId, likerId) => {
        try {
            // Initialize a write batch
            const batch = writeBatch(db);

            // REMOVE LIKE IN 'LIKES' COLLECTION
            const likeRef = doc(db, 'likes', `${likerId}_${postId}`);
            batch.delete(likeRef);

            // DECREMENT LIKE COUNT IN 'USERPOSTS'
            const postRef = doc(db, 'userPosts', postId);
            batch.update(postRef, {
                likeCount: increment(-1),
            });

            const postSnapshot = await getDoc(postRef);
            const postOwnerId = postSnapshot.data().userID;

            if(user.uid !== postOwnerId){
                // FETCH EXISTING LIKE NOTIFICATIONS
                const notificationQuery = query(
                    collection(db, 'notifications'),
                    where('postID', '==', postId),
                    where('type', '==', 'like')
                );
                
                const notificationSnapshot = await getDocs(notificationQuery);
    
                if (!notificationSnapshot.empty) {
                    const notificationDoc = notificationSnapshot.docs[0];
                    const notificationData = notificationDoc.data();
        
                    // Fetch the name of the user who liked the post
                    const senderDoc = await getDoc(doc(db, 'users', likerId));
                    const senderName = senderDoc.exists() ? senderDoc.data().fullName : 'Someone'; // Fallback to 'Someone' if name isn't found
        
                    let otherUserCount = notificationData.otherUserCount || 0;
        
                    if (otherUserCount > 0) {
                        // IF OTHER USERS LIKED THE POST, UPDATE THE NOTIFICATION
                        otherUserCount -= 1;
                        let updatedMessage;
        
                        if (otherUserCount === 0) {
                            updatedMessage = `liked your post.`;
                        } else {
                            updatedMessage = `and ${otherUserCount} others liked your post.`;
                        }
        
                        // UPDATE THE EXISTING NOTIFICATION
                        batch.update(notificationDoc.ref, {
                            content: updatedMessage,
                            otherUserCount,
                            timestamp: serverTimestamp(),
                        });
                    } else {
                        // IF NO OTHER USERS LIKED THE POST, DELETE THE NOTIFICATION
                        batch.delete(notificationDoc.ref);
                    }
                }
            }

            // COMMIT THE BATCH
            await batch.commit();
        } catch (error) {
            console.error('Error unliking the post: ', error);
        }
    };


    // HANDLING COMMENT
    const handleComment = async (postId, userId, commentText) => {
        const batch = writeBatch(db);
    
        try {
            // ADDING COMMENT TO THE COMMENTS COLLECTION
            const commentRef = doc(collection(db, 'comments'));
            const commentData = {
                postId,
                userId,
                commentText,
                commentedAt: serverTimestamp(),
            };
            batch.set(commentRef, commentData);
    
            // INCREMENTING COMMENT COUNT IN USERPOSTS
            const postRef = doc(db, 'userPosts', postId);
            batch.update(postRef, {
                commentCount: increment(1),
            });
    
            // COMMIT THE BATCH
            await batch.commit();
    
            // Fetch user data
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data();
            const senderName = userData.fullName || 'Unknown User';
    
            // Fetch post owner ID
            const postSnapshot = await getDoc(postRef);
            const postOwnerId = postSnapshot.data().userID; // Adjust this based on your structure
    
            if(user.uid !== postOwnerId){
                // Check if a notification for this post and action type (comment) already exists
                const notificationId = `${postId}_${postOwnerId}_comment`; // Unique ID for comment notifications
                const notificationRef = doc(db, 'notifications', notificationId);
                const notificationSnapshot = await getDoc(notificationRef);
        
                let otherCommentersCount = 0;
                let newNotificationMessage;
        
                if (notificationSnapshot.exists()) {
                    // If a notification already exists, update it
                    const existingNotification = notificationSnapshot.data();
        
                    otherCommentersCount = existingNotification.otherCommentersCount || 0;
                    otherCommentersCount += 1; // Increment the count for other commenters
        
                    if (otherCommentersCount > 1) {
                        // More than 2 commenters, update notification to show recent commenter and others
                        newNotificationMessage = `and ${otherCommentersCount} others commented on your post.`;
                    } else {
                        // 2 or fewer comments, just show the senderName
                        newNotificationMessage = `commented on your post.`;
                    }
        
                    // Update the notification
                    await updateDoc(notificationRef, {
                        content: newNotificationMessage,
                        otherCommentersCount, // Track how many other users have commented
                        senderName: senderName, // Show only the most recent commenter
                        image: userData.profilePictureURL,
                        timestamp: serverTimestamp(),
                    });
                } else {
                    // If no notification exists, create a new one
                    newNotificationMessage = `commented on your post.`;
        
                    await setDoc(notificationRef, {
                        type: 'comment',
                        postID: postId,
                        senderId: userId,
                        image: userData.profilePictureURL, // Optional: Include user profile picture
                        senderName: senderName, // Only show the latest sender
                        content: newNotificationMessage,
                        otherCommentersCount: 0, // Start with 0 other commenters
                        isRead: false,
                        timestamp: serverTimestamp(),
                        userId: postOwnerId, // Notify the post owner
                    });
                }
            }

            notifySuccessOrange("Comment posted!");
    
            // Return the comment data
            return {
                ...commentData,
                id: commentRef.id,
                fullName: senderName,
                profilePicture: userData.profilePictureURL || defaultPic,
            };
            
        } catch (error) {
            notifyErrorOrange("Failed posting comment. Please try again.");
            throw error;
        } 
    };
    
    const fetchComments = async (postId) => {
        try{
            setLoading(true);
            const q = query(collection(db, 'comments'), where('postId', '==', postId), orderBy('commentedAt', 'desc'));
            const commentsSnapshot = await getDocs(q);
            const commentsWithUserProfile = [];
    
            for (const commentDoc of commentsSnapshot.docs) {
                const commentData = commentDoc.data();
                const userId = commentData.userId;
    
                // Fetch the user's profile from 'users' collection
                const userRef = doc(db, 'users', userId);
                const userSnapshot = await getDoc(userRef);
    
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    commentsWithUserProfile.push({
                        ...commentData,
                        id: commentDoc.id,
                        fullName: userData.fullName || 'Unknown User',  // Default if missing
                        profilePicture: userData.profilePictureURL || defaultPic, // Default if missing
                        commentedAt: commentData.commentedAt,
                    });
                } else {
                    console.log('User profile not found!');
                }
            }
        return commentsWithUserProfile;
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    };


    const value = {
        handleLike,
        handleUnlike,
        handleComment,
        fetchComments,
        loading
    }

    return (
        <LikesAndCommentsContext.Provider value={value}>
            {children}
        </LikesAndCommentsContext.Provider>
    );

}