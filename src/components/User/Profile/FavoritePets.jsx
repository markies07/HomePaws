import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close.svg'
import { AuthContext } from '../../General/AuthProvider';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import FavoritePet from '../Find Pet/FavoritePet';

function FavoritePets({closePetListed}) {
    const {user, userData} = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [favPets, setFavPets] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavoritePets = async () => {
            try{
                const favoritePetsRef = collection(db, 'favoritePets');
                const favoritePetsQuery = query(favoritePetsRef, where('userID', '==', user.uid));
                const favoritePetsSnap = await getDocs(favoritePetsQuery);

                const petIDs = favoritePetsSnap.docs.map((doc) => doc.data().petID);

                const petsData = await Promise.all(
                    petIDs.map(async (petID) => {
                        const petRef = doc(db, 'petsForAdoption', petID);
                        const petSnap = await getDoc(petRef);
                        return petSnap.exists() ? { id: petID, ...petSnap.data() } : null;
                    })
                )
                setFavPets(petsData.filter(pet => pet !== null));
                setLoading(false);
            }
            catch(error){
                console.error(error);
                setLoading(false);
            }
        }

        if(user.uid){
            fetchFavoritePets();
        }

    }, [user.uid]);


    return (
        <div className='p-3 lg:pt-3 lg:px-0 min-h-[calc(100dvh-145px)] lg:min-h-[calc(100dvh-80px)] w-full'>
            <div className='bg-secondary p-3 sm:p-5 relative w-full shadow-custom h-full rounded-md lg:rounded-lg'>
                <img onClick={closePetListed} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <p className='text-2xl font-medium pt-1 sm:pt-0'>Favorite Pets</p>
                
                <div className='pt-5 inline-grid place-items-center gap-3 sm:gap-4 h-full w-full justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                    {loading ? (
                        <div className='text-center font-medium w-full col-span-full text-lg'>Loading pets...</div>
                    ):
                    favPets.length > 0 ? (
                        favPets.map(pet => (
                            <div key={pet.id} onClick={() => navigate(`/dashboard/find-pet/${pet.id}`)} className='w-full mb-5 duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959] relative h-64 2xl:h-72 flex flex-col drop-shadow-md rounded-xl overflow-hidden'>
                                <img draggable='false' className='h-full w-full object-cover' src={pet.petImages[1]} alt="" />
                                {user && (
                                    <div className='absolute bottom-12 right-2' onClick={(e) => {e.stopPropagation();}}>
                                        <FavoritePet petOwner={pet.userID} petID={pet.petID} />
                                    </div>
                                )}
                                <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>{pet.petName}</p>
                            </div>
                        ))
                    ):(
                        <div className='text-center h-full flex-grow font-medium w-full col-span-full text-lg'>You don't have favorite pet</div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default FavoritePets