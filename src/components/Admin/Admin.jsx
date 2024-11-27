import React from 'react'
import Header from './Header'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import MeetupChecker from './MeetupChecker'

function Admin() {
 

  return (
    <div className='w-full min-h-screen bg-[#A1E4E4] select-none font-poppins text-text'>
       <MeetupChecker />
       <Header />
       <Outlet />
       <NavBar />
    </div>
  )
}

export default Admin