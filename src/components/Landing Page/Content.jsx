import React, { useEffect, useState } from 'react'
import banner from './assets/banner.png'
import dogs from './assets/dogs.svg'
import cats from './assets/cats.svg'
import logo from './assets/orange-paws.png'
import AnimalCard from '../General/AnimalCard'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

function Content({ onLoginClick, open }) {
  
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchPets = async () => {

          try{
            const petsQuery = collection(db, "petsForAdoption");
            const querySnapshot = await getDocs(petsQuery);
            const petsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPets(petsList);
          }
          catch(error){
            console.error(error);
          }
          finally{
            setLoading(false);
          }
        }
        fetchPets();
    }, []);

  return (
    <div className='h-full'>
      {/* BANNER */}
      <div className='w-full relative justify-center h-36 sm:h-56 lg:h-64 xl:h-80 flex'>
          <img className='w-full object-cover' src={banner} alt="" />
          <div className='text-[#FAFAFA] top-0 h-full flex flex-col md:pb-5 justify-center px-5 text-center absolute'>
              <p className='font-bold text-3xl drop-shadow-xl sm:text-4xl lg:text-5xl'>Find a New Member of the Family</p>
              <p className='font-medium hidden md:block'>Adopt a pet. Connect with owners and bring home your new companion.</p>
          </div>
      </div>
      {/* ANIMALS */}
      <div className='bg-primary relative text-[#FAFAFA] h-20 md:h-3 flex items-center justify-center'>
          <p className='drop-shadow-lg md:hidden mb-3 text-sm leading-4 sm:text-sm px-5 text-center'>Adopt a pet. Connect with owners and bring home your new companion.</p>
          {/* DOGS AND CATS */}
          <div className='absolute flex gap-4 top-16 sm:top-14 md:-top-14 md:gap-5'>
            <button onClick={() => open('Dog')} className='bg-[#FAFAFA] border-[1px] gap-3 py-5 px-8 sm:px-16 md:px-20 rounded-xl drop-shadow-md hover:cursor-pointer hover:drop-shadow-xl duration-150 flex flex-col items-center justify-center'>
              <img className='w-16' src={dogs} alt="" />
              <p className='text-primary font-medium'>Dogs</p>
            </button>
            <button onClick={() => open('Cat')} className='bg-[#FAFAFA] border-[1px] gap-3 py-5 px-8 sm:px-16 md:px-20 rounded-xl drop-shadow-md hover:cursor-pointer hover:drop-shadow-xl duration-150 flex flex-col items-center justify-center'>
              <img className='w-16' src={cats} alt="" />
              <p className='text-primary font-medium'>Cats</p>
            </button>
          </div>
      </div>
      {/* AVAILABLE PETS */}
      <div className='mt-52 flex justify-center flex-col items-center'>
        <h1 className='text-[#5D5D5D] inline-block font-semibold text-center text-3xl px-5'>Pets Available for Adoption
        </h1>
        <div className={`${pets.length < 3 ? 'gap-3 sm:gap-5 grid grid-cols-2 sm:grid-cols-3' : 'gap-3 sm:gap-5 grid grid-cols-2 md:grid-cols-4'} mt-10 mx-5 mb-40`}>
          <AnimalCard onLoginClick={onLoginClick} />
          <div className='w-full max-w-48 relative m-auto items-center justify-between h-64 bg-primary flex flex-col drop-shadow-lg rounded-xl overflow-hidden'>
            <img className='w-32 pt-4' src={logo} alt="" />
            <p className='text-white text-sm px-3 leading-4 text-center'>{`${pets.length <= 3 ? 'Pets' : `${pets.length - 3} more pets`} available on HomePaws`}</p>
            <p onClick={onLoginClick} className='text-white hover:bg-[#ff6c6c] duration-150 cursor-pointer font-medium w-full flex justify-center items-center border-t-[1px] border-white h-11'>MEET THEM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content