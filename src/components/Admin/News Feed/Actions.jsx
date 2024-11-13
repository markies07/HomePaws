import React, { useEffect, useState } from 'react'
import story from './assets/story.svg'
import missing from './assets/missing.svg'
import found from './assets/found.svg'
import { useUserPosts } from '../../General/UserPostsContext'

function Actions({open}) {
    const { fetchPosts } = useUserPosts();
    const [filterType, setFilterType] = useState('all'); 

    useEffect(() => {
        fetchPosts(filterType);
    }, [filterType]);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    return (
        <div className='mt-3 px-2 lg:fixed lg:mt-3 top-20 right-1'>

            {/* MOBILE VIEW */}
            <div className='flex gap-2 sm:gap-3 lg:flex-col justify-center'>
                <div className='bg-secondary order-1 lg:order-2 shrink-0 py-2 px-3 rounded-md shadow-custom'>
                    <p className='font-medium pb-1 lg:text-lg'>Create a post</p>
                    <div className='flex gap-2 sm:gap-3 lg:gap-4 lg:px-2 lg:pb-1'>
                        <img onClick={() => open('story')} className='w-10 sm:w-12 p-2 cursor-pointer hover:bg-[#d8d8d8] duration-150 rounded-md bg-[#E9E9E9]' src={story} alt="" />
                        <img onClick={() => open('missing')} className='w-10 sm:w-12 p-2 cursor-pointer hover:bg-[#d8d8d8] duration-150 rounded-md bg-[#E9E9E9]' src={missing} alt="" />
                        <img onClick={() => open('found')} className='w-10 sm:w-12 p-2 cursor-pointer hover:bg-[#d8d8d8] duration-150 rounded-md bg-[#E9E9E9]' src={found} alt="" />
                    </div>
                </div>
                <div className='bg-secondary order-2 lg:order-1 py-2 lg:pb-3 px-3 rounded-md w-full max-w-[12rem] lg:max-w-full shadow-custom'>
                    <p className='font-medium pb-1 lg:text-lg'>Filter post</p>
                    <select value={filterType} onChange={handleFilterChange} className="border-text rounded-md w-full py-1 px-1 outline-none font-medium text-text border-2">
                        <option className="text-text py-5" value='all'>All</option>
                        <option className="text-text py-5" value='story'>Story</option>
                        <option className="text-text py-5" value='missing'>Missing</option>
                        <option className="text-text py-5" value='found'>Found</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default Actions