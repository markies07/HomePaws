import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../General/AuthProvider';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useLikesAndComments } from '../../General/LikesAndCommentsContext';
import { useImageModal } from '../../General/ImageModalContext';
import Comments from './Comments';
import unlike from './assets/unlike.svg'
import like from './assets/like.svg'
import comment from './assets/comment.svg'
import deletePost from './assets/delete.svg'
import close from './assets/small-close.svg'
import settings from './assets/settings.svg'
import { confirm } from '../../General/CustomAlert';
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';

function UserPosts() {
    const {user, userData} = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [likedPosts, setLikedPosts] = useState({});
    const { handleLike, handleUnlike, handleComment } = useLikesAndComments();
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(null);
    const { showModal } = useImageModal();

    useEffect(() => {
        const fetchUserPosts = async () => {
            try{
                setLoading(true);

                if(user){
                    const postsRef = collection(db, 'userPosts');
                    const q = query(postsRef, where('userID', '==', user.uid), where('isBanned', '==', false), orderBy('createdAt', 'desc'));

                    const querySnapshot = await getDocs(q);
                    const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    setPosts(userPosts);
                }
            }
            catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        }
        
        fetchUserPosts();
    }, []);

    const toggleLike = (postID) => {
        const isLiked = likedPosts[postID];

        if (isLiked) {
            handleUnlike(postID, user.uid, userData.fullName);
            setLikedPosts({ ...likedPosts, [postID]: false});
            
        } else {
            handleLike(postID, user.uid, userData.fullName);
            setLikedPosts({ ...likedPosts, [postID]: true});
        }
    };

    // FETCHING THE STATE OF LIKE POSTS
    useEffect(() => {
        if(posts.length > 0){
            posts.forEach(async (post) => {
                const postRef = doc(db, 'likes', `${user.uid}_${post.id}`);
                const postSnap = await getDoc(postRef);

                if(postSnap.exists()){
                    setLikedPosts((prev) => ({ ...prev, [post.id]: true }));
                }
            });
        }
    }, [posts, user.uid]);

    // COMMENT INTERACTION
    const openComment = (postID) => {
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

    const toggleSettings = (postID) => {
        if(isSettingsOpen === postID){
            setIsSettingsOpen(null);
        }
        else{
            setIsSettingsOpen(postID);
        }  
    }

    const deleteThisPost = async (postID) => {
        confirm(`Deleting Post`, `Are you sure you want to delete this post?`).then(async (result) => {
            if(result.isConfirmed){
                try{
                    await deleteDoc(doc(db, 'userPosts', postID));
                    notifySuccessOrange(`Your post has been deleted.`);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                catch(error) {
                    console.error(error);
                    notifyErrorOrange('There was an issue deleting this post. Please try again.');
                }
            }
            else{
                setIsSettingsOpen(null);
            }
        })
    }


    return (
        <div className='px-3 lg:px-0 rounded-md'>
            {loading ? (
                <div className='py-3 text-center bg-secondary rounded-md shadow-custom font-medium'>Loading posts...</div>
            ) :
            
            posts.length === 0 ? (
                <div className='py-3 text-center bg-secondary rounded-md shadow-custom font-medium'>No posts available</div>
            ) : (
                posts.map((post) => {
                    const isLiked = likedPosts[post.id];
                    
                    return (
                        <div key={post.id} className='bg-secondary relative w-full rounded-md mb-3 sm:rounded-lg shadow-custom py-4 px-5 md:px-7'>
                            {/* SETTINGS */}
                            <img onClick={() => toggleSettings(post.id)} className='absolute cursor-pointer top-0 py-3 px-2 sm:px-3 right-0' src={isSettingsOpen === post.id ? close : settings} alt="" />
                            <div className={`${isSettingsOpen === post.id ? 'block' : 'hidden'} absolute top-10 p-1 rounded-lg right-4 bg-white shadow-custom`}>
                                <div onClick={() => deleteThisPost(post.id)} className='px-5 flex py-2 cursor-pointer hover:bg-[#e6e6e6] duration-150 items-center gap-3'>
                                    <img className='w-[22px]' src={deletePost} alt="" />
                                    <p className='font-medium'>Delete Post</p>
                                </div>
                            </div>
                            
                            
                            {/* USER INFORMATION */}
                            <div className='flex w-full'>
                                <img src={userData.profilePictureURL} className='w-10 h-10 bg-[#D9D9D9] rounded-full' />
                                <div className='ml-2'>
                                    <p className='font-medium'>{post.userName} <span className='text-xs sm:text-sm sm:px-3 font-normal ml-1 text-white rounded-full px-2' style={{backgroundColor: post.typeOfPost === 'story' ? '#A87CCD' : post.typeOfPost === 'missing' ? '#ED5050' : '#85B728'}}>{post.typeOfPost}</span></p>
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
                            <div className='w-full gap-14 sm:gap-20 lg:gap-32 flex justify-center'>
                                <div onClick={() => toggleLike(post.id)} className='flex items-center cursor-pointer'>
                                    <img className='w-6' src={isLiked ? like : unlike} alt="" />
                                    <p className={`font-semibold pl-1 sm:pl-2 text-sm ${isLiked ? 'text-primary' : ''}`}>Like</p>
                                </div>
                                <div onClick={() => openComment(post.id)} className='flex items-center cursor-pointer'>
                                    <img className='w-[21px]' src={comment} alt="" />
                                    <p className='font-semibold pl-1 sm:pl-2 text-sm'>Comment</p>
                                </div>
                            </div>

                            <div className={isCommentOpen ? 'block' : 'hidden'}>
                                <Comments postID={selectedPost} handleComment={handleComment} closeComment={closeComment} />
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default UserPosts