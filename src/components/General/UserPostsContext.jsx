import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';  // Firestore instance from your firebase config
import defaultProfile from '../../assets/icons/default-profile.svg'

const UserPostsContext = createContext();

// Custom hook to use the context
export const useUserPosts = () => useContext(UserPostsContext);

// Provider component
export const UserPostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // Fetch posts with user profile information
    const fetchPosts = async (filterType) => {
        setLoading(true);

        let postsQuery;

        try {
          if(!filterType || filterType === 'all') {
            postsQuery = query(
              collection(db, 'userPosts'),
              where('isBanned', '==', false),
              orderBy('createdAt', 'desc')
            );
          }
          else{
            postsQuery = query(
              collection(db, 'userPosts'), 
              where('typeOfPost', '==', filterType),
              where('isBanned', '==', false),
              orderBy('createdAt', 'desc')
            );
          }


          const postsSnapshot = await getDocs(postsQuery); // Fetch the posts snapshot
      
          const postsData = await Promise.all(
            postsSnapshot.docs.map(async (postDoc) => {
              const postData = postDoc.data();
      
              // Fetch user data based on userID in the post
              const userDocRef = doc(db, 'users', postData.userID); // Correct usage of doc
              const userSnapshot = await getDoc(userDocRef);
              const userData = userSnapshot.data();
      
              return {
                id: postDoc.id,
                ...postData,
                userProfileImage: userData?.profilePictureURL || defaultProfile, // Default if no image
                userName: userData?.fullName || 'Unknown User',
              };
            })
          );
      
          setPosts(postsData);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);
    

    // Provide data via context
    return (
        <UserPostsContext.Provider value={{ posts, loading, fetchPosts }}>
            {children}
        </UserPostsContext.Provider>
    );
};
