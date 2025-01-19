import React, { useEffect, useState } from 'react'
import unfavorite from '../../assets/icons/unfavorite.svg'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

function AnimalCard({onLoginClick}) {
  
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const q = query(collection(db, "petsForAdoption"), orderBy('timePosted', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      const petsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPets(petsList);
    }
    fetchPets();
  }, []);


  return (
    <>
      {pets.map((pet, index) => (
        <div key={index} onClick={onLoginClick} className='w-full duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959] max-w-48 relative h-64 flex flex-col drop-shadow-lg rounded-xl overflow-hidden'>
          <img draggable='false' className='h-full w-full object-cover' src={pet.petImages[1]} alt="" />
          <img className='absolute bottom-12 right-2 hover:opacity-100 opacity-85 duration-150 bg-[#FAFAFA] z-10 w-12 h-12 rounded-full p-2' src={unfavorite} alt="" />
          <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>{pet.petName}</p>
        </div>
      ))}
    </>
  );
};

export default AnimalCard