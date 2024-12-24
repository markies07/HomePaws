import React from 'react'
import close from './assets/close.svg'
import BanUser from './BanUser'
import DeactivateUser from './DeactivateUser'
import SetAdmin from './SetAdmin'

function Actions({data, closeUI}) {

    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/70'>
            <div className="relative px-5 bg-secondary w-[90%] sm:w-[23rem] h-auto rounded-lg py-6 flex flex-col">
                <img onClick={closeUI} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold mb-4'>Actions</h1>
                
                <div className='flex flex-col gap-3 px-5'>
                    <SetAdmin data={data} />
                    <DeactivateUser data={data} />
                    <BanUser userName={data.fullName} userEmail={data.email} data={data}/>
                </div>
                
            </div>
        </div>
    )
}

export default Actions