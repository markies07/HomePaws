import React from 'react'
import post from './assets/post.svg'
import rehomed from './assets/rehomed.svg'

function Options({openPostPet, changeFilter, selected}) {

    return (
        <div className='relative px-2'>
            {/* MOBILE VIEW */}
            <div className='flex gap-2 sm:gap-3 justify-center lg:hidden'>
                {/* POST */}
                <div className='bg-secondary pl-2 pr-4 py-2 gap-2 flex justify-center items-center rounded-lg shadow-custom'>
                    <img onClick={openPostPet} src={post} className='p-1 w-9 h-9 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
                    <p className='font-medium leading-4'>Post Pet</p>
                </div>
                {/* FILTER */}
                <div className='bg-secondary px-2 sm:px-3 py-2 gap-2 sm:gap-3 flex justify-center items-center rounded-lg shadow-custom'>
                    <button onClick={() => changeFilter('All')} className={`font-medium px-1 ${selected === 'All' ? 'text-white bg-primary rounded-md' : ''} `}>All</button>
                    <button onClick={() => changeFilter('Dog')} className={`font-medium px-1 ${selected === 'Dog' ? 'text-white bg-primary rounded-md' : ''} `}>Dogs</button>
                    <button onClick={() => changeFilter('Cat')} className={`font-medium px-1 ${selected === 'Cat' ? 'text-white bg-primary rounded-md' : ''} `}>Cats</button>
                </div>
                {/* REHOMED PETS */}
                <div className='bg-secondary shrink-0 px-2 sm:pr-4 py-1 gap-3 flex justify-center items-center rounded-lg shadow-custom'>
                    <img src={rehomed} className='w-[40px] p-2 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
                    <p className='font-medium hidden sm:block'>Rehomed Pets</p>
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className='gap-3 justify-center hidden fixed lg:flex right-0 mr-3 flex-col w-48 xl:w-52 2xl:w-56'>
                {/* FILTER */}
                <div className='bg-secondary px-2 py-3 xl:gap-2 gap-1 flex justify-center items-center rounded-lg shadow-custom'>
                    <button onClick={() => changeFilter('All')} className={`font-medium px-2 ${selected === 'All' ? 'text-white bg-primary rounded-md' : ''} `}>All</button>
                    <button onClick={() => changeFilter('Dog')} className={`font-medium px-2 ${selected === 'Dog' ? 'text-white bg-primary rounded-md' : ''} `}>Dogs</button>
                    <button onClick={() => changeFilter('Cat')} className={`font-medium px-2 ${selected === 'Cat' ? 'text-white bg-primary rounded-md' : ''} `}>Cats</button>
                </div>
                {/* POST */}
                <div className='bg-secondary pl-3 pr-4 py-2 gap-4 flex justify-start items-center rounded-lg shadow-custom'>
                    <img onClick={openPostPet} src={post} className='p-2 w-11 h-11 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
                    <p className='font-medium whitespace-nowrap'>Post Pet</p>
                </div>
                {/* REHOMED PETS */}
                <div className='bg-secondary shrink-0 pl-3 pr-4 py-2 gap-3 flex justify-start items-center rounded-lg shadow-custom'>
                    <img src={rehomed} className='w-[45px] p-2 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
                    <p className='font-medium pl-1 leading-5'>Rehomed Pets</p>
                </div>
            </div>

        </div>
    )
}

export default Options