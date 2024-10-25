import React from 'react'
import logo from './assets/orange-logo.png'

function Footer() {
  return (
    <div className='absolute bottom-0 w-full'> 
      <div className='h-20 relative bg-primary flex justify-center items-center rounded-t-xl'>
        <img className='w-36 pb-3' src={logo} alt="" />
        <p className='absolute bottom-1 left-1 text-[#FAFAFA] text-xs'>©2024 HomePaws.com</p>
      </div>
    </div>
    
  )
}

export default Footer