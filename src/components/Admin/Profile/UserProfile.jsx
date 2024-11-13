import React, { useContext } from 'react';
import { AuthContext } from '../../General/AuthProvider';
import edit from './assets/edit.svg';
import Options from './Options'

function UserProfile({openPetListed, openFavPets, openEdit}) {
    const { userData, user } = useContext(AuthContext);

    return (
        <div className='w-full my-3 lg:mt-3 relative px-3 lg:px-0'>
            <div className='rounded-md lg:rounded-lg w-full flex-col md:flex-row md:justify-between pb-3 md:py-5 pt-4 px-3 md:px-5 lg:px-7 gap-2 md:gap-5 flex justify-center items-center bg-secondary shadow-custom relative'>
                <div className='flex flex-col w-full justify-center items-center md:justify-start md:flex-row'>
                    <div className='w-24 h-24 md:my-auto sm:w-28 sm:h-28 shrink-0 bg-text mb-2 rounded-full relative'>
                        <img className='w-full h-full object-cover rounded-full' src={userData.profilePictureURL} alt="" />
                        <img src={edit} onClick={openEdit} className='absolute cursor-pointer hover:bg-primaryHover duration-150 rounded-full bottom-0 overflow-visible -right-2 md:-right-1 w-8 p-2 bg-primary' alt="" />
                    </div>
                    <div className='flex flex-col md:items-start md:ml-5 lg:ml-7'>
                        <p className='font-medium text-xl text-center leading-6 mb-4 md:mb-1 md:text-2xl md:text-start'>{userData.fullName}</p>
                        <div className='text-white text-xs flex justify-center md:justify-start gap-1 flex-wrap'>
                            <p className={`bg-primary py-1 px-3 rounded-full whitespace-nowrap ${userData.petOwnerType !== 'Both' ? 'block' : 'hidden'}`}>{userData.petOwnerType}</p>
                            <div className={userData.petOwnerType === 'Both' ? 'flex gap-1' : 'hidden'}>
                                <p className='bg-primary py-1 px-3 rounded-full whitespace-nowrap'>Dog Owner</p>
                                <p className='bg-primary py-1 px-3 rounded-full whitespace-nowrap'>Cat Owner</p>
                            </div>
                            <p className={` bg-text text-white py-1 px-3 rounded-full whitespace-nowrap`}>Admin</p>
                        </div>
                    </div>
                </div>
                < Options openPetListed={openPetListed} openFavPets={openFavPets} />
            </div>
        </div>
    )
}

export default UserProfile