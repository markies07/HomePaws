import React, { useRef, useState } from 'react'
import close from './assets/close-dark.svg'
import pic from './assets/animalpound.svg'
import location from './assets/location.svg'
import name from './assets/name.svg'
import email from './assets/emailform.svg'
import emailjs from '@emailjs/browser';
import { successAlert } from '../General/CustomAlert'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebase'


function ContactUs({closeContact}) {
    const [loading, setLoading] = useState(false);
    const form = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try{    
            const usersRef = collection(db, 'users');
            const adminQuery = query(usersRef, where('role', '==', 'admin'));
            const querySnapshot = await getDocs(adminQuery);

            const adminEmails = querySnapshot.docs.map((doc) => doc.data().email);

            // Construct the message to send in the email
            const emailData = {
                name: formData.name,
                emailAdd: formData.email,
                message: formData.message,
                email: adminEmails.join(", ")
            };
    
            // Send the email with EmailJS
            emailjs.send('service_yii1sji', 'template_tbq0xuh', emailData, 'JT0EGxZqCSR3-9IIa')
                .then(() => {
                    successAlert(`Your message has been sent!`);
                })
                .catch((error) => {
                    console.error("Email failed to send", error);
                });
            
            setFormData({
                name: "",
                email: "",
                message: "",
                });
        }
        catch(error){
            setLoading(false);
            console.error(error);
        }
        finally{
            setLoading(false);
            setTimeout(() => {
                closeContact();
            }, [1500])
        }
    }

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 bg-black/70`}>
            <div className="relative text-text  text-sm sm:text-base bg-secondary w-[85%] sm:w-[35rem] h-auto rounded-lg py-3 flex flex-col">
                <div className='absolute top-4 right-4 border-2 border-secondary hover:border-text cursor-pointer p-1 duration-150'>
                    <img onClick={closeContact} className='w-6 h-6 sm:w-7 sm:h-7' src={close} alt="" />
                </div>
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-2'>Contact Us</h1>

                <div className='px-5 sm:px-10 py-3 sm:py-7 flex flex-col w-full'>

                    {/* MESSAGE FORM */}
                    <form ref={form} onSubmit={handleSubmit} className='bg-[#cccccc] w-full flex flex-col gap-2  p-4  rounded-lg'>
                        <div className='relative'>
                            <input onChange={handleChange} required value={formData.name} className='w-full outline-none rounded-lg py-2 pl-12 ' type="text" placeholder='Name*' name="name" id="name" />
                            <img className='absolute w-5 h-5 top-2 mt-[1px] sm:mt-[3px] left-4' src={name} alt="" />
                        </div>
                        <div className='relative'>
                            <input onChange={handleChange} required value={formData.email}  className='w-full outline-none rounded-lg py-2 pl-12 ' type="email" placeholder='Email*' name="email" id="email" />
                            <img className='absolute w-5 h-5 top-2 mt-[1px] sm:mt-[3px] left-4' src={email} alt="" />
                        </div>
                        <textarea onChange={handleChange} required value={formData.message} name='message' className='py-1 w-full outline-none h-28 px-3 rounded-lg' placeholder='Enter your message'></textarea>
                        <button className='bg-primary mt-2 text-sm px-4 self-center hover:bg-primaryHover duration-150 py-1 sm:py-2 rounded-md text-white font-medium'>{loading ? 'SENDING' : 'SEND MESSAGE'}</button>
                    </form>

                </div>
                
            </div>
        </div>
    )
}

export default ContactUs