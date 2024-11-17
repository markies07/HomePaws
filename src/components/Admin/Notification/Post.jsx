import React, { useContext, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom'
import { db } from '../../../firebase/firebase';
import unlike from './assets/unlike.svg'
import like from './assets/like.svg'
import comment from './assets/comment.svg'
import message from './assets/message.svg'
import { useImageModal } from '../../General/ImageModalContext';
import { useLikesAndComments } from '../../General/LikesAndCommentsContext';
import { AuthContext } from '../../General/AuthProvider';
import Comments from '../../User/News Feed/Comments';
import { useLocation } from 'react-router-dom';

function Post() {
    const { postID } = useParams();
    const location = useLocation();
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, userData } = useContext(AuthContext);
    const { showModal } = useImageModal();
    const { handleLike, handleUnlike, handleComment } = useLikesAndComments();
    const [likedPosts, setLikedPosts] = useState({});
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const { notifType } = location.state || {};

    useEffect(() => {
        setLoading(true);
        const fetchPost = async () => {
        try{
            const postRef = doc(db, 'userPosts', postID);
            const postSnap = await getDoc(postRef);

            if(postSnap.exists()){
            const postData = postSnap.data();

            // Fetch user profile data based on userID from post
            const userDocRef = doc(db, 'users', postData.userID);
            const userSnapshot = await getDoc(userDocRef);

            const userData = userSnapshot.exists() ? userSnapshot.data() : {};

            // Combine post data with user profile info
            const postWithUserData = {
                ...postData,
                userProfileImage: userData?.profilePictureURL || defaultProfile,  // Default profile picture if not available
                userName: userData?.fullName || 'Unknown User',  // Default name if not available
            };

            setPost(postWithUserData);
            }
            else{
            setError('Post not found');
            }
        }
        catch(error) {
            setError('Failed to fetch post');
        }
        finally{
            setLoading(false);
        }
        }

        fetchPost();
    }, [postID]);


    useEffect(() => {
        const checkIfPostLiked = async () => {
        if (!user?.uid || !postID) return;

        try {
            const postRef = doc(db, 'likes', `${user.uid}_${postID}`);
            const postSnap = await getDoc(postRef);
            setIsLiked(postSnap.exists());
        } catch (error) {
            console.error("Error checking if post is liked:", error);
        }
        };

        checkIfPostLiked();
    }, [db, user, postID]);


    useEffect(() => {
        if(notifType === 'comment'){
        setIsCommentOpen(true);
        setSelectedPost(postID)
        }
    }, [notifType, postID]);

    const toggleLike = (postID) => {
        if (isLiked) {
            handleUnlike(postID, user.uid);
            setLikedPosts({ ...likedPosts, [postID]: false});
            setIsLiked(false);
            
        } 
        else {
            handleLike(postID, user.uid, userData.fullName);
            setLikedPosts({ ...likedPosts, [postID]: true});
            setIsLiked(true);
        }
    };

    const openComment = () => {
        setIsCommentOpen(!isCommentOpen);
        setSelectedPost(postID)
    }
    const closeComment = () => {
        setIsCommentOpen(!isCommentOpen);
        setSelectedPost(null)
    }


    const getTimeDifference = (timestamp) => {
        const now = new Date();
        const timeDiff = Math.abs(now - timestamp.toDate()); // Convert Firestore timestamp to JS Date
    
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
    
        if (seconds < 10) {
        return 'Just now';
        } else if (years > 0) {
        return years === 1 ? '1 year ago' : `${years} years ago`;
        } else if (months > 0) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
        } else if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else {
        return `${seconds} seconds ago`;
        }
    };

    if(loading){
        return <p className='bg-secondary py-3 rounded-md shadow-custom w-full text-center'>Loading post ...</p>
    }

    if(error){
        return <p className='bg-secondary py-3 rounded-md shadow-custom w-full text-center'>{error}</p>
    }



    return (
        <div className='pt-36 relative lg:pt-20 lg:pl-56 lg:pr-3 lg:ml-3 min-h-screen flex flex-col font-poppins text-text'>
      
            {post ? (
                <div className='flex flex-col mt-3 bg-secondary py-4 px-5 md:px-7 sm:mx-auto lg:mx-0 mb-3 w-full text-text sm:w-[97%] lg:w-full sm:rounded-md lg:rounded-lg shadow-custom'>
                {/* USER INFORMATION */}
                <div className='flex w-full'>
                    <img src={post.userProfileImage} className='w-10 h-10 bg-[#D9D9D9] rounded-full' />
                    <div className='ml-2'>
                        <p className='font-medium'>{post.userName} <span className='text-xs sm:text-sm sm:px-3 font-normal ml-1 text-white rounded-full px-2' style={{backgroundColor: post.typeOfPost === 'story' ? '#A87CCD' : post.typeOfPost === 'missing' ? '#ED5050' : post.typeOfPost === 'announcement' ? '#ED5050' : '#85B728'}}>{post.typeOfPost}</span></p>
                        <p className='-mt-[3px] text-xs'>{getTimeDifference(post.createdAt)}</p>
                    </div>
                </div>

                {/* CAPTION */}
                <div className='mt-2'>
                    <p className='font-medium whitespace-pre-wrap text-sm sm:text-base'>{post.caption}</p>
                </div>

                {/* IMAGES */}
                <div className='flex gap-2 md:gap-3 justify-center mt-2 object-cover sm:w-[80%] sm:mx-auto'>
                    {post.images && post.images.length > 0 && ( 
                        post.images.map((img, index) => <img src={img} key={index} onClick={() => showModal(img)} className='w-full cursor-pointer object-cover overflow-hidden max-w-40 xl:max-w-52 h-48 md:h-52 xl:h-72 bg-[#D9D9D9] rounded-md' />
                    ))}
                </div>

                {/* LIKES AND COMMENTS */}
                <div className='my-3 flex '>
                    <div className='justify-between w-full flex'>
                        <div className='items-center flex ' style={{ display: post.likeCount > 0 || isLiked ? 'flex' : 'none'}}>
                            <img className='w-5' src={like} alt="" />
                            <p className='text-sm ml-2' style={{ display: isLiked ? 'none' : 'flex'}}>{post.likeCount}</p>
                            <p className='text-sm ml-2' style={{ display: isLiked ? 'flex' : 'none'}}>{post.likeCount + 1}</p>
                        </div>
                        <div className='items-center flex ' style={{ display: post.commentCount <= 0 ? 'none' : 'flex'}}>
                            <p className='text-sm ml-2'>{post.commentCount} comment{post.commentCount > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>

                {/* LINE */}
                <div className='w-full mb-4'>
                    <div className='h-[1px] w-full relative bg-[#a5a5a5]'></div>
                </div>

                {/* USER INTERACTIONS */}
                <div className='w-full gap-7 sm:gap-16 xl:gap-20 flex justify-center '>
                    <div onClick={() => toggleLike(postID)} className='flex items-center cursor-pointer'>
                        <img className='w-6' src={isLiked ? like : unlike} alt="" />
                        <p className={`font-semibold pl-1 sm:pl-2 text-sm ${isLiked ? 'text-primary' : ''}`}>Like</p>
                    </div>
                    <div onClick={() => openComment(postID)} className='flex items-center cursor-pointer'>
                        <img className='w-[21px]' src={comment} alt="" />
                        <p className='font-semibold pl-1 sm:pl-2 text-sm'>Comment</p>
                    </div>
                    <div className='flex items-center opacity-60'>
                        <img className='w-5' src={message} alt="" />
                        <p className='font-semibold pl-1 sm:pl-2 text-sm'>Message</p>
                    </div>
                </div>

                <div className={isCommentOpen ? 'block relative' : 'hidden'}>
                    <Comments postID={selectedPost} handleComment={handleComment} closeComment={closeComment} post={true} />
                </div>

                
                </div>
            ) : (
                <p>No post found.</p>
            )}


        </div>
    )
}

export default Post