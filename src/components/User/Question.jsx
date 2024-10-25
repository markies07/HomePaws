import React from 'react'
import dog from './assets/dog.svg'
import cat from './assets/cat.svg'
import both from './assets/both.svg'
import looking from './assets/looking.svg'

function Question({petOwnerType}) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-70">
        <div className="relative bg-[#d8d8d8] w-[95%] sm:w-[30rem] h-sm:h-[50%] h-auto rounded-lg py-3 flex flex-col">
            <h1 className='text-center shrink-0 text-2xl font-medium pt-5 mb-5'>What kind of pet owner are you?</h1>
            <div className='h-full grid grid-cols-2 gap-4 pb-2 px-4 sm:px-5'>
                <div onClick={() => petOwnerType('Dog Owner')} className='w-full shrink-0 h-full cursor-pointer hover:border-primary border-2 border-transparent duration-150 flex flex-col justify-center items-center rounded-lg p-3 bg-secondary'>
                    <img className='w-14 h-sm:w-20' src={dog} alt="" />
                    <p className='font-medium pt-3'>Dog Owner</p>
                </div>
                <div onClick={() => petOwnerType('Cat Owner')} className='w-full shrink-0 h-full cursor-pointer hover:border-primary border-2 border-transparent duration-150 flex flex-col justify-center items-center rounded-lg p-3 bg-secondary'>
                    <img className='h-sm:w-20 w-14 pt-[7px]' src={cat} alt="" />
                    <p className='font-medium h-sm:pt-3 pt-[9px]'>Cat Owner</p>
                </div>
                <div onClick={() => petOwnerType('Both')} className='w-full shrink-0 h-full cursor-pointer hover:border-primary border-2 border-transparent duration-150 flex flex-col justify-center items-center rounded-lg p-3 bg-secondary'>
                    <img className='h-sm:w-28 w-20' w-14 src={both} alt="" />
                    <p className='font-medium pt-3'>Both</p>
                </div>
                <div onClick={() => petOwnerType('Looking to Adopt')} className='w-full shrink-0 h-full cursor-pointer hover:border-primary border-2 border-transparent duration-150 flex flex-col justify-center items-center rounded-lg p-3 bg-secondary'>
                    <img className='h-sm:w-[4.3rem] w-[3rem] pt-1' src={looking} alt="" />
                    <p className='font-medium pt-3'>Looking to Adopt</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Question