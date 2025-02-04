import React, { useEffect, useState } from 'react'
import close from './assets/close.svg'
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function VerifyReq({closeVerify}) {
    const [usersData, setUsersData] = useState([]);
    const [verificationData, setVerificationData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVerify = async () => {
            setLoading(true);
            try {
                // Fetch pending verification requests
                const q = query(collection(db, 'pendingVerification'), orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const verificationRequests = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
    
                // Extract all userIDs from pendingVerification
                const userIDs = verificationRequests.map(req => req.userID);
    
                // Fetch user details separately
                const userPromises = userIDs.map(async (userID) => {
                    const userRef = doc(db, 'users', userID);
                    const userSnap = await getDoc(userRef);
                    return userSnap.exists() ? { userID, ...userSnap.data() } : null;
                });
    
                const usersData = await Promise.all(userPromises);
    
                // Store data separately
                setVerificationData(verificationRequests);
                setUsersData(usersData.filter(user => user !== null)); // Remove null users
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchVerify();
    }, []);
    

    const openVerify = async (verifyID) => {
        const verifyRef = doc(db, 'pendingVerification', verifyID);

        await updateDoc(verifyRef, {
            isRead: true
        })

        navigate(`/admin/user-management/verification/${verifyID}`);

    }


    return (
        <div className='lg:pl-3 w-full relative flex flex-col font-poppins text-text'>
            <div className='flex relative bg-secondary sm:mx-auto min-h-[calc(100dvh-170px)] lg:min-h-[calc(100dvh-105px)] lg:mx-0 flex-grow mb-3 w-full text-text sm:w-[97%] lg:w-full sm:rounded-md lg:rounded-lg shadow-custom'>
                <img onClick={closeVerify} className='w-9 z-10 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <div className='p-5 md:px-7 w-full'>
                    <div className='flex relative justify-between'>
                        <h1 className='text-2xl font-semibold'>Verification Requests</h1>
                    </div>
                    <div className='mt-5 lg:mt-7 flex flex-col gap-3'>

                        {/* PROFILES */}
                        {loading ? (
                            <div className="text-center text-gray-500 font-medium py-5 bg-[#E9E9E9] rounded-md">
                                Loading...
                            </div>
                        ) : verificationData.length > 0 ? (
                            verificationData.map((request) => {
                                // Find the user associated with the verification request
                                const user = usersData.find(user => user.userID === request.userID);

                                return (
                                    <div 
                                        key={request.id} 
                                        onClick={() => openVerify(request.id)} 
                                        className="bg-[#E9E9E9] relative flex items-center hover:bg-[#d3d3d3] duration-150 cursor-pointer w-full p-3 pr-10 rounded-lg"
                                    >
                                        {/* Profile Image */}
                                        <div className="relative w-12 h-12 shrink-0">
                                            <img 
                                                className="w-full h-full object-cover rounded-full" 
                                                src={user?.profilePictureURL} 
                                                alt="Profile"
                                            />
                                        </div>

                                        {/* User Details */}
                                        <div className="pl-3 sm:pl-4 flex flex-col justify-center">
                                            <p className="font-semibold text-sm sm:text-base leading-4">
                                                {user?.fullName}{" "}
                                                <span className="font-normal">submitted identity verification.</span>
                                            </p>
                                        </div>

                                        {/* Notification Badge (if unread) */}
                                        {!request.isRead && (
                                            <div className="absolute right-3 sm:right-5 top-0 h-full flex items-center">
                                                <div className="w-4 h-4 bg-primary rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-500 font-medium py-5 bg-[#E9E9E9] rounded-md">
                                No Request
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyReq