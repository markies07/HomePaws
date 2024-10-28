import React, { useState, useEffect } from 'react';
import logo from './assets/orange-logo.png'
import close from './assets/close-white.svg'
import picture from './assets/profile-pic.svg'
import pet from './assets/pet-image.png'
import { createUserWithEmailAndPassword, sendEmailVerification, auth, onAuthStateChanged } from '../../firebase/firebase'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { notifyErrorWhite, notifySuccessWhite, notifyInfoWhite } from '../General/CustomToast'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

function CreateAccount({ createOpen, createClose }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [user, setUser] = useState(null);
    const [pendingUserData, setPendingUserData] = useState(null);
    
    const navigate = useNavigate();

    const db = getFirestore();

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setProfilePicture(null);
        setIsVerifying(false);
        setUser(null);
        setPendingUserData(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("Auth state changed", currentUser);
            if (currentUser) {
                setUser(currentUser);
                if (user && user.emailVerified && isVerifying && pendingUserData) {
                    try {
                        createUserDocument(user, pendingUserData);
                        setIsVerifying(false);
                        notifySuccessWhite("Account created successfully!");
                        resetForm();
                    } catch (error) {
                        console.error("Error creating user document:", error);
                        notifyErrorWhite("Error creating account. Please try again.");
                    }
                }
                else if (isVerifying) {
                    console.log("Email not verified yet");
                }
            } else {
                setUser(null);
                setIsVerifying(false);
            }
        });

        return () => unsubscribe();
    }, [isVerifying, pendingUserData]);

    const createUserDocument = async (user, userData) => {
        let profilePictureURL = '';
        if (userData.profilePicture) {
            const storage = getStorage();
            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            await uploadBytes(storageRef, userData.profilePicture);
            profilePictureURL = await getDownloadURL(storageRef);
        }

        await setDoc(doc(db, 'users', user.uid), {
            fullName: userData.fullName,
            uid: user.uid,
            email: userData.email,
            profilePictureURL,
            createdAt: new Date(),
        });
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        console.log("Creating account...");
        if (password !== confirmPassword) {
            notifyErrorWhite("Passwords don't match!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Store the user data to be used after email verification
            setPendingUserData({
                fullName,
                email,
                profilePicture
            });

            // Send verification email
            await sendEmailVerification(newUser);
            setIsVerifying(true);
            notifyInfoWhite("Email verification email sent.");
        } catch (error) {
            console.error('Error creating account: ', error);
            notifyErrorWhite("An error occurred. Please try again.");
            setIsVerifying(false);
        }
    }

    const handleRefreshVerification = async () => {
        if (user) {
            try {
                await user.reload();
                if (user.emailVerified && pendingUserData) {
                    setIsVerifying(false);
                    await createUserDocument(user, pendingUserData);
                    notifySuccessWhite("Account created successfully.");
                    resetForm();
                    setTimeout(() => {
                        window.location.reload();
                    }, [2000])
                } else {
                    notifyInfoWhite("Email not verified yet. Please check your inbox.");
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Error refreshing user:", error);
                notifyErrorWhite("Error checking verification status. Please try again.");
            }
        } else {
            notifyErrorWhite("No user signed in. Please try again.");
        }
    }

    return (
        <div 
        style={{
            left: createOpen ? '0' : '-200rem',
            transition: 'left 0.7s ease-in-out',
            }}
        className='fixed z-40 top-0 bg-primary min-h-screen max-h-screen overflow-auto w-full flex flex-col text-text font-poppins'>
            <div className='w-full relative flex shrink-0 py-7 justify-center md:justify-start px-7'>
                <img draggable='false' className='w-48' src={logo} alt="" />
                <div onClick={createClose} className='absolute top-4 right-4 border-2 border-primary hover:border-secondary cursor-pointer p-1 duration-150'>
                    <img src={close} alt="" />
                </div>
            </div> 
            <div className='bg-secondary mb-10 h-full shrink-0 overflow-hidden mx-auto w-[95%] sm:w-[80%] md:w-[45rem] flex rounded-3xl shadow-[1px_1px_15px_2px_rgb(0,0,0,.13)]'>
                <div className='w-[40%] h-auto hidden md:block'>
                    <img className='w-full -ml-1 h-full object-cover shadow-[1px_1px_15px_2px_rgb(0,0,0,.12)]' src={pet} alt="" />
                </div>
                <div className='flex flex-col py-5 w-full md:w-[60%] justify-center items-center'>
                    <h1 className='text-3xl font-semibold'>Create Account</h1>
                    <div className='flex flex-col items-center mt-3'>
                        <img draggable='false' className='w-20 h-20 object-cover overflow-hidden rounded-full' src={profilePicture ? URL.createObjectURL(profilePicture) : picture} alt="" />
                        <button type='button' onClick={() => document.getElementById('profile-picture-input').click()} className='bg-[#00ACAC] cursor-pointer hover:bg-[#0ec0c0] duration-150 text-secondary font-medium text-sm py-1 px-2 rounded-lg mt-3'>Profile Picture</button>
                    </div>
                    <form onSubmit={handleCreateAccount} className='w-full px-10 sm:px-20 md:px-10 mt-2'>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            style={{display: 'none'}} 
                            id="profile-picture-input"
                        />
                        <p className='font-semibold'>Full Name</p>
                        <input onChange={(e) => setFullName(e.target.value)} required value={fullName} autoComplete='off' className='w-full mb-4 md:mb-3 py-2 px-3 rounded-lg outline-none bg-[#D9D9D9]' type="text" />
                        <p className='font-semibold'>Email Address</p>
                        <input onChange={(e) => setEmail(e.target.value)} required value={email} autoComplete='off' className='w-full mb-4 md:mb-3 py-2 px-3 rounded-lg outline-none bg-[#D9D9D9]' type="email" />
                        <p className='font-semibold'>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} required value={password} autoComplete='off' className='w-full mb-4 md:mb-3 py-2 px-3 rounded-lg outline-none bg-[#D9D9D9]' type="password" />
                        <p className='font-semibold'>Confirm Password</p>
                        <input onChange={(e) => setConfirmPassword(e.target.value)} required value={confirmPassword} autoComplete='off' className='w-full mb-4 md:mb-3 py-2 px-3 rounded-lg outline-none bg-[#D9D9D9]' type="password" />
                        <div className='mt-5 mb-2 flex flex-col items-center'>
                            {isVerifying ? (
                                <>
                                    <p>Please verify your email to complete registration.</p>
                                    <button 
                                        type="button" 
                                        onClick={handleRefreshVerification}
                                        className='bg-secondary text-primary hover:bg-secondaryHover duration-150 font-semibold py-2 px-4 rounded-lg mt-2'
                                    >
                                        I've verified my email
                                    </button>
                                </>
                            ) : (
                                <button 
                                    type="submit" 
                                    className='bg-primary hover:bg-primaryHover duration-150 font-semibold text-secondary py-3 px-7 rounded-lg'
                                >
                                    Create Account
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount

// markchristian.naval@cvsu.edu.ph
// lorenaflores31