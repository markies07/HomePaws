import React, { useEffect, useState } from 'react'
import banned from './assets/banned.svg'
import deactivated from './assets/deactivated.svg'
import admins from './assets/admins.png'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'

function Search({openVerify, setFilter, searchQuery, setSearchQuery}) {
    const [hasUnseenVerification, setHasUnseenVerification] = useState(false);

    useEffect(() => {
         // Listener for unread pending verifications
         const verificationRef = collection(db, 'pendingVerification');
         const verificationQuery = query(verificationRef, where('isRead', '==', false));
     
         const unsubscribeVerification = onSnapshot(verificationQuery, (snapshot) => {
             setHasUnseenVerification(!snapshot.empty);
         });

         return () => {
            unsubscribeVerification();
        };
    }, [])

    return (
        <div className='relative px-2'>
            {/* MOBILE VIEW */}
            <div className='flex justify-center gap-3 lg:hidden'>
                {/* SEARCH USER */}
                <div className='bg-secondary w-full max-w-[25rem] px-4 py-3 gap-2 flex flex-col rounded-lg shadow-custom'>
                    <p className='font-medium leading-4'>Search User</p>
                    <input onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} className='bg-[#E1E1E1] w-full rounded-lg pl-3 py-2 outline-none pr-3' type="text" placeholder='Enter user name'/>
                    {/* USER TYPES */}
                    <div className='w-full justify-center items-center flex pt-1 gap-3'>
                        <button onClick={() => setFilter('banned')} className='flex flex-col hover:bg-[#cecece] duration-150 cursor-pointer gap-1 justify-center items-center w-full py-2 rounded-md bg-[#D9D9D9]'>
                            <img className='w-7 h-7' src={banned} alt="" />
                            <p className='text-xs font-medium'>Banned</p>
                        </button>
                        <button onClick={() => setFilter('deactivated')} className='flex flex-col hover:bg-[#cecece] duration-150 cursor-pointer gap-1 justify-center items-center w-full py-2 rounded-md bg-[#D9D9D9]'>
                            <img className='w-7 h-7' src={deactivated} alt="" />
                            <p className='text-xs font-medium'>Deactivated</p>
                        </button>
                        <button onClick={() => setFilter('admins')} className='flex flex-col hover:bg-[#cecece] duration-150 cursor-pointer gap-1 justify-center items-center w-full py-2 rounded-md bg-[#D9D9D9]'>
                            <img className='w-[30px] h-7' src={admins} alt="" />
                            <p className='text-xs font-medium'>Admins</p>
                        </button>
                    </div>

                    {/* USER VERIFICATIONS */}
                    <div className='flex mt-1'>
                        <button onClick={openVerify} className='bg-[#D9D9D9] relative py-2 hover:bg-[#cecece] duration-150 font-medium text-sm text-text w-full rounded-md'>Verification Request
                            {/* NOTIFICATION */}
                            {hasUnseenVerification && (
                                <div className='absolute w-5 h-5 rounded-full border-2 border-secondary bg-primary -right-1 -top-1'/>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className='hidden fixed lg:flex right-0 mr-3 flex-col w-60 xl:w-64 2xl:w-72'>
                <div className='bg-secondary w-full max-w-[25rem] px-4 py-3 gap-2 flex flex-col rounded-lg shadow-custom'>
                    <p className='font-medium leading-4'>Search User</p>
                    <input onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} className='bg-[#E1E1E1] w-full rounded-lg pl-3 py-2 outline-none pr-3' type="text" placeholder='Enter user name'/>
                    {/* USER TYPES */}
                    <div className='w-full justify-center flex-col items-center pt-2 flex gap-2'>
                        <button onClick={() => setFilter('admins')} className='flex hover:bg-[#cecece] duration-150 cursor-pointer gap-3 pr-3 pl-2 items-center w-full py-2 rounded-md bg-[#D9D9D9]'>
                            <img className='w-[30px] h-7' src={admins} alt="" />
                            <p className='text-sm font-medium'>Admins</p>
                        </button>
                        <button onClick={() => setFilter('deactivated')} className='flex hover:bg-[#cecece] duration-150 cursor-pointer gap-3 px-3 items-center w-full py-2 rounded-md bg-[#D9D9D9]'>
                            <img className='w-7 h-7' src={deactivated} alt="" />
                            <p className='text-sm font-medium'>Deactivated</p>
                        </button>
                        <button onClick={() => setFilter('banned')} className='flex hover:bg-[#cecece] duration-150 cursor-pointer gap-3 px-3 items-center w-full py-2 rounded-md bg-[#D9D9D9]'>
                            <img className='w-7 h-7' src={banned} alt="" />
                            <p className='text-sm font-medium'>Banned</p>
                        </button>
                    </div>

                    {/* USER VERIFICATIONS */}
                    <div className='flex mt-2'>
                        <button onClick={openVerify} className='bg-[#D9D9D9] relative hover:bg-[#cecece] duration-150 py-2 font-medium text-sm text-text w-full rounded-md'>Verification Request
                            {/* NOTIFICATION */}
                            {hasUnseenVerification && (
                                <div className='absolute w-5 h-5 rounded-full border-2 border-secondary bg-primary -right-1 -top-1'/>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search