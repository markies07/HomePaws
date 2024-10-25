import React from 'react'
import close from './assets/close.svg'
import AnimalCard from '../General/AnimalCard'

function Cards() {
  return (
    <div className='hidden'>
        <div className='fixed inset-0 flex flex-col h-screen bg-secondary z-50 p-5 sm:pl-10'>
            <div className='absolute top-3 p-1 right-3 duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959]'>
                <img src={close} alt="" />
            </div>
            <h1 className='text-3xl font-semibold text-primary'>
                Dogs for Adoptionfdsfsdf
            </h1>
            <div className='inline-flex mt-10 justify-center sm:justify-start gap-3 flex-wrap'>
                <AnimalCard />
            </div>
        </div>
    </div>
  )
}

export default Cards