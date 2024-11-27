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
import AboutUs from './AboutUs'
import Feedbacks from './Feedbacks'
import MeetTheTeam from './MeetTheTeam'
import FAQs from './FAQs'
import Rules from './Rules'
import ContactUs from './ContactUs'

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
  const [isFaqsOpen, setIsFaqsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openForAdoption = (type) => {
    setIsOpen(!isOpen);
    setPetType(type);
  } 

  const closeForAdoption = () => {
    setIsOpen(!isOpen);
    setPetType(null);
  } 

  const toggleFaqs = () => {
    setIsFaqsOpen(!isFaqsOpen);
  }

  const toggleRules = () => {
    setIsRulesOpen(!isRulesOpen);
  }

  const toggleContact = () => {
    setIsContactOpen(!isContactOpen);
  }

  return (
    <div className='relative flex flex-col select-none font-poppins bg-secondary'>
      < ForAdoption petType={petType} isOpen={isOpen} closeUI={closeForAdoption} />
      < CreateAccount createOpen={isCreateOpen} createClose={() => dispatch(closeCreate())} />
      < LoginForm loginOpen={isLogin} loginClose={() => dispatch(closeIsLogin())} />
      < Login 
        isOpen={isLoginOpen} 
        onClose={() => dispatch(closeLogin())} 
        handleCreateClick={() => dispatch(toggleCreate())} 
        handleLogin={() => dispatch(toggleIsLogin())} 
      />
      <div className={`${isFaqsOpen ? 'block' : 'hidden'}`}>
        < FAQs closeFaqs={toggleFaqs} />
      </div>
      <div className={`${isRulesOpen ? 'block' : 'hidden'}`}>
        < Rules closeRules={toggleRules} />
      </div>
      <div className={isContactOpen ? 'block' : 'hidden'}>
        < ContactUs closeContact={toggleContact} />
      </div>
      <div className={`${isFaqsOpen || isRulesOpen ? 'hidden' : 'block'} relative bg-secondary`}>
        {isLoginOpen && (<div onClick={() => dispatch(closeLogin())}  className='fixed inset-0 duration-150 bg-black opacity-50 z-20'></div>)}
        < Header onLoginClick={() => dispatch(toggleLogin())} />
        < Content open={openForAdoption} onLoginClick={() => dispatch(toggleLogin())} openDog={() => dispatch(toggleDog())}/>
        < AboutUs />
        < Feedbacks />
        < MeetTheTeam />
        < Footer openContact={toggleContact} openFaqs={toggleFaqs} openRules={toggleRules} />
      </div>
    </div>
  )
}

export default LandingPage
