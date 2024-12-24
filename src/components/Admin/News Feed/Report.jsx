import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close-dark.svg'
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import { addDoc, collection, doc, getDoc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../General/AuthProvider';
import { db } from '../../../firebase/firebase';
import { confirm, successAlert } from '../../General/CustomAlert';

function Report({postID, closeReport}) {
    const {user, userData} = useContext(AuthContext);
    const [selectedReason, setSelectedReason] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleReasonClick = (reason) => {
        setSelectedReason(reason);
    };

    useEffect(() => {
        const fetchPostData = async () => {
            if(postID){
                try {
                    const postRef = doc(db, 'userPosts', postID);
                    const postSnapshot = await getDoc(postRef);
                    if (postSnapshot.exists()) {
                        setData(postSnapshot.data());
                    } else {
                        console.error('Post not found');
                    }
                } catch (error) {
                    console.error('Error fetching post data:', error);
                }
            }
        };

        fetchPostData();
    }, [postID]);

    const handleRemovePost = async () => {
        if (!selectedReason) {
            notifyErrorOrange('Please select a reason for removing the post.');
            return;
        }

        setLoading(true);
        confirm('Removing Post', 'Are you sure you want to remove this post?').then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Generate a report in the userReports collection
                    const reportData = {
                        reportedBy: user.uid,
                        reportedByName: 'Admin',
                        profilePictureURL: userData.profilePictureURL,
                        postID: postID,
                        read: true, // Mark as read since the admin is handling it
                        reason: selectedReason,
                        additionalDetails: additionalDetails || '',
                        reportedAt: serverTimestamp(),
                        type: 'post',
                        status: 'resolved',
                    };

                    const reportRef = await addDoc(collection(db, 'userReports'), reportData);
                    const reportID = reportRef.id;

                    // Mark the post as removed in Firestore
                    const postRef = doc(db, 'userPosts', postID);
                    await updateDoc(postRef, {
                        isBanned: true, // Flag the post as removed
                        removedReason: selectedReason,
                        additionalDetails: additionalDetails || '',
                        removedAt: serverTimestamp(),
                        reportID: reportID, // Link the report ID to the post
                    });

                    // Add a notification to the post owner
                    await addDoc(collection(db, 'notifications'), {
                        userId: data?.userID, // Notify the post owner
                        type: 'report',
                        senderName: 'Admin:',
                        senderID: user.uid,
                        reportType: 'post',
                        isRead: false,
                        image: userData.profilePictureURL,
                        content: `Your post has been removed due to a violation of our guidelines: ${selectedReason}.`,
                        timestamp: serverTimestamp(),
                        reportID: reportID, // Include the report ID for reference
                    });

                    // Increment the user's violations count
                    const userRef = doc(db, 'users', data?.userID);
                    await updateDoc(userRef, {
                        violationsCount: increment(1),
                    });

                    successAlert('Post removed successfully!');
                    closeReport(); // Close the modal

                    // Reload the page after a short delay
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } catch (error) {
                    console.error('Error removing post:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });
    };

    const closeIt = () => {
        closeReport();
        setSelectedReason('');
        setAdditionalDetails('');
    };


    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/20'>
            <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-[80%] rounded-lg py-3 flex flex-col">
                <img onClick={closeIt} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Remove Post</h1>
                <p className='font-medium'>Reason of removing this post</p>

                {/* CHOICES */}
                <div className='flex mt-2 w-full flex-col gap-2'>
                    <p onClick={() => handleReasonClick('Irrelevant Post')} className={`${selectedReason === 'Irrelevant Post' ? 'border-primary text-primary' : 'border-transparent text-text'} bg-secondary border-2 text-center sm:text-start w-full rounded-md py-3 px-3 font-medium cursor-pointer`}>Irrelevant Post</p>
                    <p onClick={() => handleReasonClick('Inappropriate Content')} className={`${selectedReason === 'Inappropriate Content' ? 'border-primary text-primary' : 'border-transparent text-text'} bg-secondary border-2 text-center sm:text-start w-full rounded-md py-3 px-3 font-medium cursor-pointer`}>Inappropriate Content</p>
                    <p onClick={() => handleReasonClick('Inappropriate Behavior Toward Animals')} className={`${selectedReason === 'Inappropriate Behavior Toward Animals' ? 'border-primary text-primary' : 'border-transparent text-text'} bg-secondary border-2 text-center sm:text-start w-full rounded-md py-3 px-3 font-medium cursor-pointer`}>Inappropriate Behavior Toward Animals</p>
                </div>

                {/* MORE DETAILS */}
                <div className='pt-4 pb-11 flex-grow'>
                    <p className='font-medium pb-1'>Additional details:</p>
                    <textarea required value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} className='py-2 mb-5 w-full h-full px-3 outline-none rounded-md' placeholder='State your reason...'></textarea>
                </div>
                
                <div className='flex justify-center'>
                    <button onClick={handleRemovePost} className='bg-primary hover:bg-primaryHover duration-150 py-2 px-5 rounded-md text-white'>{loading ? 'Removing...' : 'Remove Post'}</button>
                </div>
                
            </div>
        </div>
    )
}

export default Report