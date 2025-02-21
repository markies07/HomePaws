import React, { useState } from 'react'
import Header from './Header'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import MeetupChecker from './MeetupChecker'
import ActivityTracker from '../General/ActivityTracker'
import EditAboutUs from './EditAboutUs'

function Admin() {
 
  const [openEdit, setOpenEdit] = useState(false);

  const toggleEdit = () => {
    setOpenEdit(!openEdit);
  }

  return (
    <div className='w-full min-h-screen bg-[#A1E4E4] select-none font-poppins text-text'>
      <div className={`${openEdit ? 'hidden' : 'block'}`}>
        <MeetupChecker />
        <ActivityTracker />
        <Header openEdit={toggleEdit} />
        <Outlet />
        <NavBar />
      </div>
      <div className={`${openEdit ? 'block' : 'hidden'}`}>
        <EditAboutUs closeEdit={toggleEdit} />
      </div>
    </div>
  )
}

export default Admin