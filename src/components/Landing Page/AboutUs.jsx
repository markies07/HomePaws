import React from 'react'
import pic1 from './assets/aboutus1.svg'
import pic2 from './assets/aboutus2.svg'
import pic3 from './assets/aboutus3.svg'

function AboutUs() {
    return (
        <div className='w-full h-full flex flex-col items-center text-text sm:my-10 sm:mt-20 bg-secondary'>
            <p className='text-3xl font-medium border-b-2 px-5 border-text'>About Us</p>
            
            {/* CONTENT */}
            <div className='mt-10 lg:mt-14 flex flex-col gap-10 lg:gap-0'>
                <div className='lg:flex w-full sm:w-[80%] mx-auto xl:w-[80%] 2xl:w-[70%] xl:mx-auto lg:h-80 h-auto xl:h-96 '>
                    <div className='w-full sm:w-[70%] sm:h-72 lg:w-full lg:h-auto mx-auto overflow-hidden'>
                        <img className='w-full h-full object-cover' src={pic1} alt="" />
                    </div>
                    <div className='text-center flex flex-col sm:justify-center lg:text-start mt-10 lg:m-0 w-full'>
                        <p className='text-xl font-semibold mb-5 lg:mb-3 px-7 lg:pl-10'>Our Mission</p>
                        <p className='leading-7 font-light px-7 lg:pl-10'>At HomePaws, our mission is to rescue and connect pets in need with responsible, loving homes. We strive to ensure every animal finds a safe and nurturing environment while fostering a compassionate community that values the joy of pet companionship.</p>
                    </div>
                </div>

                <div className='lg:flex w-full sm:w-[80%] mx-auto xl:w-[80%] 2xl:w-[70%] xl:mx-auto lg:h-80 h-auto xl:h-96 '>
                    <div className='w-full lg:order-2 sm:w-[70%] sm:h-72 lg:w-full lg:h-auto mx-auto overflow-hidden'>
                        <img className='w-full h-full object-cover' src={pic2} alt="" />
                    </div>
                    <div className='text-center lg:order-1 flex flex-col sm:justify-center lg:text-end mt-10 lg:m-0 w-full'>
                        <p className='text-xl font-semibold mb-5 lg:mb-3 px-7 lg:pr-10'>Our Values</p>
                        <p className='leading-7 font-light px-7 lg:pr-10'>We are guided by compassion, transparency, and inclusivity. Every decision we make prioritizes the welfare of pets and the trust of our community. By building strong connections between adopters, pet owners, and advocates, we aim to create a supportive ecosystem that respects the needs of every animal.</p>
                    </div>
                </div>
                
                <div className='lg:flex w-full sm:w-[80%] mx-auto xl:w-[80%] 2xl:w-[70%] xl:mx-auto lg:h-80 h-auto xl:h-96 '>
                    <div className='w-full sm:w-[70%] sm:h-72 lg:w-full lg:h-auto mx-auto overflow-hidden'>
                        <img className='w-full h-full object-cover' src={pic3} alt="" />
                    </div>
                    <div className='text-center flex flex-col sm:justify-center lg:text-start mt-10 lg:m-0 w-full'>
                        <p className='text-xl font-semibold mb-5 lg:mb-3 px-7 lg:pl-10'>Our Goal</p>
                        <p className='leading-7 font-light px-7 lg:pl-10'>Our goal is to reduce the number of stray and abandoned pets by providing a seamless and reliable platform for pet adoption. We are committed to expanding our reach, educating adopters, and building a community where every pet is given a second chance to thrive in a loving home.</p>
                    </div>
                </div>
                
            </div>

        </div>
    )
}

export default AboutUs