import React, { useContext, useState } from 'react'
import logout from './assets/logout.svg'
import paw from '../../assets/images/white-paws.png'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { notifyErrorOrange } from '../General/CustomToast'
import { useAuth } from '../General/AuthProvider'


function Logout({isOpen}) {
    const {user, userData} = useAuth();

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
        <div 
        style={{
            display: isOpen ? 'block' : 'none',
        }}
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
            <button onClick={handleLogout} className='w-full px-7 py-3 cursor-pointer hover:bg-primaryHover duration-150 bg-primary rounded-md flex items-center justify-between'>
                <p className='font-medium text-secondary'>Log out</p>
                <img className='w-[9px]' src={logout} alt="" />
            </button>
        </div>
    )
}

export default Logout