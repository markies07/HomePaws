import React from 'react'
import application from './assets/application.svg'
import petListed from './assets/petListed.svg'
import { useNavigate } from 'react-router-dom';

function Options({openPetListed}) {
  const navigate = useNavigate();

  return (
    <div className='w-1/2 mt-2 md:mt-0 z-10 justify-center md:justify-end flex gap-2 md:gap-3'>
        <div onClick={() => navigate('applications/active')} className='bg-[#D9D9D9] shrink-0 hover:bg-[#cecece] duration-150 cursor-pointer justify-center flex flex-col items-center w-28 py-2 gap-[5px] md:gap-[6px] px-3 rounded-md'>
            <img className='mt-1' src={application} alt="" />
            <p className='font-medium text-center leading-4 text-xs'>Applications</p>
        </div>
        <div onClick={openPetListed} className='bg-[#D9D9D9] shrink-0 hover:bg-[#cecece] duration-150 cursor-pointer justify-center flex flex-col items-center w-28 py-3 gap-[5px] md:gap-[6px] px-3 rounded-md'>
            <img className='w-[35px]' src={petListed} alt="" />
            <p className='font-medium text-center leading-4 text-xs'>Pet Listed</p>
        </div>
    </div>
  )
}

export default Options