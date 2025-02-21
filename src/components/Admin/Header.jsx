import React, { useContext, useState } from 'react'
import logo from '../../assets/images/white-logo.png'
import { AuthContext } from '../General/AuthProvider'
import { useNavigate } from 'react-router-dom';
import paw from '../../assets/images/white-paws.png'
import logout from './assets/logout.svg'
import { notifyErrorOrange } from '../General/CustomToast';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase'

function Header({openEdit}) {
    const {user, userData} = useContext(AuthContext);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = async () => {
        setIsLogoutOpen(!isLogoutOpen);
    }

    const handleLogout = async () => {

        try{
            await signOut(auth);
            window.location.reload();
            
        }
        catch (error){
            console.error("Logout error", error);
            notifyErrorOrange("Error logging out. Please try again.");
        }
    }

    return (
        <div className='fixed top-0 z-20 bg-secondary w-full p-3 px-5 md:px-7 justify-between flex h-20 lg:drop-shadow-md'>
            <img onClick={() => navigate('/dashboard/pet-management')} className='w-36 cursor-pointer sm:w-40 object-contain -ml-1 sm:ml-0' src={logo} alt="" />
            <div className='flex relative justify-center items-center'>
                <p className='font-medium pr-2 hidden sm:block'>{userData.role === 'admin' ? 'Admin |' : 'Super Admin |'}</p>
                <img onClick={handleLogoutClick} className='w-12 h-12 object-cover bg-text border-2 border-secondary hover:border-primary duration-150 cursor-pointer rounded-full' src={userData?.profilePictureURL} alt="HAHAH" />
                <div style={{display: isLogoutOpen ? 'block' : 'none'}}
                className='absolute z-50 duration-150 font-poppins top-16 lg:top-20 right-0 bg-secondary overflow-hidden rounded-lg text-text shadow-[1px_1px_15px_2px_rgb(0,0,0,.12)]'>
                    <div className='w-full flex px-7 items-center py-5'>
                        <div className='flex flex-col h-full w-48'>
                            <p className='text-sm opacity-80'>Good day,</p>
                            <p className='text-2xl font-medium'>{user ? userData?.fullName : 'Guess'}</p>    
                        </div>
                        <div className='w-14 flex items-center justify-center ml-3'>
                            <img src={paw} className='w-full' alt="" />
                        </div>
                    </div>

                    {/* EDIT ABOUT US */}
                    <div className={`${userData.role === 'superadmin' ? 'block' : 'hidden'} mb-3 -mt-3 ml-7`}>
                        <button onClick={openEdit} className='bg-primary mt-2 text-sm px-4 self-center hover:bg-primaryHover duration-150 py-1 rounded-md text-white font-medium'>Edit About Us</button>
                    </div>

                    <button onClick={handleLogout} className='w-full px-7 py-3 cursor-pointer hover:bg-primaryHover duration-150 bg-primary rounded-md flex items-center justify-between'>
                        <p className='font-medium text-secondary'>Log out</p>
                        <img className='w-[9px]' src={logout} alt="" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header