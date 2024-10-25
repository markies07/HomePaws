import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../General/AuthProvider';
import FavoritePet from './FavoritePet';

function Pets({pets, loading}) {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        
        <div className='px-3 py-6 inline-grid place-items-center gap-3 sm:gap-4 h-full w-full justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:px-5'>
            {pets.length > 0 ? (
                pets.map(pet => (
                    <div key={pet.petID} onClick={() => navigate(`/dashboard/find-pet/${pet.petID}`)} className='w-full mb-5 duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959] relative h-64 2xl:h-72 flex flex-col drop-shadow-md rounded-xl overflow-hidden'>
                        <img draggable='false' className='h-full w-full object-cover' src={pet.petImages[1]} alt="" />
                        {user && (
                            <div className='absolute bottom-12 right-2' onClick={(e) => {e.stopPropagation();}}>
                                <FavoritePet petOwner={pet.userID} petID={pet.petID} />
                            </div>
                        )}
                        <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>{pet.petName}</p>
                    </div>
                ))
            ) : loading ? (
                <p className='text-center col-span-full text-xl font-medium text-text'>Loading pets...</p>
            ) : (
                <p className='text-center col-span-full text-xl font-medium text-text'>No available pets.</p>
            )}
        </div>
    )
}

export default Pets