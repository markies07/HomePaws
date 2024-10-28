import React, { useEffect, useState } from 'react'
import close from './assets/close.svg'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import unfavorite from '../../assets/icons/unfavorite.svg'
import { notifyErrorOrange } from '../General/CustomToast';

function ForAdoption({isOpen, closeUI, petType}) {

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchPets = async () => {

          try{
            const petsQuery = query(
              collection(db, "petsForAdoption"),
              where('petType', '==', petType),
              orderBy("timePosted", "desc")
            );
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
    }, [petType, isOpen]);

    const clickPet = () => {
      notifyErrorOrange('You need to login first.');
    }


  return (
    <div 
    style={{
        display: isOpen ? 'block' : 'none',
        }}
    className='fixed z-10 right-0 top-0 px-5 py-5 sm:px-10 sm:py-10 bg-secondary min-h-screen max-h-screen overflow-auto w-full flex flex-col text-text font-poppins'>
        <div onClick={closeUI} className='absolute top-4 right-4 border-2 border-secondary hover:border-primary cursor-pointer p-1 duration-150'>
            <img src={close} alt="" />
        </div>
        <h1 style={{display: petType === 'Dog' ? 'block' : 'none'}} className='text-3xl font-medium mt-10 sm:mt-0 text-center sm:text-start'>Dogs for adoption</h1>
        <h1 style={{display: petType === 'Cat' ? 'block' : 'none'}} className='text-3xl font-medium mt-10 sm:mt-0 text-center sm:text-start'>Cats for adoption</h1>
        <div className='mt-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 w-full gap-3'>
          {loading ? (
            <p className='text-center col-span-full text-xl font-medium text-text'>Loading pets...</p>
          ) :
          
          pets.length > 0 ? (
                pets.map(pet => (
                    <div key={pet.petID} onClick={clickPet} className='w-full mb-5 duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959] relative h-64 flex flex-col drop-shadow-md rounded-xl overflow-hidden'>
                        <img draggable='false' className='h-full w-full object-cover' src={pet.petImages[0]} alt="" />
                        <img className='absolute bottom-12 right-2 hover:opacity-100 opacity-85 duration-150 bg-[#FAFAFA] z-10 w-12 h-12 rounded-full p-2' src={unfavorite} alt="" />
                        <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>{pet.petName}</p>
                    </div>
                ))
            ) : (
                <p className='text-center col-span-full text-xl font-medium text-text'>Sorry, no available pets for adoption right now.</p>
            )}
        </div>
    </div>
  )
}

export default ForAdoption