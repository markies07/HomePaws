import React, { useRef, useState } from 'react'
import close from './assets/close.svg'
import { confirm, successAlert } from '../../General/CustomAlert';
import { doc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import deact from './assets/deact-white.svg';

function DeactivateUser({data}) {
    const form = useRef();
    const [deactOpen, setDeactOpen] = useState(false);
    const navigate = useNavigate();

    const handleDeactivation = async (e) => {
        e.preventDefault();
    
        confirm(`Deactivating This User`, `Are you sure you want to deactivate ${data.fullName}?`).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData(form.current);
                const reactivationDate = formData.get('reactivationDate');
                const deactivationReason = formData.get('deactivationReason');
    
                try {
                    // ADD USER TO DEACTIVATEDUSERS
                    await setDoc(doc(db, 'deactivatedUsers', data.uid), {
                        userID: data.uid,
                        fullName: data.fullName,
                        email: data.email,
                        profilePictureURL: data.profilePictureURL,
                        deactivationReason: deactivationReason,
                        reactivationDate: reactivationDate,
                        deactivatedAt: serverTimestamp()
                    });

                    // Increment violationsCount in the users collection
                    const userRef = doc(db, 'users', data.uid);
                    await updateDoc(userRef, {
                        violationsCount: increment(1)
                    });
    
                    // Construct the message to send in the email
                    const emailData = {
                        subject: 'Account Deactivation Notice',
                        message: `Hello ${data.fullName}, your account has been deactivated due to "${deactivationReason}". Reactivation is scheduled for ${reactivationDate}.`,
                        email: data.email,
                    };
    
                    // Send the email with EmailJS
                    emailjs.send('service_yii1sji', 'template_eti1vex', emailData, 'JT0EGxZqCSR3-9IIa')
                        .then(() => {
                            successAlert(`${data.fullName} has been deactivated.`);
                        })
                        .catch((error) => {
                            console.error("Email failed to send", error);
                        });

                } catch (error) {
                    console.error("Error deactivating user:", error);
                } finally {
                    navigate('/admin/user-management');
                }
            }
        });
    }; 

    const toggleDeact = () => {
        setDeactOpen(!deactOpen);
    }

    return (
        <>
            <div className='w-full flex justify-center'>
                <button onClick={toggleDeact} className='bg-[#67B1B1] flex items-center text-sm hover:bg-[#559b9b] sm:w-60 sm:px-3 sm:whitespace-nowrap duration-150 py-2 text-white rounded-md w-full leading-3 font-medium'><img className='w-7 mx-5' src={deact} alt="" /> DEACTIVATE USER</button>
            </div>

            {/* SET UP DATE */}
            <form ref={form} onSubmit={handleDeactivation} className={`${deactOpen ? 'flex' : 'hidden'} fixed inset-0 justify-center items-center z-50 bg-black/65`}>
                <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[27rem] h-auto rounded-lg py-5 flex flex-col">
                    <img onClick={toggleDeact} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                    <h1 className='shrink-0 text-2xl font-semibold  sm:pt-0 mb-3'>Deactivate User</h1>
                    <div className='mt-3'>
                        <input type="text" className="hidden" defaultValue="Account Deactivation Notice" name="subject" />
                        <textarea className="hidden" name="message" />
                        <input type="text" className="hidden" defaultValue={data.email} name="email" />
                        <div className='w-full flex flex-col gap-4 items-center justify-center'>
                            <div className='w-[90%]'>
                                <p className='font-semibold'>Date of Reactivation</p>
                                <input required name='reactivationDate' min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="date" />
                            </div>
                            <div className='w-[90%]'>
                                <p className='font-semibold'>Reason of Deactivation</p>
                                <textarea required name='deactivationReason' className='py-2 w-full h-24 px-2 text-sm sm:text-base border-2 outline-none border-text rounded-md' placeholder='State your reason...'></textarea>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className='flex justify-center gap-2 pt-7'>
                            <button type='submit' className='bg-primary hover:bg-primaryHover cursor-pointer duration-150 font-medium gap-2 text-white py-1 px-5 rounded-md'>SUBMIT</button>
                        </div>
                    </div>
                </div>
            </form>
            
        </>
    )
}

export default DeactivateUser