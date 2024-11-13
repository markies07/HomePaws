import React, { useState } from 'react'

function AppNavBar({setSelectedTab, selectedTab}) {

    return (
        <>
            <div className='flex w-full justify-between sm:justify-start sm:gap-5 lg:gap-7 text-[#898989] font-semibold text-xs sm:text-base'>
                {/* <p className='text-primary border-b-[3px] border-primary font-semibold sm:px-3 lg:px-5'>Active</p> */}
                <button onClick={() => setSelectedTab('Active')} className={`${selectedTab === 'Active' ? 'text-primary border-b-[3px] border-primary' : 'border-b-[3px] border-transparent'} pt-2 sm:px-3 lg:px-5`}>Active</button>
                <button onClick={() => setSelectedTab('Accepted')} className={`${selectedTab === 'Accepted' ? 'text-primary border-b-[3px] border-primary' : 'border-b-[3px] border-transparent'} pt-2 sm:px-3 lg:px-5`}>Accepted</button>
                <button onClick={() => setSelectedTab('Rejected')} className={`${selectedTab === 'Rejected' ? 'text-primary border-b-[3px] border-primary' : 'border-b-[3px] border-transparent'} pt-2 sm:px-3 lg:px-5`}>Rejected</button>
                <button onClick={() => setSelectedTab('Closed')} className={`${selectedTab === 'Closed' ? 'text-primary border-b-[3px] border-primary' : 'border-b-[3px] border-transparent'} pt-2 sm:px-3 lg:px-5`}>Closed</button>
                <button onClick={() => setSelectedTab('Rehomed')} className={`${selectedTab === 'Rehomed' ? 'text-primary border-b-[3px] border-primary' : 'border-b-[3px] border-transparent'} pt-2 sm:px-3 lg:px-5`}>Rehomed</button>
            </div>

        </>
    )
}

export default AppNavBar