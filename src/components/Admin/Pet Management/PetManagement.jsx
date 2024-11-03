import React, { useEffect, useState } from 'react'
import Options from './Options'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import PostPet from './PostPet';
import Pets from './Pets';
import RehomedPets from './RehomedPets';

function PetManagement() {
  const [postPetOpen, setPostPetOpen] = useState(false);
  const [petType, setPetType] = useState('All');
  const [pets, setPets] = useState([]);
  const [petInfoOpen, setPetInfoOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [rehomedOpen, setRehomedOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      setLoading(true);
      let petsQuery = collection(db, "petsForAdoption");

      // Apply pet type filter
      if (petType !== 'All') {
        petsQuery = query(petsQuery, where("petType", "==", petType));
      }

      // Sort by the timePosted field
      petsQuery = query(petsQuery, orderBy("timePosted", "desc"));

      // Fetch data
      const querySnapshot = await getDocs(petsQuery);

      // Map through docs to create an array of pets
      const petsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPets(petsList);
    } 
    catch (err) {
      console.error("Error fetching pets:", err);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [petType]);

  const handlePetTypeChange = (select) => {
    setPetType(select);
  }

  const handleClickPetOpen = () => {
    setPostPetOpen(!postPetOpen);
  }

  const toggleRehomed = () => {
    setRehomedOpen(!rehomedOpen);
  }

  return (
    <div className='pt-36 lg:pt-20 lg:pl-52 z-30 lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
      <div className='flex-grow mt-3 flex flex-col gap-1 items-center lg:items-start lg:flex-row'>
        <div style={{display: rehomedOpen ? 'none' : postPetOpen ? 'none' : petInfoOpen ? 'none' : 'flex'}} className='flex-col w-full lg:flex-row mx-auto'>
          <div className='order-1 lg:order-2'>
            <Options openRehomed={toggleRehomed} openPostPet={handleClickPetOpen} changeFilter={handlePetTypeChange} selected={petType} />
          </div>
          <div className='order-2 lg:order-1 lg:ml-3 my-3 lg:my-0 lg:mb-3 justify-center flex mx-auto flex-grow sm:rounded-lg lg:rounded-lg bg-secondary shadow-custom w-full sm:w-[90%] lg:w-full lg:mr-[11.7rem] xl:mr-[12.7rem] 2xl:mr-[13.6rem]'>
            <Pets pets={pets} selected={petType} loading={loading} />    
          </div>
        </div>
        <div style={{display: postPetOpen ? 'block' : 'none'}} className='w-full'>
          <PostPet closePostPet={handleClickPetOpen} />
        </div>
        <div className={`${rehomedOpen ? 'block' : 'hidden'} w-full h-full flex-grow bg-secondary mb-3 lg:ml-3 lg:rounded-lg shadow-custom`}>
          <RehomedPets closeRehomed={toggleRehomed} />
        </div>
      </div>
    </div>
  )
}

export default PetManagement