import React, { useEffect, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function RehomedPets({closeRehomed}) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPets = async () => {
        try {
          setLoading(true);
          let petsQuery = collection(db, "rehomedPets");
    
          // Sort by the timePosted field
          petsQuery = query(petsQuery, orderBy("timestamp", "desc"));
    
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
    }, []);

    return (
        <div className='w-full mb-3'>
            <div className='relative p-4 lg:px-5 lg:rounded-lg w-full h-full flex-grow'>
                <img onClick={closeRehomed} className='absolute border-2 border-secondary hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                <p className='font-medium text-2xl pt-1'>Rehomed Pets</p>

                {/* PETS */}
                <div className='pt-5 inline-grid place-items-center gap-3 sm:gap-4 h-full w-full justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
                    {pets.length > 0 ? (
                        pets.map(pet => (
                            <div key={pet.rehomedID} onClick={() => navigate(`/admin/pet-management/rehomed/${pet.rehomedID}`)} className='w-full duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959] relative h-60 2xl:h-72 flex flex-col drop-shadow-md rounded-xl overflow-hidden'>
                                <img draggable='false' className='h-full w-full object-cover' src={pet.petDetails.petImages[1]} alt="" />
                                <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>{pet.petDetails.petName}</p>
                            </div>
                        ))
                    ) : loading ? (
                        <p className='text-center col-span-full text-xl font-medium text-text'>Loading pets...</p>
                    ) : (
                        <p className='text-center col-span-full text-xl font-medium text-text'>No rehomed pets.</p>
                    )}

                </div>
            </div>
        </div>
    )
}

export default RehomedPets