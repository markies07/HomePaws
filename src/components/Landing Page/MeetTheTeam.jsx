import React from 'react'
import naval from './assets/naval.jpg'
import sorino from './assets/sorino.jpg'
import piamonte from './assets/piamonte.jpg'
import close from './assets/close-dark.svg'

function MeetTheTeam({closeCreator}) {
    return (
        <div className=' justify-center items-center px-5 py-5 sm:px-10 sm:py-10 bg-secondary min-h-screen w-full flex flex-col text-text font-poppins'>
            <div>
                <div className='absolute top-4 right-4 border-2 border-secondary hover:border-text cursor-pointer p-1 duration-150'>
                    <img onClick={closeCreator} className='w-6 h-6 sm:w-7 sm:h-7' src={close} alt="" />
                </div>

                <div className='w-full h-full flex flex-col items-center text-text sm:my-10 bg-secondary'>
                    <p className='text-3xl font-medium border-b-2 px-5 pt-8 sm:pt-0 border-text'>Meet The Creators</p>
                    
                    {/* CONTENT */}
                    <div className='mt-10 md:mt-14 flex flex-col md:flex-row gap-5 lg:gap-7'>
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

            </div>
        </div>
        
    )
}

export default MeetTheTeam