import React, { useContext, useState } from 'react'
import close from './assets/close-dark.svg'
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { AuthContext } from '../../General/AuthProvider';
import { useNavigate } from 'react-router-dom';

function Reject({petName, sendEmailNotification, application, closeReject, petImage}) {
    const [rejectReason, setRejectReason] = useState('');
    const [loading, setLoading] = useState(false);
    const {user, userData} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRejectApplication = async () => {
        setLoading(true);

        if(!rejectReason.trim()){
            notifyErrorOrange('Plase provide a reason for rejection.');
            setLoading(false)
            return;
        }

        try{
            const applicationRef = doc(db, 'adoptionApplications', application.applicationID);

            const applicationSnap = await getDoc(applicationRef);

            const applicationData = applicationSnap.data();

            await setDoc(doc(db, 'rejectedApplications', application.applicationID), {
                ...applicationData,
                petImage: petImage,
                status: 'rejected',
                rejectReason: rejectReason,
                rejectedAt: serverTimestamp(),
            });

            const adopterDocRef = doc(db, 'users', applicationData.adopterUserID);
            const adopterDocSnap = await getDoc(adopterDocRef);
            const adopterData = adopterDocSnap.data();
            
            // Check lastActive timestamp
            if (adopterData && adopterData.lastActive) {
                const now = Timestamp.now();
                const lastActive = adopterData.lastActive;
                const differenceInMinutes = (now.toMillis() - lastActive.toMillis()) / (1000 * 60);

                if (differenceInMinutes >= 3) {
                    // Send email notification if the post owner has been inactive for 3 minutes or more
                    await sendEmailNotification(
                        adopterData.email
                        ,`Your adoption application has been rejected.`,
                        `${petName}'s owner rejected your adoption application.\nclick here: https://paws-ae1eb.web.app/`,
                    );
                }
            }

            // NOTIFICATION
            const notificationRef = collection(db, 'notifications');
            await addDoc(notificationRef, {
                content: 'rejected your adoption application.',
                applicationID: application.applicationID,
                type: 'rejected',
                image: petImage,
                senderName: application.petName+'\'s pet owner',
                senderId: user.uid,
                userId: application.adopterUserID,
                isRead: false,
                timestamp: serverTimestamp(),
            });

            await deleteDoc(applicationRef);

            notifySuccessOrange('Submitted successfully!');
            navigate('/dashboard/profile');
        }
        catch(error){
            console.error(error);
            notifyErrorOrange('Failed to submit. Please try again.');
        }
        finally{
            setLoading(false);
        }

    }



    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/50'>
            <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-[50%] rounded-lg py-3 flex flex-col">
                <img onClick={closeReject} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Reject Application</h1>
                
                {/* REASON OF REJECTION */}
                <div className='pt-4 pb-11 flex-grow'>
                    <p className='font-medium pb-1 text-lg'>Reason for rejection</p>
                    <textarea required onChange={(e) => setRejectReason(e.target.value)} value={rejectReason} className='py-2 mb-5 w-full h-full px-3 outline-none rounded-md' placeholder='State your reason...'></textarea>
                </div>
                
                <div className='flex justify-center'>
                    <button onClick={handleRejectApplication} className='bg-primary hover:bg-primaryHover duration-150 py-2 px-5 rounded-md text-white'>{loading ? 'Submitting...' : 'Submit'}</button>
                </div>
                
            </div>
        </div>
    )
}

export default Reject