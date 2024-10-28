import React, { useContext, useState } from 'react'
import close from './assets/close-dark.svg'
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { AuthContext } from '../../General/AuthProvider';
import { useNavigate } from 'react-router-dom';

function CancelRehome({data, pet, closeCancel}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {user, userData} = useContext(AuthContext);
    const [cancelReason, setCancelReason] = useState('');

    const handleCancelRehome = async () => {
        setLoading(true);

        if(!cancelReason.trim()){
            notifyErrorOrange('Plase provide a reason for cancelation.');
            setLoading(false)
            return;
        }

        try{
            const applicationRef = doc(db, 'adoptionApplications', data.applicationID);
            const applicationSnap = await getDoc(applicationRef);
            const applicationData = applicationSnap.data();

            // STORING IN REJECTED ADPPLICATIONS
            await setDoc(doc(db, 'rejectedApplications', data.applicationID), {
                ...applicationData,
                canceledBy: user.uid,
                adopterID: data.adopterUserID,
                applicationID: data.applicationID,
                petID: data.petID,
                fullName: userData.fullName,
                cancelReason: cancelReason,
                rejectedAt: serverTimestamp(),
                status: 'rejected',
                petOwnerID: data.petOwnerID,
            });

            await updateDoc(applicationRef, {
                status: 'rejected',
            });

            // Query and delete all notifications related to this applicationID
            const notificationsRef = collection(db, 'notifications');
            const notificationQuery = query(notificationsRef, where('applicationID', '==', data.applicationID));
            const notificationSnapshots = await getDocs(notificationQuery);
            const deletePromises = notificationSnapshots.docs.map((doc) => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // NOTIFICATION
            
            await addDoc(notificationsRef, {
                content: `canceled rehoming ${pet.petName}.`,
                applicationID: data.applicationID,
                type: 'rejected',
                image: pet.petImages[0],
                senderName: userData.fullName,
                senderId: user.uid,
                userId: data.adopterUserID !== user.uid ? data.adopterUserID : data.petOwnerID,
                isRead: false,
                timestamp: serverTimestamp(),
            });

            // DELETING DOCUMENTS
            await deleteDoc(doc(db, "acceptedApplications", data.applicationID));
            await deleteDoc(doc(db, "adoptionApplications", data.applicationID));

            notifySuccessOrange('Canceled successfully!');
            setTimeout(() => {
                navigate('/dashboard/profile')
            }, [2000]);
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
                <img onClick={closeCancel} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Cancel Rehome</h1>
                
                {/* REASON OF REJECTION */}
                <div className='pt-4 pb-11 flex-grow'>
                    <p className='font-medium pb-1 text-lg'>Reason for canceling</p>
                    <textarea required onChange={(e) => setCancelReason(e.target.value)} value={cancelReason} className='py-2 mb-5 w-full h-full px-3 outline-none rounded-md' placeholder='State your reason...'></textarea>
                </div>
                
                <div className='flex justify-center'>
                    <button onClick={handleCancelRehome} className='bg-primary hover:bg-primaryHover duration-150 py-2 px-5 rounded-md text-white'>{loading ? 'Submitting...' : 'Submit'}</button>
                </div>
                
            </div>
        </div>
    )
}

export default CancelRehome