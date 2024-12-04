import React from 'react'
import Header from './Header'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import MeetupChecker from './MeetupChecker'
import ActivityTracker from '../General/ActivityTracker'

function Admin() {
 

  return (
    <div className='w-full min-h-screen bg-[#A1E4E4] select-none font-poppins text-text'>
       <MeetupChecker />
       <ActivityTracker />
       <Header />
       <Outlet />
       <NavBar />
    </div>
  )
}

export default Admin