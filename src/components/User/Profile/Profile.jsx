import React, { useState } from 'react'
import UserProfile from './UserProfile'
import UserPosts from './UserPosts'
import PetListed from './PetListed'
import FavoritePets from './FavoritePets'
import EditProfile from './EditProfile'
import Verify from './Verify'

function Profile() {
  // const [applicationsOpen, setApplicationsOpen] = useState(false);
  const [petListedOpen, setPetListedOpen] = useState(false);
  const [favPetsOpen, setFavPetsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);


  const togglePetListed = () => {
    setPetListedOpen(!petListedOpen);
  }

  const toggleFavPets = () => {
    setFavPetsOpen(!favPetsOpen);
  }

  const toggleEdit = () => {
    setEditOpen(!editOpen);
  }

  const toggleVerify = () => {
    setVerifyOpen(!verifyOpen);
  }


  return (
    <div className='pt-36 relative lg:pt-20 lg:pl-48 xl:pl-[13.8rem] lg:pr-[13px] lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
      <div className={ !petListedOpen && !favPetsOpen ? 'block' : 'hidden'}>
        <div className={`${editOpen ? 'hidden' : verifyOpen ? 'hidden' : 'block'}`}>
          < UserProfile openEdit={toggleEdit} openPetListed={togglePetListed} openFavPets={toggleFavPets} />
        </div>
        <div className={`${verifyOpen ? 'hidden' : editOpen ? 'block' : 'hidden'}`}>
          < EditProfile closeEdit={toggleEdit} openVerify={toggleVerify} />
        </div>
        <div className={`${verifyOpen ? 'block' : 'hidden'}`}>
          < Verify closeVerify={toggleVerify} />
        </div>
        <div className={`${editOpen ? 'hidden' : verifyOpen ? 'hidden' : 'block'}`}>
          < UserPosts />
        </div>
      </div>
      <div className={petListedOpen ? 'block' : 'hidden'}>
        < PetListed closePetListed={togglePetListed} />
      </div>
      <div className={favPetsOpen ? 'block' : 'hidden'}>
        <FavoritePets closePetListed={toggleFavPets} />
      </div>
      
    </div>
  )
}

export default Profile