import React, { useContext, useEffect } from 'react'
import Header from './Header'
import NavBar from './NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../General/AuthProvider'

function Admin() {
  const {userData} = useContext(AuthContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if(userData?.role !== 'admin'){
  //     navigate('/dashboard/find-pet');
  //   }
  // }, [userData, navigate]);

  return (
    <div className='w-full min-h-screen bg-[#A1E4E4] select-none font-poppins text-text'>
       <Header />
       <Outlet />
       <NavBar />
    </div>
  )
}

export default Admin