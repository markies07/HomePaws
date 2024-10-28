import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import message from '../assets/message.svg';
import { AuthContext } from '../../../General/AuthProvider';
import { useImageModal } from '../../../General/ImageModalContext';
import { useLikesAndComments } from '../../../General/LikesAndCommentsContext';
import Comments from '../../News Feed/Comments';
import unlike from '../assets/unlike.svg'
import like from '../assets/like.svg'
import comment from '../assets/comment.svg'
import close from '../assets/small-close.svg'
import settings from '../assets/settings.svg'
import reportPost from '../assets/report.svg'
import Report from '../../News Feed/Report';

function ViewProfile() {
    const {userID} = useParams();
    const {user, userData} = useContext(AuthContext);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const [likedPosts, setLikedPosts] = useState({});
    const { handleLike, handleUnlike, handleComment } = useLikesAndComments();
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(null);
    const { showModal } = useImageModal();
    const [isReportOpen, setIsReportOpen] = useState(false);

    // FETCHING USER DATA
    useEffect(() => {
        const fetchUserProfile = async () => {
            try{
                const docRef = doc(db, 'users', userID);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()){
                    setData(docSnap.data());
                }
                else{
                    console.log("No document!");
                }
            }
            catch(error){
                console.error(error);
            }
        }
        if(userID){
            fetchUserProfile();
        }
    }, [userID]);


    // FETCHING USER POST
    useEffect(() => {
        const fetchUserPosts = async () => {
            try{
                setLoading(true);

                const postsRef = collection(db, 'userPosts');
                const q = query(postsRef, where('userID', '==', userID));

                const querySnapshot = await getDocs(q);
                const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setPosts(userPosts);
            }
            catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        }
        
        if(userID){
            fetchUserPosts();
        }
    }, [userID]);

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

    // OPEN REPORT
    const openReport = (postID) => {
        setIsReportOpen(!isReportOpen);
        setSelectedPost(postID);
    }
    const closeReport = () => {
        setIsReportOpen(!isReportOpen);
        setSelectedPost(null);
        setIsSettingsOpen(null);
    }

    // MESSAGING EACH OTHER
    const handleStartChat = async (receiver) => {

        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', receiver && user.uid)
        );

        const querySnapshot = await getDocs(q);
        let existingChat = null;

        querySnapshot.forEach(doc => {
            const participants = doc.data().participants;
            if(participants.includes(receiver)) {
                existingChat = doc.id;
            }
        });

        let chatID;
        if(existingChat){
            chatID = existingChat;
        }
        else{
            const newChatRef = await addDoc(collection(db, 'chats'), {
                participants: [user.uid, receiver],
            })
            chatID = newChatRef.id;
        }
        navigate(`/dashboard/chat/convo/${chatID}`);
    }

    return (
        <div className='pt-36 relative lg:pt-20 lg:pl-48 xl:pl-[13.8rem] lg:pr-[13px] lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className='w-full my-3 lg:mt-3 relative px-3 lg:px-0'>
                <div className='rounded-md lg:rounded-lg w-full flex-col md:flex-row md:justify-between pb-3 md:py-5 p-4 md:px-5 lg:px-7 gap-2 md:gap-5 flex justify-center items-center bg-secondary shadow-custom relative'>
                    {/* USER PPROFILE */}
                    <div className='flex flex-col relative w-full justify-center items-center md:justify-start md:flex-row'>
                        <div className='w-24 h-24 md:my-auto sm:w-28 sm:h-28 shrink-0 bg-text mb-2 rounded-full relative'>
                            <img className='w-full h-full object-cover rounded-full' src={data.profilePictureURL} alt="" />
                        </div>
                        <div className='flex flex-col md:items-start md:ml-5'>
                            <p className='font-medium text-xl text-center leading-3 mb-4 md:mb-1 md:text-2xl md:text-start'>{data.fullName}</p>
                            <div className='text-white text-xs flex justify-center gap-1 flex-wrap'>
                                <p className={`bg-primary py-1 px-3 rounded-full whitespace-nowrap ${data.petOwnerType !== 'Both' ? 'block' : 'hidden'}`}>{data.petOwnerType}</p>
                                <div className={data.petOwnerType === 'Both' ? 'flex gap-1' : 'hidden'}>
                                    <p className='bg-primary py-1 px-3 rounded-full whitespace-nowrap'>Dog Owner</p>
                                    <p className='bg-primary py-1 px-3 rounded-full whitespace-nowrap'>Cat Owner</p>
                                </div>
                            </div>
                        </div>

                        {/* MESSAGE USER MOBILE */}
                        <div onClick={() => handleStartChat(userID)} className='bg-[#D9D9D9] md:hidden hover:bg-[#cecece] duration-150 p-2 rounded-md cursor-pointer absolute top-0 right-0'>
                            <img className='w-5 sm:w-7' src={message} alt="" />
                        </div>
                    </div>

                    {/* MESSAGE USER */}
                    <div className='w-full hidden md:flex mt-2 md:mt-0 z-10 justify-center md:justify-end md:gap-3'>
                        <div onClick={() => handleStartChat(userID)} className='bg-[#D9D9D9] hover:bg-[#cecece] duration-150 cursor-pointer justify-center flex flex-col items-center w-full sm:w-28 py-3 px-3 rounded-md'>
                            <img className='w-9 mt-1' src={message} alt="" />
                            <p className='font-medium text-center pt-2 text-xs'>Message User</p>
                        </div>
                    </div>
                </div>

                {/* USER POSTS */}
                <div className=' mt-3 flex gap-3 flex-col rounded-md'>
                    {loading ? (
                        <div className='py-3 text-center bg-secondary rounded-md shadow-custom font-medium'>Loading posts...</div>
                    ) :
                    
                    posts.length === 0 ? (
                        <div className='py-3 text-center bg-secondary rounded-md shadow-custom font-medium'>No posts available</div>
                    ) : (
                        posts.map((post) => {
                            const isLiked = likedPosts[post.id];
                            
                            return (
                                <div key={post.id} className='bg-secondary relative w-full rounded-md sm:rounded-lg shadow-custom py-4 px-5 md:px-7'>
                                    {/* SETTINGS */}
                                    <img onClick={() => toggleSettings(post.id)} className='absolute cursor-pointer top-0 py-3 px-2 sm:px-3 right-0' src={isSettingsOpen === post.id ? close : settings} alt="" />
                                    <div className={`${isSettingsOpen === post.id ? 'block' : 'hidden'} absolute top-10 p-1 rounded-lg right-4 bg-white shadow-custom`}>
                                        <div onClick={() => openReport(post.id)} className='px-5 py-2 flex items-center cursor-pointer hover:bg-[#e6e6e6] duration-150 gap-3'>
                                            <img src={reportPost} alt="" />
                                            <p className='font-medium'>Report Post</p>
                                        </div>
                                    </div>
                                    
                                    
                                    {/* USER INFORMATION */}
                                    <div className='flex w-full'>
                                        <img src={data.profilePictureURL} className='w-10 h-10 bg-[#D9D9D9] rounded-full' />
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

                                    {/* COMMENT */}
                                    <div className={isCommentOpen ? 'block' : 'hidden'}>
                                        <Comments postID={selectedPost} handleComment={handleComment} closeComment={closeComment} />
                                    </div>

                                    {/* REPORT */}
                                    <div className={isReportOpen ? 'block' : 'hidden'}>
                                        <Report postID={selectedPost} closeReport={closeReport} />
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default ViewProfile