import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useImageModal } from '../../General/ImageModalContext';
import paws from './assets/paws.svg';
import { AuthContext } from '../../General/AuthProvider';
import { confirm, successAlert } from '../../General/CustomAlert';
import Reason from './Reason';

function Verification() {
    const {user} = useContext(AuthContext);
    const {verifyID} = useParams();
    const [verificationData, setVerificationData] = useState(null);
    const [userData, setUserData] = useState(null);
    const {showModal} = useImageModal();
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVerificationData = async () => {
            try {
                // Fetch verification request data first
                const verificationRef = doc(db, "pendingVerification", verifyID);
                const verificationSnap = await getDoc(verificationRef);

                if (verificationSnap.exists()) {
                    const verificationInfo = verificationSnap.data();
                    setVerificationData(verificationInfo);

                    // Fetch user profile using userID from verification data
                    const userRef = doc(db, "users", verificationInfo.userID);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setUserData(userSnap.data());
                    } else {
                        console.log("User profile not found.");
                    }
                } else {
                    console.log("Verification request not found.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchVerificationData();
    }, [verifyID]);


    const handleAccept = async () => {
        confirm(`Approve Verification`, `Are you sure you want to approve ${userData.fullName}'s identity verification?`).then(async (result) => {
            if(result.isConfirmed){
                try {
                    const userRef = doc(db, "users", verificationData.userID);
                    const verifiedUserRef = doc(db, "verifiedUsers", verificationData.userID);
                    const pendingRef = doc(db, "pendingVerification", verifyID);
                    const notificationRef = doc(db, "notifications", `${verificationData.userID}_verification`);
        
                    // Update user to be verified
                    await updateDoc(userRef, { isVerified: true });
        
                    // Move data to verifiedUsers
                    await setDoc(verifiedUserRef, { ...verificationData, verifiedAt: new Date() });
        
                    // Delete from pendingVerification
                    await deleteDoc(pendingRef);
        
                    // Send notification
                    await setDoc(notificationRef, {
                        content: "has been approved!",
                        senderName: 'Your identity verification',
                        type: 'verification',
                        image: paws,
                        senderId: user.uid,
                        userId: verificationData.userID,
                        isRead: false,
                        timestamp: serverTimestamp(),
                    });
        
                    successAlert("Verification Approved!");
                    navigate(`/admin/user-management/profile/${verificationData.userID}`); 
                } catch (error) {
                    console.error("Error accepting verification:", error);
                }
            }
        });

    };

    const toggleReject = () => {
        setIsRejectOpen(!isRejectOpen);
    }


    return (
        <div className='pt-36 lg:pt-20 lg:pl-56 pb-3 lg:ml-3 sm:px-3 z-30 lg:pr-3 flex flex-col font-poppins text-text'>
            <div className='bg-secondary flex flex-col mt-3 py-3 px-5 sm:p-5 relative w-full shadow-custom h-full min-h-[calc(100dvh-170px)] lg:min-h-[calc(100dvh-105px)] sm:rounded-md lg:rounded-lg'>
                <img onClick={() => window.history.back()} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <p className='text-2xl sm:text-3xl text-center pt-7 font-semibold'>Identity Verification</p>
                
                <div className='flex flex-col justify-center flex-grow items-center my-7'>
                    {/* ID PICTURE */}
                    <div className='flex flex-col items-center gap-2'>
                        <div className='flex justify-center overflow-hidden items-center bg-text w-60 sm:w-72 h-36 sm:h-40 shadow-custom rounded-md'>
                            <img onClick={() => showModal(verificationData?.idPic)} className='w-full cursor-pointer object-cover ' src={verificationData?.idPic} alt="" />
                        </div>
                    </div>

                    {/* INFORMATION */}
                    <div className='mt-8 w-full max-w-[40rem] flex flex-col gap-3 lg:mt-10'>
                        <div className='w-full flex justify-between p-3 bg-[#D9D9D9] rounded-md'>
                            <div className='flex gap-3 items-center'>
                                <img className='w-10 h-10 rounded-full object-cover' src={userData?.profilePictureURL} alt="" />
                                <p className='font-medium pr-2 leading-5'>{userData?.fullName}</p>
                            </div>
                            <button onClick={() => navigate(`/admin/user-management/profile/${userData.uid}`)} className='bg-primary hover:bg-primaryHover duration-150 text-white font-medium leading-3 text-xs px-2 rounded-md'>View Profile</button>
                        </div>

                        <div className='w-full flex gap-3'>
                            <div className='bg-[#D9D9D9] text-sm sm:text-base w-full rounded-md p-3'>
                                <p>Full Name</p>
                                <p className='font-semibold'>{verificationData?.fullName}</p>
                            </div>
                            <div className='bg-[#D9D9D9] text-sm sm:text-base w-full rounded-md p-3'>
                                <p>Birthday</p>
                                <p className='font-semibold'>{new Date(verificationData?.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className='w-full flex gap-3'>
                            <div className='bg-[#D9D9D9] text-sm sm:text-base w-full rounded-md p-3'>
                                <p>Type of ID</p>
                                <p className='font-semibold'>{verificationData?.typeOfId}</p>
                            </div>
                            <div className='bg-[#D9D9D9] text-sm sm:text-base w-full rounded-md p-3'>
                                <p>ID Number</p>
                                <p className='font-semibold'>{verificationData?.idNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className='mt-10 flex gap-5'>
                        <button onClick={() => handleAccept()} className='bg-[#84B725] hover:bg-[#71a315] duration-150 px-3 py-2 font-medium text-sm text-white rounded-md'>APPROVE</button>
                        <button onClick={toggleReject} className='bg-[#D25A5A] hover:bg-[#b64f4f] duration-150 px-3 py-2 font-medium text-sm text-white rounded-md'>REJECT</button>
                    </div>
                    
                </div>

                {/* REJECT */}
                <div className={`${isRejectOpen ? 'block' : 'hidden'}`}>
                    <Reason verificationData={verificationData} userData={userData} closeReject={toggleReject} />
                </div>

            </div>
        </div>
    )
}

export default Verification