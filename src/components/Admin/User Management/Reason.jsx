import React, { useContext, useState } from 'react'
import close from './assets/close.svg'
import paws from './assets/paws.svg';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { AuthContext } from '../../General/AuthProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { notifyErrorOrange } from '../../General/CustomToast';
import { db } from '../../../firebase/firebase';
import { confirm, successAlert } from '../../General/CustomAlert';

function Reason({verificationData, userData, closeReject}) {
    const {user} = useContext(AuthContext);
    const {verifyID} = useParams();
    const navigate = useNavigate();
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReject = async () => {
        if(reason === '') {
            notifyErrorOrange('Please enter the reason.');
            return;
        }
        confirm(`Reject Verification`, `Are you sure you want to reject ${userData.fullName}'s identity verification?`).then(async (result) => {
            if(result.isConfirmed){
                setLoading(true);
                try {
                    const rejectedRef = doc(db, "rejectedVerification", verificationData.userID);
                    const pendingRef = doc(db, "pendingVerification", verifyID);
                    const notificationRef = doc(db, "notifications", `${verificationData.userID}_verification`);
        
                    // Move data to rejectedVerification with reason
                    await setDoc(rejectedRef, { ...verificationData, rejectedAt: new Date(), reason });
        
                    // Delete from pendingVerification
                    await deleteDoc(pendingRef);
        
                    // Send notification
                    await setDoc(notificationRef, {
                        content: `has been rejected! Reason: ${reason}`,
                        senderName: `Your identity verification`,
                        type: 'verification',
                        image: paws,
                        senderId: user.uid,
                        userId: verificationData.userID,
                        isRead: false,
                        timestamp: serverTimestamp(),
                    });
        
                    successAlert("Verification Rejected!");
                    navigate(`/admin/user-management`); 
                } catch (error) {
                    console.error("Error rejecting verification:", error);
                    setLoading(false);
                }
                finally{
                    setLoading(false);
                }
            }
        });   
    };


    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/70'>
            <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-[50%] rounded-lg py-3 flex flex-col">
                <img className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' onClick={closeReject} src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Reject Verification</h1>
                
                {/* REASON OF REJECTION */}
                <div className='pt-4 pb-11 flex-grow'>
                    <p className='font-medium pb-1 text-lg'>Reason for rejection</p>
                    <textarea required onChange={(e) => setReason(e.target.value)} value={reason} className='py-2 mb-5 w-full h-full px-3 outline-none rounded-md' placeholder='State your reason...'></textarea>
                </div>
                
                <div className='flex justify-center'>
                    <button onClick={handleReject} className='bg-primary hover:bg-primaryHover duration-150 py-2 px-5 rounded-md text-white'>{loading ? 'Submitting...' : 'Submit'}</button>
                </div>
                
            </div>
        </div>
    )
}

export default Reason