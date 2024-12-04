import React, { useContext, useState } from 'react'
import close from './assets/close-dark.svg'
import { notifyErrorOrange } from '../../General/CustomToast';
import { successAlert } from '../../General/CustomAlert';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/firebase';
import { AuthContext } from '../../General/AuthProvider';
import emailjs from '@emailjs/browser';

function RemovePet({petName, pet, closeUI}) {
    const {user} = useContext(AuthContext);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRemovePet = async () => {
        setLoading(true);

        if(!reason.trim()){
            notifyErrorOrange('Plase provide a reason for rejection.');
            setLoading(false)
            return;
        }

        try{
            const applicationRef = doc(db, 'petsForAdoption', pet.petID);

            const applicationSnap = await getDoc(applicationRef);

            const applicationData = applicationSnap.data();

            await setDoc(doc(db, 'removedPets', pet.petID), {
                ...applicationData,
                petImage: pet.petImages[1],
                status: 'removed',
                reasonRemoved: reason,
                removedAt: serverTimestamp(),
            });

            const ownerDocRef = doc(db, 'users', pet.userID);
            const ownerDocSnap = await getDoc(ownerDocRef);
            const ownerData = ownerDocSnap.data();

            // Check lastActive timestamp
            if (ownerData && ownerData.lastActive) {
                const now = Timestamp.now();
                const lastActive = ownerData.lastActive;
                const differenceInMinutes = (now.toMillis() - lastActive.toMillis()) / (1000 * 60);

                if (differenceInMinutes >= 3) {
                    // Send email notification if the post owner has been inactive for 3 minutes or more
                    await sendEmailNotification(
                        ownerData.email
                        ,`Your pet has been removed in HomePaws!`,
                        `${pet.petName} has been removed from pet for adoption.\nclick here: https://paws-ae1eb.web.app/`,
                    );
                }
            }

            // NOTIFICATION
            const notificationRef = collection(db, 'notifications');
            await addDoc(notificationRef, {
                content: 'has been removed from pet for adoption.',
                petID: pet.petID,
                type: 'removed',
                image: pet.petImages[1],
                senderName: pet.petName,
                senderId: user.uid,
                userId: pet.userID,
                isRead: false,
                timestamp: serverTimestamp(),
            });

            await deleteDoc(applicationRef);

            successAlert('Pet Successfully Removed!')
            navigate('/admin/pet-management');
        }
        catch(error){
            console.error(error);
            notifyErrorOrange('Failed to submit. Please try again.');
        }
        finally{
            setLoading(false);
        }

    }

    // Function to send email notifications using EmailJS
    const sendEmailNotification = async (recipientEmail, subject, message) => {
        try {
            const templateParams = {
                subject: subject,
                message: message,
                email: recipientEmail
            };

            // Replace these with your EmailJS credentials
            const SERVICE_ID = 'service_yii1sji';
            const TEMPLATE_ID = 'template_eti1vex';
            const USER_ID = 'JT0EGxZqCSR3-9IIa';

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
            console.log(`Email notification sent to ${recipientEmail}`);
        } catch (error) {
            console.error('Failed to send email notification: ', error);
        }
    };

    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/70'>
            <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-[50%] rounded-lg py-3 flex flex-col">
                <img onClick={closeUI} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Remove Pet</h1>
                
                {/* REASON OF REJECTION */}
                <div className='pt-4 pb-11 flex-grow'>
                    <p className='font-medium pb-1 text-lg'>Reason for removing {petName}:</p>
                    <textarea required onChange={(e) => setReason(e.target.value)} value={reason} className='py-2 mb-5 w-full h-full px-3 outline-none rounded-md' placeholder='State your reason...'></textarea>
                </div>
                
                <div className='flex justify-center'>
                    <button onClick={handleRemovePet} className='bg-primary hover:bg-primaryHover duration-150 py-2 px-5 rounded-md text-white'>{loading ? 'Submitting...' : 'Submit'}</button>
                </div>
                
            </div>
        </div>
    )
}

export default RemovePet