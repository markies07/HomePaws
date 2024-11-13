import React, { useState } from 'react'
import UserProfile from './UserProfile'
import UserPosts from './UserPosts'
import PetListed from './PetListed'
import EditProfile from './EditProfile'


function Profile() {
    // const [applicationsOpen, setApplicationsOpen] = useState(false);
    const [petListedOpen, setPetListedOpen] = useState(false);
    const [favPetsOpen, setFavPetsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);


    const togglePetListed = () => {
    setPetListedOpen(!petListedOpen);
    }

    const toggleFavPets = () => {
    setFavPetsOpen(!favPetsOpen);
    }

    const toggleEdit = () => {
    setEditOpen(!editOpen);
    }


    return (
        <div className='pt-36 relative lg:pt-20 lg:pl-56 lg:pr-3 lg:ml-3 min-h-screen flex flex-col font-poppins text-text'>
            <div className={ !petListedOpen && !favPetsOpen ? 'block' : 'hidden'}>
                <div className={`${editOpen ? 'hidden' : 'block'}`}>
                    < UserProfile openEdit={toggleEdit} openPetListed={togglePetListed} openFavPets={toggleFavPets} />
                </div>
                <div className={`${editOpen ? 'block' : 'hidden'}`}>
                    < EditProfile closeEdit={toggleEdit} />
                </div>
                <div className={`${editOpen ? 'hidden' : 'block'}`}>
                    < UserPosts />
                </div>
            </div>
            <div className={petListedOpen ? 'block' : 'hidden'}>
                < PetListed closePetListed={togglePetListed} />
            </div>
        </div>
    )
}

export default Profile