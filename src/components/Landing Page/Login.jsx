import React, {useContext, useState} from 'react'
import close from './assets/close.svg'
import logo from './assets/white-logo.png'
import image from './assets/login-pic.jpg'
import google from './assets/google.png'
import { useNavigate } from 'react-router-dom'
import { notifyErrorOrange, notifySuccessOrange } from '../General/CustomToast'
import { auth, provider, signInWithPopup, db } from '../../firebase/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { AuthContext } from '../General/AuthProvider'


function Login({ isOpen, onClose, handleCreateClick, handleLogin }) {
    const {user, userData} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Get the user's profile information
            const uid = user.uid;
            const fullName = user.displayName;
            const email = user.email;
            const profilePictureURL = user.photoURL;

            // Check if the user already exists in Firestore
            const userRef = doc(db, 'users', uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                // If the user does not exist, create a new document in Firestore
                await setDoc(userRef, {
                    uid,
                    createdAt: new Date(),
                    fullName,
                    email,
                    profilePictureURL,
                    role: 'user'
                });
            }

            const updatedUserSnapshot = await getDoc(userRef);
            
            const role = updatedUserSnapshot.data().role;

            if(role) {
                if (role === 'admin') {
                    navigate('/admin/pet-management');
                    notifySuccessOrange('Login Successfully!');
                }
                else if(role === 'user'){
                    navigate('/dashboard/find-pet');
                    notifySuccessOrange('Login Successfully!');
                }  
            }

        }
        catch (error) {
            console.error('Error during Google login:', error);
            notifyErrorOrange("Failed to log in with Google.")
        }
    }

    

     
    return (
        <div style={{
                right: isOpen ? '0' : '-50rem',
                transition: 'right 0.5s ease-in-out',
                }}
        className='fixed top-0 bg-secondary z-30 w-full md:w-96 min-h-screen max-h-screen justify-between flex flex-col overflow-auto'>
        
            <div className='w-full relative flex flex-col py-6 sm:pt-8 sm:pb-6 items-center justify-center'>
                <img className='w-52 mb-6' src={logo} alt="" />
                <button onClick={onClose} className='absolute top-4 right-4 p-1 duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959]'>
                    <img className='w-6 h-sm:w-7' src={close} alt="" />
                </button>
                <div className='w-full h-52 h-sm:h-64'>
                    <img className='object-cover w-full h-full' src={image} alt="" />
                </div>
                <div className='w-[80%] py-16'>
                    <p className='text-4xl text-text font-semibold'>Login to <br /> start adopting.</p>
                </div>
            </div>
            <div className='flex flex-col items-center h-full'>
                <div className='w-[80%] flex gap-2 h-full items-end'>
                    <button onClick={handleCreateClick} className='w-full py-3 h-sm:py-4 font-medium rounded-lg border-2 hover:bg-[#df4545] hover:border-[#df4545] duration-150 border-primary bg-primary text-secondary'>Create Account</button>
                    <button onClick={handleLogin} className='w-full py-3 h-sm:py-4 font-medium rounded-lg border-2 hover:bg-[#ffdddd] duration-150 border-primary text-primary'>Log in</button>
                </div>
                <div className='w-[80%] my-5'>
                    <div className='h-[1.3px] w-full relative bg-[#9e9e9e]'>
                        <div className='absolute -top-3 w-full text-center'>
                            <p className='text-sm bg-secondary text-[#9e9e9e] font-medium inline-block px-3'>or continue with</p> 
                        </div>
                    </div>
                </div>
                <div className='w-[80%] pb-10 flex '>
                    <button onClick={handleGoogleLogin} className='w-full relative py-2 h-sm:py-3 font-medium rounded-lg border-2 text-[#858585] border-[#a8a8a8] hover:bg-[#e9e9e9] bg-[#FAFAFA] duration-150'>Log in with Google
                        <img className='absolute top-[7px] h-sm:top-[11px] left-[14px] w-[25px]' src={google} alt="" />
                    </button>
                </div>
            </div>
        </div>
    
    )
}

export default Login