import React, { useEffect, useState } from 'react'
import unfavorite from '../../assets/icons/unfavorite.svg'
import { db } from '../../firebase/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

function AvailablePets() {

    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchPets = async () => {
            const petsQuery = query(collection(db, "petsForAdoption"), orderBy("timePosted", "desc"));
            const querySnapshot = await getDocs(petsQuery);
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
            {pets.length > 0 ? (
                pets.map(pet => (
                    <div key={pet.petID} className='w-full mb-5 duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959] max-w-48 relative h-64 flex flex-col drop-shadow-md rounded-xl overflow-hidden'>
                        <img draggable='false' className='h-full w-full object-cover' src={pet.petImages[0]} alt="" />
                        <img className='absolute bottom-12 right-2 hover:opacity-100 opacity-85 duration-150 bg-[#FAFAFA] z-10 w-12 h-12 rounded-full p-2' src={unfavorite} alt="" />
                        <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>{pet.petName}</p>
                    </div>
                ))
            ) : (
                <p className='text-center text-xl font-medium text-text'>Sorry, no available pets for adoption right now.</p>
            )}
        </>
    )
}

export default AvailablePets