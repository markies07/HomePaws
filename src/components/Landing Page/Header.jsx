import React from 'react'
import logoWhite from "./assets/white-logo.png"
import login from "./assets/login-person.svg"

function Header({ onLoginClick }) {
  return (
    <header className='bg-[#FAFAFA] h-20 flex justify-between items-center px-5 md:px-10'>
        <div className='w-full lg:pl-10'>
            <img className='w-40 sm:w-48' src={logoWhite} alt="" />
        </div>
        <div>
            <button onClick={onLoginClick} className='flex gap-3 cursor-pointer justify-center rounded-full items-center px-8 sm:px-10 py-2 duration-150 hover:bg-primaryHover active:bg-[#F75959] bg-primary'>
                <img className='lg:w-5 w-4' src={login} alt="" />
                <p className='whitespace-nowrap text-white md:text-base text-sm font-medium'>SIGN IN</p>
            </button>
        </div>
    </header>
  )
}

export default Header