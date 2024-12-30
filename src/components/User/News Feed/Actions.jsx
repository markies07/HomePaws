import React, { useEffect, useState } from 'react'
import story from './assets/story.svg'
import missing from './assets/missing.svg'
import found from './assets/found.svg'
import { useUserPosts } from '../../General/UserPostsContext'
import checkup from '../Find Pet/assets/checkup.svg'
import water from '../Find Pet/assets/water.svg'
import clean from '../Find Pet/assets/clean.svg'
import walk from '../Find Pet/assets/walk.svg'
import love from '../Find Pet/assets/love.svg'

function Actions({open}) {
    const { fetchPosts } = useUserPosts();
    const [filterType, setFilterType] = useState('all'); 
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const tips = [
        { category: "General Tips", title: "Regular Vet Checkups", icon: checkup, text: "Schedule annual or semi-annual vet visits to ensure your pet is healthy and up-to-date on vaccinations." },
        { category: "General Tips", title: "Provide Fresh Water", icon: water, text: "Always keep a bowl of clean, fresh water available to keep your pet hydrated." },
        { category: "For Cats", title: "Litter Box Hygiene", icon: clean, text: "Clean the litter box daily to keep your cat happy and to avoid unpleasant odors." },
        { category: "For Dogs", title: "Daily Walks", icon: walk, text: "Take your dog on daily walks to keep them healthy and happy." },
        { category: "Best Tips", title: "Love and Attention", icon: love, text: "Spend quality time with your pet daily. Pets thrive on affection and attention from their owners." },
    ];

    useEffect(() => {
        fetchPosts(filterType);
    }, [filterType]);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    useEffect(() => {
        const calculateTipIndex = () => {
          const now = new Date();
          // Calculate tip index based on current time in minutes
          return Math.floor(now.getTime() / (60 * 1000)) % tips.length;
        };
    
        // Set the initial tip index based on current time
        setCurrentTipIndex(calculateTipIndex());
    
        // Update the tip index every 1 minute
        const interval = setInterval(() => {
          setCurrentTipIndex(calculateTipIndex());
        }, 60000); // 1 minute interval
    
        return () => clearInterval(interval); // Cleanup interval on component unmount
      }, []);
    
    const currentTip = tips[currentTipIndex];

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

                {/* TIPS */}
                <div className='bg-secondary hidden lg:block order-3 px-4 py-4 w-[13.5rem] h-full gap-4 justify-start items-center rounded-lg shadow-custom'>
                    <h3 className='font-semibold text-center'>{currentTip.category}</h3>
                    <div className='w-full flex justify-center pt-5 pb-3'>
                        <img src={currentTip.icon} alt="" />
                    </div>
                    <h4 className='font-medium text-center'>{currentTip.title}</h4>
                    <p className='text-sm pt-1 text-center'>{currentTip.text}</p>
                </div>
            </div>
        </div>
    )
}

export default Actions