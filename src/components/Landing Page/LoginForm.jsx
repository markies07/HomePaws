import React, {useState} from 'react'
import close from './assets/close.svg'
import logo from './assets/white-logo.png'
import image from './assets/login-image.jpg'
import email_icon from './assets/email.svg'
import password_icon from './assets/password.svg'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { notifySuccessOrange, notifyErrorOrange } from '../General/CustomToast'
import { useNavigate } from 'react-router-dom'

function LoginForm({loginOpen, loginClose}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            notifySuccessOrange("Login Successfully!");
            navigate('/dashboard');
        }
        catch(error){
            console.error('Login error:', error);
            if (error.code === 'auth/invalid-credential') {
                notifyErrorOrange('Incorrect email/password.');
            } 
            else if (error.code === 'auth/too-many-requests') {
                notifyErrorOrange('Your account has been temporarily disabled due to too many failed login attempts. Please reset your password or try again later.');
            } 
            else {
                notifyErrorOrange('Login failed. Please try again.');
            }
        }
        
        
    } 

    const handleForgotPassword = async () => {
        if (!email) {
            notifyErrorOrange("Please enter your email address first.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            notifySuccessOrange('Password reset email sent! Check your inbox.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            notifyErrorOrange('Failed to send password reset email. Please try again.');
        }
    };

    

    return (
        <div 
        style={{
        right: loginOpen ? '0' : '-50rem',
        transition: 'right 0.5s ease-in-out',}}
        className='fixed top-0 right-0 bg-secondary z-40 w-full md:w-96 min-h-screen max-h-screen flex flex-col overflow-auto'>
            <div className='w-full relative flex flex-col py-6 sm:pt-8 sm:pb-6 items-center justify-center'>
                <img className='w-52' src={logo} alt="" />
                <button onClick={loginClose} className='absolute top-4 right-4 p-1 duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959]'>
                    <img className='w-6 h-sm:w-7' src={close} alt="" />
                </button>
            </div>
            <div className='w-full flex justify-center h-52 sm:h-64'>
                <img className='object-cover sm:w-[80%] md:w-full w-full h-full' src={image} alt="" />
            </div>
            <div className='flex flex-col items-center'>
                <h1 className='text-3xl font-semibold text-text py-7'>Login your account</h1>
                <form onSubmit={handleLogin} className='w-full flex flex-col items-center px-10 sm:px-36 md:px-10 mt-2 text-text'>
                    <div className='mb-2 w-full relative'>
                        <img className='absolute top-3 left-4 w-6' src={email_icon} alt="" />
                        <input autoComplete='off' required onChange={(e) => setEmail(e.target.value)} value={email} className='w-full mb-1 py-3 pr-3 pl-14 rounded-lg outline-none bg-[#D9D9D9]' type="email" placeholder='Enter Email' />
                    </div>
                    <div className=' w-full relative'>
                        <img className='absolute top-[9px] left-4 w-6 h-7' src={password_icon} alt="" />
                        <input autoComplete='off' required onChange={(e) => setPassword(e.target.value)} value={password} className='w-full py-3 pr-3 pl-14 rounded-lg outline-none bg-[#D9D9D9]' type="password" placeholder='Enter Password' />
                    </div>
                    <p onClick={handleForgotPassword} className='w-full flex justify-end text-sm hover:opacity-90 duration-150 font-medium underline opacity-70 cursor-pointer my-3'>forgot password?</p>
                    <button className='bg-primary hover:bg-primaryHover duration-150 font-semibold mb-5 text-secondary py-3 px-7 rounded-lg mt-5'>Login</button>
                </form>
            </div>
        </div>
    )
    }

export default LoginForm