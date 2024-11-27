import React from 'react'
import naval from './assets/naval.jpg'
import sorino from './assets/sorino.jpg'
import piamonte from './assets/piamonte.jpg'

function MeetTheTeam() {
    return (
        <div className='w-full h-full flex flex-col items-center text-text sm:my-10 bg-secondary'>
            <p className='text-3xl font-medium border-b-2 px-5 border-text'>Meet The Team</p>
            
            {/* CONTENT */}
            <div className='mt-14 flex flex-col md:flex-row gap-5 md:gap-7'>
                {/* MARK CHRISTIAN M. NAVAL */}
                <div className='flex md:order-2 bg-primary text-white flex-col items-center text-center h-[22rem] md:h-[24rem] lg:h-[22rem] p-5 w-64 md:w-52 lg:w-64 rounded-lg shadow-custom'>
                    <img className='w-20 h-20 bg-secondary rounded-full' src={naval} alt="" />
                    <p className='font-semibold pt-3'>Mark Christian <br /> M. Naval</p>
                    <p className='font-semibold text-xs pt-7'>Project Lead</p>
                    <p className='py-4'>"Designed and developed the platform to connect adopters and pets seamlessly."</p>
                </div>

                {/* JORDAN B. SORIñO */}
                <div className='flex md:order-1 bg-text text-white flex-col items-center text-center h-[22rem] md:h-[24rem] lg:h-[22rem] p-5 w-64 md:w-52 lg:w-64 rounded-lg shadow-custom'>
                    <img className='w-20 h-20 bg-secondary rounded-full' src={sorino} alt="" />
                    <p className='font-semibold pt-3'>Jordan B. <br /> Soriño</p>
                    <p className='font-semibold text-xs pt-7'>Research Specialist</p>
                    <p className='py-4'>"Specializes in conducting research to identify innovative solutions for pet adoption."</p>
                </div>

                {/* MARTIN JAY A. PIAMONTE */}
                <div className='flex md:order-3 bg-text text-white flex-col items-center text-center h-[22rem] md:h-[24rem] lg:h-[22rem] p-5 w-64 md:w-52 lg:w-64 rounded-lg shadow-custom'>
                    <img className='w-20 h-20 bg-secondary rounded-full' src={piamonte} alt="" />
                    <p className='font-semibold pt-3'>Martin Jay <br /> A. Piamonte</p>
                    <p className='font-semibold text-xs pt-7'>Documentation Specialist</p>
                    <p className='py-4'>"Focused on crafting user-centric documentation and support materials."</p>
                </div>
            </div>

        </div>
    )
}

export default MeetTheTeam