import React, { useEffect, useState } from 'react'
import close from './assets/close-dark.svg'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

function RejectionDetails({applicationID, petName, closeIt}) {
    const [rejectedApp, setRejectedApp] = useState({});

    // FETCHING REJECTED APPLICAITON
    useEffect(() => {
        const fetchRejectedApp = async () => {
            try{
                const q = query(
                    collection(db, 'rejectedApplications'), 
                    where('applicationID', '==', applicationID)
                );

                const querySnapshot = await getDocs(q);
                if(!querySnapshot.empty){
                    const application = querySnapshot.docs[0].data();
                    setRejectedApp(application);
                }
            }
            catch(error){
                console.error(error);
            }
        }
        if(applicationID){
            fetchRejectedApp();
        }
    }, [applicationID])


    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/60'>
            {rejectedApp.canceledBy === undefined ? (
                <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-auto rounded-lg py-3 flex flex-col">
                    <img onClick={closeIt} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                    <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Rejection Details</h1>
                    
                    {/* REASON OF REJECTION */}
                    <div className='pt-4 h-[40dvh] pb-11'>
                        <p className='font-medium pb-1 text-lg'>Reason of rejection</p>
                        <div className='py-2 bg-secondary overflow-y-auto mb-5 w-full px-3 h-full rounded-md'>
                            <p className='font-medium text-lg'>{petName}'s Pet Owner,</p>
                            <p className='mt-1 overflow-y-auto text-justify'>{rejectedApp.rejectReason}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-auto rounded-lg py-3 flex flex-col">
                    <img onClick={closeIt} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                    <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Cancelation Details</h1>
                    
                    {/* REASON OF CANCELATION */}
                    <div className='pt-4 h-[40dvh] pb-11'>
                        <p className='font-medium pb-1 text-lg'>Reason of cancelation</p>
                        <div className='py-2 bg-secondary overflow-y-auto mb-5 w-full px-3 h-full rounded-md'>
                            <p className='font-medium text-lg'>{rejectedApp.fullName},</p>
                            <p className='mt-1 overflow-y-auto text-justify'>{rejectedApp.cancelReason}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RejectionDetails