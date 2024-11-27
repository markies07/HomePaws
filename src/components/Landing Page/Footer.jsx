import React from 'react'
import logo from './assets/orange-logo.png'

function Footer({openFaqs, openRules, openContact}) {
  return (
    <div className='w-full'> 
      <div className='relative bg-primary pt-4 mt-20 pb-8 flex gap-1 flex-col justify-center items-center rounded-t-3xl'>
        <img className='w-36 pb-3' src={logo} alt="" />
        <div className='flex justify-evenly w-full'>
          <p onClick={openFaqs} className='text-white text-xs text-center leading-4 cursor-pointer border-b-2 hover:border-white border-transparent sm:text-sm px-3'>Frequently Asked Questions</p>
          <p onClick={openContact} className='text-white text-xs text-center leading-4 cursor-pointer border-b-2 hover:border-white border-transparent sm:text-sm px-3'>Contact Us</p>
          <p onClick={openRules} className='text-white text-xs text-center leading-4 cursor-pointer border-b-2 hover:border-white border-transparent sm:text-sm px-3'>Rules & Regulations</p>
        </div>
        <p className='absolute bottom-1 left-1 text-[#FAFAFA] text-xs'>©2024 HomePaws</p>
      </div>
    </div>
    
  )
}

export default Footer