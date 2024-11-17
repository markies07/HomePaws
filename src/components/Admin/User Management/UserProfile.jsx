import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../General/AuthProvider';
import { useLikesAndComments } from '../../General/LikesAndCommentsContext';
import { useImageModal } from '../../General/ImageModalContext';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import unlike from './assets/unlike.svg'
import like from './assets/like.svg'
import comment from './assets/comment.svg'
import Comments from '../../User/News Feed/Comments';
import Actions from './Actions';
import BanUser from './BanUser';
import DeactivateUser from './DeactivateUser';
import admins from './assets/white-admins.svg'
import message from './assets/message.svg';
import actions from './assets/actions.svg';

function UserProfile() {
    const {userID} = useParams();
    const {user, userData} = useContext(AuthContext);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [isActionOpen, setIsActionOpen] = useState(false);

    const [likedPosts, setLikedPosts] = useState({});
    const { handleLike, handleUnlike, handleComment } = useLikesAndComments();
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(null);
    const { showModal } = useImageModal();
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isReportUser, setIsReportUser] = useState(false);

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
                const q = query(postsRef, where('userID', '==', userID), where('isBanned', '==', false), orderBy('createdAt', 'desc'));

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

    const openReportUser = () => {
        setIsReportUser(!isReportUser);
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

    const toggleAction = () => {
        setIsActionOpen(!isActionOpen);
    }

    return (
        <div className='pt-36 lg:pt-20 lg:pl-52 px-3 z-30 lg:pr-3 lg:ml-7 min-h-screen flex flex-col font-poppins text-text'>
            {/* USER PPROFILE */}
            <div className='rounded-md mt-3 lg:rounded-lg w-full flex-col md:flex-row md:justify-between pb-3 md:py-5 p-4 md:pl-5 lg:pl-7 md:pr-5 gap-2 md:gap-5 flex justify-center items-center bg-secondary shadow-custom relative'>
                <p className={`${data.violationsCount >= 1 ? 'block' : 'hidden'} md:hidden sm:text-sm font-medium absolute text-xs top-2 left-2`}>Violation: {data.violationsCount}</p>
                <div className={`flex flex-col relative w-full justify-center items-center md:justify-start md:flex-row`}>
                    <div className={`w-24 h-24 md:my-auto sm:w-28 sm:h-28 shrink-0 bg-text mb-2 rounded-full relative`}>
                        <img className='w-full h-full object-cover rounded-full' src={data.profilePictureURL} alt="" />
                    </div>
                    <div className='flex flex-col md:items-start md:ml-5'>
                        <p className='font-medium text-xl text-center leading-3 mb-4 md:mb-1 md:text-2xl md:text-start'>{data.fullName}</p>
                        <div className='text-white text-xs flex justify-center gap-1 flex-wrap'>
                            <p className={`${data.role === 'admin' ? 'block' : 'hidden'} text-xs bg-text rounded-full text-white px-2 py-1`}>admin</p>
                            <p className={`bg-primary py-1 px-3 rounded-full whitespace-nowrap ${data.petOwnerType !== 'Both' ? 'block' : 'hidden'}`}>{data.petOwnerType}</p>
                            <div className={data.petOwnerType === 'Both' ? 'flex gap-1' : 'hidden'}>
                                <p className='bg-primary py-1 px-3 rounded-full whitespace-nowrap'>Dog Owner</p>
                                <p className='bg-primary py-1 px-3 rounded-full whitespace-nowrap'>Cat Owner</p>
                            </div>
                        </div>
                        <p className={`${data.violationsCount >= 1 ? 'sm:block' : 'hidden'} hidden pt-2 text-center sm:text-sm text-xs `}>Violation: {data.violationsCount}</p>
                    </div>
                </div>

                {/* ACTIONS MOBILE */}
                <div className='absolute md:hidden top-3 right-3 flex flex-col gap-2'>
                    <button onClick={toggleAction} className=' bg-text rounded-md hover:bg-[#707070] duration-150'><img className='w-9 p-2' src={actions} alt="" /></button>
                    <button className=' bg-[#8FBB3E] rounded-md hover:bg-[#7ea534] duration-150'><img className='w-9 p-2' src={message} alt="" /></button>
                </div>

                {/* ACTIONS DESKTOP */}
                <div className='self-start hidden md:flex justify-end relative w-full gap-2 mt-2 md:mt-0'>
                    <button className='bg-[#8FBB3E] flex hover:bg-[#7ea534] items-center gap-2 sm:w-40 sm:px-3 sm:text-sm sm:whitespace-nowrap duration-150 py-2 text-xs text-white rounded-md w-full leading-3 font-medium'> <img className='w-5' src={message} alt="" /> MESSAGE <br className='sm:hidden' /> USER</button>
                    <button onClick={toggleAction} className=' bg-text rounded-md hover:bg-[#707070] duration-150'><img className='w-9 p-2' src={actions} alt="" /></button>
                </div>

                {/* ACTION WINDOW */}
                <div className={isActionOpen ? 'absolute' : 'hidden'}>
                    <Actions data={data} closeUI={toggleAction} />
                </div>
            </div>
            {/* USER POSTS */}
            <div className='rounded-md mt-3'>
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
                                
                                {/* USER INFORMATION */}
                                <div className='flex w-full'>
                                    <img src={data.profilePictureURL} className='w-10 h-10 bg-[#D9D9D9] rounded-full' />
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
                                    <Comments postID={selectedPost} handleComment={handleComment} closeComment={closeComment} post={true} />
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default UserProfile