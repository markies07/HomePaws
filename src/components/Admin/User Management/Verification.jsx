import React, { useEffect, useState } from 'react'
import close from './assets/close.svg'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

function Verification() {
    const {verifyID} = useParams();
    const [verificationData, setVerificationData] = useState(null);
    const [userData, setUserData] = useState(null);

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


    return (
        <div className='pt-36 lg:pt-20 lg:pl-56 pb-3 lg:ml-3 sm:px-3 z-30 lg:pr-3 flex flex-col font-poppins text-text'>
            <div className='bg-secondary flex flex-col mt-3 py-3 px-5 sm:p-5 relative w-full shadow-custom h-full min-h-[calc(100dvh-170px)] lg:min-h-[calc(100dvh-105px)] sm:rounded-md lg:rounded-lg'>
                <img onClick={() => window.history.back()} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <p className='text-2xl sm:text-3xl text-center pt-7 font-semibold'>Identity Verification</p>
                
                <div className='flex flex-col justify-center flex-grow items-center my-7'>
                    {/* ID PICTURE */}
                    <div className='flex flex-col items-center gap-2'>
                        <div className='flex justify-center overflow-hidden items-center bg-text w-60 sm:w-72 h-36 sm:h-40 shadow-custom rounded-md'>
                            <img className='w-full object-cover ' src={verificationData?.idPic} alt="" />
                        </div>
                    </div>

                    {/* INFORMATION */}
                    <div className='mt-8 w-full max-w-[40rem] flex flex-col gap-3 lg:mt-10'>
                        <div className='w-full flex justify-between p-3 bg-[#D9D9D9] rounded-md'>
                            <div className='flex gap-3 items-center'>
                                <img className='w-10 h-10 rounded-full object-cover' src={userData?.profilePictureURL} alt="" />
                                <p className='font-medium pr-2 leading-5'>{userData?.fullName}</p>
                            </div>
                            <button className='bg-primary hover:bg-primaryHover duration-150 text-white font-medium leading-3 text-xs px-2 rounded-md'>View Profile</button>
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
                        <button className='bg-[#84B725] hover:bg-[#71a315] duration-150 px-3 py-2 font-medium text-sm text-white rounded-md'>ACCEPT</button>
                        <button className='bg-[#D25A5A] hover:bg-[#b64f4f] duration-150 px-3 py-2 font-medium text-sm text-white rounded-md'>REJECT</button>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}

export default Verification