import React from 'react'
import banned from './assets/banned.svg'
import deactivated from './assets/deactivated.svg'
import admins from './assets/admins.png'

function Search({setFilter, searchQuery, setSearchQuery}) {
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
                </div>
            </div>
        </div>
    )
}

export default Search