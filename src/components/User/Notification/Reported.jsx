import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../../firebase/firebase'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import close from './assets/close-dark.svg'
import { useImageModal } from '../../General/ImageModalContext'
import like from './assets/like.svg';
import { AuthContext } from '../../General/AuthProvider'

function Reported() {
    const navigate = useNavigate();
    const {user, userData} = useContext(AuthContext);
    const {reportID} = useParams();
    const [data, setData] = useState(null);
    const [reported, setReported] = useState(null);
    const [post, setPost] = useState(null);
    const location = useLocation();
    const { showModal } = useImageModal();
    const isUser = location.pathname.includes("user/");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchReport = async () => {
            try {
                // Fetch the report document
                const reportDoc = await getDoc(doc(db, 'userReports', reportID));
    
                if (reportDoc.exists()) {
                    const reportData = reportDoc.data();
                    setData(reportData);
    
                    // Fetch the reported user document from the users collection
                    if (isUser) {
                        const reportedUserID = reportData.userReported;
                        const userDoc = await getDoc(doc(db, 'users', reportedUserID));
    
                        if (userDoc.exists()) {
                            // Combine the report data with the user data
                            setData((prevData) => ({ ...prevData, reportedUser: userDoc.data() }));
                            setReported(userDoc.data());
                        } else {
                            console.log("Reported user not found.");
                            setData((prevData) => ({ ...prevData, reportedUser: null }));
                            setReported(null);
                        }
                    } 
                    // Fetch the reported post data
                    else {
                        const reportedPostID = reportData.postID;
                        const postDoc = await getDoc(doc(db, 'userPosts', reportedPostID));
    
                        if (postDoc.exists()) {
                            const postData = postDoc.data();
                            const reportedUserID = postData.userID;
    
                            // Fetch the reported user document from the users collection
                            const userDoc = await getDoc(doc(db, 'users', reportedUserID));
    
                            if (userDoc.exists()) {
                                // Combine the report data, post data, and user data
                                setData((prevData) => ({
                                    ...prevData,
                                    reportedPost: postData,
                                    reportedUser: userDoc.data()
                                }));
                                setReported(userDoc.data());
                                setPost(postData);
                            } else {
                                console.log("Reported user not found.");
                                setData((prevData) => ({
                                    ...prevData,
                                    reportedPost: postData,
                                    reportedUser: null
                                }));
                                setReported(null);
                                setPost(postData);
                            }
                        } else {
                            console.log("Reported post not found.");
                            setData((prevData) => ({ ...prevData, reportedPost: null }));
                            setPost(null);
                        }
                    }
                } else {
                    console.log("No report document found.");
                    setData(null);
                }
            } catch (error) {
                console.error("Error fetching report:", error);
            }
            finally{
                setLoading(false);
            }
        };
    
        if (reportID) {
            fetchReport();
        }
    }, [reportID, isUser]);

    const getTimeDifference = (timestamp) => {
        if (!timestamp) return 'Invalid date';
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

      console.log(data)


    return (
        <div className='pt-36 relative lg:pt-20 lg:pl-52 xl:pl-56 xl:ml-3 lg:pr-3 min-h-screen flex flex-col font-poppins text-text'>
            <div className='flex mt-3 lg:mt-3 bg-secondary sm:mx-auto lg:mx-0 mb-3 w-full text-text sm:w-[97%] lg:w-full sm:rounded-md lg:rounded-lg shadow-custom'>
                <div className='relative w-full'>
                    <img onClick={() => navigate('/dashboard/notification')} className='absolute border-2 border-secondary z-10 hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                    <div className='flex relative justify-between'>
                        <h1 className='text-2xl p-5 font-semibold'>{isUser ? 'Reported User' : 'Reported Post'}</h1>
                    </div>

                    {loading ? (
                        <div className='py-10 w-full'>
                            <p className='font-semibold text-center text-xl mb-2'>Loading ...</p>
                        </div>
                    ) : (
                        <>
                            <div className='flex flex-col py-5 gap-3 md:px-5 max-w-[45rem] mx-auto'>

                                {/* ADMIN MESSAGE */}
                                <div className='bg-[#E9E9E9] md:rounded-lg p-5 sm:p-7 w-full'>
                                    <p className='font-semibold mb-2'>Admin:</p>
                                    <div className={`${data?.reportedUser?.uid === user.uid ? 'hidden' : 'block'}`}>
                                        <div className={`${data?.status === 'approved' ? 'block' : 'hidden'} bg-[#84B725] text-white shadow-custom relative w-full p-3 sm:px-5 rounded-lg flex flex-col`}>
                                            <p className='font-semibold'>"Thank you for reporting your concern. We have reviewed the report and taken action. The reported {isUser ? 'user has been penalized.' : 'user who posted that content has been penalized.'}"</p>
                                        </div>
                                        <div className={`${data?.status === 'declined' ? 'block' : 'hidden'} bg-[#D25A5A] text-white shadow-custom relative w-full p-3 sm:px-5 rounded-lg flex flex-col`}>
                                            <p className='font-semibold'>"Thank you for reporting your concern. We have reviewed the report but do not find sufficient grounds to take action at this time. Please let us know if you have any other issues to report."</p>
                                        </div>
                                    </div>
                                    <div className={`${data?.reportedUser?.uid === user.uid ? 'block' : 'hidden'}`}>
                                        <div className={`bg-[#D25A5A] text-white shadow-custom relative w-full p-3 sm:px-5 rounded-lg flex flex-col`}>
                                            <p className='font-semibold'>"Your post has been removed due to: {data?.reason}. Please review our guidelines to ensure your future posts comply. If you have any questions or believe this was a mistake, feel free to contact our support team."</p>
                                        </div>
                                    </div>
                                </div>

                                {/* REPORTED USER */}
                                <div className={`${isUser ? 'block' : 'hidden'} bg-[#E9E9E9] md:rounded-lg p-5 sm:p-7 w-full`}>
                                    <p className='font-semibold mb-2'>{isUser ? 'Reported User' : 'Posted By'}:</p>
                                    <div className='bg-secondary shadow-custom relative w-full p-3 sm:p-5 rounded-lg gap-3 flex flex-col sm:flex-row sm:justify-between justify-center items-center'>
                                        <div className='flex flex-col gap-3 justify-center items-center sm:flex-row'>
                                            <img className='w-14 h-14  bg-text rounded-full object-cover' src={reported?.profilePictureURL} alt="" />
                                            <p className='font-medium text-lg leading-4'>{isUser ? data?.reportedName : reported?.fullName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* POST REPORTED */}
                                <div className={`${isUser ? 'hidden' : 'block'} bg-[#E9E9E9] md:rounded-lg p-5 sm:p-7 w-full`}>
                                    <p className='font-semibold mb-2'>Reported Post:</p>
                                    <div className='flex flex-col mt-3 lg:mt-4 bg-secondary pt-6 py-4 px-5 md:px-7 sm:mx-auto lg:mx-0 mb-3 w-full text-text sm:w-[97%] lg:w-full rounded-lg shadow-custom'>
                                        {/* USER INFORMATION */}
                                        <div className='flex w-full'>
                                            <img src={reported?.profilePictureURL} className='w-10 h-10 bg-[#D9D9D9] rounded-full' />
                                            <div className='ml-2'>
                                                <p className='font-medium'>{post?.userName} <span className='text-xs sm:text-sm sm:px-3 font-normal ml-1 text-white rounded-full px-2' style={{backgroundColor: post?.typeOfPost === 'story' ? '#A87CCD' : post?.typeOfPost === 'missing' ? '#ED5050' : '#85B728'}}>{post?.typeOfPost}</span></p>
                                                <p className='-mt-[3px] text-xs'>{getTimeDifference(post?.createdAt)}</p>
                                            </div>
                                        </div>

                                        {/* CAPTION */}
                                        <div className='mt-2'>
                                            <p className='font-medium whitespace-pre-wrap text-sm sm:text-base'>{post?.caption}</p>
                                        </div>

                                        {/* IMAGES */}
                                        <div className='flex gap-2 md:gap-3 justify-center mt-2 object-cover sm:w-[80%] sm:mx-auto'>
                                            {post?.images && post?.images.length > 0 && ( 
                                                post?.images.map((img, index) => <img src={img} key={index} onClick={() => showModal(img)} className='w-full cursor-pointer object-cover overflow-hidden max-w-40 h-48 md:h-52 bg-[#D9D9D9] rounded-md' />
                                            ))}
                                        </div>

                                        {/* LIKES AND COMMENTS */}
                                        <div className='my-3 flex '>
                                            <div className='justify-between w-full flex'>
                                                <div className='items-center flex '>
                                                    <img className='w-5' src={like} alt="" />
                                                    <p className='text-sm ml-2'>{post?.likeCount}</p>
                                                </div>
                                                <div className='items-center flex ' style={{ display: post?.commentCount <= 0 ? 'none' : 'flex'}}>
                                                    <p className='text-sm ml-2'>{post?.commentCount} comment{post?.commentCount > 1 ? 's' : ''}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* REASON */}
                                <div className={`${data?.reportedUser?.uid === user.uid ? 'hidden' : 'block'} bg-[#E9E9E9] md:rounded-lg p-5 sm:p-7 w-full`}>
                                    <p className='font-semibold mb-2'>Reason: </p>
                                    <div className='bg-secondary shadow-custom relative w-full p-3 sm:px-5 rounded-lg flex flex-col'>
                                        <p className='font-semibold'>{data?.reason}</p>
                                        <p className=''>{data?.additionalDetails}</p>
                                    </div>
                                </div>

                            </div>
                        </>
                    )}


                </div>
            </div>
        </div>
    )
}

export default Reported