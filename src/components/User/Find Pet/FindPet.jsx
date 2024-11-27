import React, { useEffect, useState } from 'react';
import Options from './Options';
import Pets from './Pets';
import PostPet from './PostPet';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

function FindPet() {
  const [postPetOpen, setPostPetOpen] = useState(false);
  const [petType, setPetType] = useState('All');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    breed: 'Any',
    age: 'Any',
    gender: 'Any',
    size: 'Any',
    color: 'Any',
    municipality: 'Any'
  });

  useEffect(() => {
    fetchPets();
  }, [petType, filters]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      let petsQuery = collection(db, "petsForAdoption");

      // Apply pet type filter
      if (petType !== 'All') {
        petsQuery = query(petsQuery, where("petType", "==", petType));
      }

      // Apply additional filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'Any') {
          petsQuery = query(petsQuery, where(key, "==", value));
        }
      });

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
      setError(err.message);
    }
    finally{
      setLoading(false);
    }
  };


  const handleClickPetOpen = () => {
    setPostPetOpen(!postPetOpen);
  }

  const handlePetTypeChange = (select) => {
    setPetType(select);
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className='pt-36 lg:pt-[4.75rem] lg:pl-48 xl:pl-[13.8rem] lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
      <div className='flex-grow flex flex-col gap-1 items-center lg:items-start lg:flex-row'>
        <div style={{display: postPetOpen ? 'none' : 'flex'}} className='flex-col w-full lg:flex-row mx-auto'>
          <div className='order-1 lg:order-2'>
            <Options openPostPet={handleClickPetOpen} filters={filters} onFilterChange={handleFilterChange} changeFilter={handlePetTypeChange} selected={petType} />
          </div>
          <div className='order-2 lg:order-1 justify-center flex mx-auto flex-grow sm:rounded-lg lg:rounded-lg bg-secondary shadow-custom mt-3 mb-4 lg:my-4 w-full sm:w-[90%] lg:w-full lg:mr-[11.7rem] xl:mr-[12.7rem] 2xl:mr-[13.6rem]'>
            <Pets pets={pets} selected={petType} loading={loading} />    
          </div>
        </div>
        <div style={{display: postPetOpen ? 'block' : 'none'}} className='w-full'>
          <PostPet closePostPet={handleClickPetOpen} />
        </div>
      </div>
    </div>
  );
}

export default FindPet;
