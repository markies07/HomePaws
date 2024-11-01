import React, { useContext, useState } from 'react'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
import Login from './Login'
import CreateAccount from './CreateAccount'
import LoginForm from './LoginForm'
import ForAdoption from './ForAdoption'
import { useSelector, useDispatch } from 'react-redux';
import { 
  toggleLogin, closeLogin, 
  toggleCreate, closeCreate, 
  toggleIsLogin, closeIsLogin, 
  toggleDog, closeDog 
} from '../../store/uiSlice';
import { AuthContext } from '../General/AuthProvider'
import { Navigate } from 'react-router-dom'

function LandingPage() {

  const { user, userData } = useContext(AuthContext);

  if (user) {
    if(userData?.role === 'admin'){
      return <Navigate to="/admin/pet-management" />;
    }
    else{
      return <Navigate to="/dashboard/find-pet" />; // Redirect to the landing page if not logged in
    }
  }

  const dispatch = useDispatch();
  const isLoginOpen = useSelector(state => state.ui.isLoginOpen);
  const isCreateOpen = useSelector(state => state.ui.isCreateOpen);
  const isLogin = useSelector(state => state.ui.isLogin);

  const [isOpen, setIsOpen] = useState(false);
  const [petType, setPetType] = useState('');

  const openForAdoption = (type) => {
    setIsOpen(!isOpen);
    setPetType(type);
  } 

  const closeForAdoption = () => {
    setIsOpen(!isOpen);
    setPetType(null);
  } 

  return (
    <div className='relative min-h-screen flex flex-col select-none'>
      < ForAdoption petType={petType} isOpen={isOpen} closeUI={closeForAdoption} />
      < CreateAccount createOpen={isCreateOpen} createClose={() => dispatch(closeCreate())} />
      < LoginForm loginOpen={isLogin} loginClose={() => dispatch(closeIsLogin())} />
      < Login 
        isOpen={isLoginOpen} 
        onClose={() => dispatch(closeLogin())} 
        handleCreateClick={() => dispatch(toggleCreate())} 
        handleLogin={() => dispatch(toggleIsLogin())} 
      />
      <div className='bg-[#FAFAFA] relative'>
        {isLoginOpen && (<div onClick={() => dispatch(closeLogin())}  className='fixed inset-0 duration-150 bg-black opacity-50 z-20'></div>)}
        < Header onLoginClick={() => dispatch(toggleLogin())} />
        < Content open={openForAdoption} onLoginClick={() => dispatch(toggleLogin())} openDog={() => dispatch(toggleDog())}/>
        < Footer />
      </div>
    </div>
  )
}

export default LandingPage
