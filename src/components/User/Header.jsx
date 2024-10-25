import React from 'react'
import logo from '../../assets/images/white-logo.png'
import search from './assets/search-icon.svg'
import Logout from './Logout'
import { useAuth } from '../General/AuthProvider'
import { useNavigate } from 'react-router-dom'

function Header({openLogout, isOpen, loading}) {
  const {user, userData} = useAuth();
  const navigate = useNavigate();

  return (
    <div className='fixed top-0 z-20 bg-secondary w-full p-3 px-5 md:px-7 justify-between flex h-20 lg:drop-shadow-md'>
        <img onClick={() => navigate('/dashboard/find-pet')} className='w-36 cursor-pointer sm:w-40 object-contain -ml-1 sm:ml-0' src={logo} alt="" />
        <div className='flex relative justify-center gap-3 sm:gap-5 lg:gap-7 items-center'>
            <img className='w-10 cursor-pointer hover:bg-[#facdcd] duration-300 p-2 overflow-visible bg-[#FFDEDE] rounded-full' src={search} alt="" />
            <img onClick={openLogout} className='w-12 h-12 object-cover bg-text border-2 border-secondary hover:border-primary duration-150 cursor-pointer lg:ml-3 rounded-full' src={userData?.profilePictureURL} alt="HAHAH" />
            <Logout isOpen={isOpen} loading={loading} />
        </div>
    </div>
  )
}

export default Header