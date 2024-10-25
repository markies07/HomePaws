import React, { useContext, useEffect, useState } from 'react'
import findpet from './assets/findpet-icon.svg'
import activefindpet from './assets/active-findpet.svg'
import newsfeed from './assets/newsfeed-icon.svg'
import activenewsfeed from './assets/active-newsfeed.svg'
import chat from './assets/chat-icon.svg'
import activechat from './assets/active-chat.svg'
import profile from './assets/profile-icon.svg'
import activeprofile from './assets/active-profile.svg'
import notification from './assets/notification.svg'
import activenotification from './assets/active-notification.svg'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../General/AuthProvider'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

function NavBar() {
  const {user} = useContext(AuthContext);
  const [hasUnseenNotif, setHasUnseenNotif] = useState(false);
  const [hasUnseenMess, setHasUnseenMess] = useState(false);

  const fetchUnseenNotif = async () => {
    const notificationRef = collection(db, 'notifications');
    const q = query(notificationRef, where('userId', '==', user.uid), where('isRead', '==', false));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  const fetchUnseenMess = async () => {
    const chatQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid)
    );
  
    const chatSnapshot = await getDocs(chatQuery);
    let hasUnseenMessages = false;

    for(const chatDoc of chatSnapshot.docs){
      const messagesRef = collection(db, `chats/${chatDoc.id}/messages_${user.uid}`);
      const unseenMessagesQuery = query(messagesRef, where('read', '==', false));

      const unseenMessagesSnapshot = await getDocs(unseenMessagesQuery);

      if(!unseenMessagesSnapshot.empty){
        hasUnseenMessages = true;
        break;
      }
    }
    return hasUnseenMessages;
  }


  useEffect(() => {
    const getNotifStatus = async () => {
      const unseen = await fetchUnseenNotif();
      setHasUnseenNotif(unseen);
    }

    const getMessStatus = async () => {
      const unread = await fetchUnseenMess();
      setHasUnseenMess(unread);
    }

    getMessStatus();
    getNotifStatus();
  }, [user.uid]);



  return (
    <>
      {/* MOBILE VIEW */}
      <div className='fixed top-20 z-10 w-full text-text bg-secondary items-center flex justify-between px-5 sm:px-14 md:px-28 pb-3 pt-2 -mt-1 shadow-md lg:hidden'>
        
        {/* FIND PET */}
        <NavLink to="/dashboard/find-pet" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-3 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md'}>
          {({isActive}) => (
            <img src={isActive ? activefindpet : findpet} alt="Paw Icon" />
          )}
        </NavLink>

        {/* NEWS FEED */}
        <NavLink to="/dashboard/news-feed" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-3 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md'}>
          {({isActive}) => (
            <img src={isActive ? activenewsfeed : newsfeed} alt="Paw Icon" />
          )}
        </NavLink>

        {/* NOTIFICATION */}
        <NavLink to="/dashboard/notification" onClick={() => setHasUnseenNotif(false)} className={({ isActive }) => isActive ? 'py-2 relative bg-primary cursor-pointer duration-150 px-3 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md'}>
          {({isActive}) => (
            <div className='relative'>
              <img className='w-7' src={isActive ? activenotification : notification} alt="Paw Icon" />
              {/* NOTIFICATION */}
              {hasUnseenNotif && (
                <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary -right-1 -top-1'/>
              )}
            </div>
          )}
        </NavLink>

        {/* CHAT */}
        <NavLink to="/dashboard/chat" onClick={() => setHasUnseenMess(false)} className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-3 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md'}>
          {({isActive}) => (
            <div className='relative'>
              <img className='w-[30px]' src={isActive ? activechat : chat} alt="Paw Icon" />
              {/* NOTIFICATION */}
              {hasUnseenMess && (
                <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary -right-2 -top-2'/>
              )}
            </div>
          )}
        </NavLink>

        {/* PROFILE */}
        <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-3 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md'}>
          {({isActive}) => (
            <div className='relative'>
              <img className='w-8' src={isActive ? activeprofile : profile} alt="Paw Icon" />
              {/* NOTIFICATION */}
              {/* <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary -right-2 -top-1'/> */}
            </div>
          )}
        </NavLink>

      </div>

      {/* DESKTOP VIEW */}
      <div className='hidden lg:block fixed top-[5.75rem]'>
        <div className='bg-secondary min-h-screen pt-7 flex flex-col items-center rounded-tr-lg gap-5 shadow-xl px-3 xl:w-56 text-text font-semibold'>
        
          {/* FIND PET */}
          <NavLink to="/dashboard/find-pet" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-primary' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-[#D9D9D9]'}>
            {({isActive}) => (
              <div className='flex items-center'>
                <img className='pl-4 w-12' src={ isActive ? activefindpet : findpet} alt="" />
                <p className={isActive ? 'text-base text-white font-medium pl-4 xl:pl-5' : 'text-base text-text font-medium pl-4 xl:pl-5'}>Find Pet</p>
              </div>
            )}
          </NavLink>

          {/* NEWS FEED */}
          <NavLink to="/dashboard/news-feed" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-primary' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-[#D9D9D9]'}>
            {({isActive}) => (
              <div className='flex items-center'>
                <img className='pl-5 w-12' src={ isActive ? activenewsfeed : newsfeed} alt="" />
                <p className={isActive ? 'text-base text-white font-medium pl-4 xl:pl-5' : 'text-base text-text font-medium pl-4 xl:pl-5'}>News Feed</p>
              </div>
            )}
          </NavLink>

          {/* NOTIFICATION */}
          <NavLink to="/dashboard/notification" onClick={() => setHasUnseenNotif(false)} className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-primary' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-[#D9D9D9]'}>
            {({isActive}) => (
              <div className='flex items-center relative'>
                <img className='pl-5 w-[3rem]' src={ isActive ? activenotification : notification} alt="" />
                <p className={isActive ? 'text-base text-white font-medium pl-4 xl:pl-5' : 'text-base text-text font-medium pl-4 xl:pl-5'}>Notification</p>
                {/* NOTIFICATION */}
                {hasUnseenNotif && (
                  <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary left-10 top-2'/>
                )}
              </div>
            )}
          </NavLink>

          {/* CHAT */}
          <NavLink to="/dashboard/chat" onClick={() => setHasUnseenMess(false)} className={({ isActive }) => isActive ? 'bg-primary relative flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-primary' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-[#D9D9D9]'}>
            {({isActive}) => (
              <div className='flex items-center relative'>
                <img className='pl-5 w-12' src={ isActive ? activechat : chat} alt="" />
                <p className={isActive ? 'text-base text-white font-medium pl-4 xl:pl-5' : 'text-base text-text font-medium pl-4 xl:pl-5'}>Chat</p>
                {/* NOTIFICATION */}
                {hasUnseenMess && (
                  <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary left-10 top-2'/>
                )}
              </div>
            )}
          </NavLink>


          {/* PROFILE */}
          <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-primary' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 hover:bg-[#D9D9D9]'}>
            {({isActive}) => (
              <div className='flex items-center relative'>
                <img className='pl-4 w-12' src={ isActive ? activeprofile : profile} alt="" />
                <p className={isActive ? 'text-base text-white font-medium pl-4 xl:pl-5' : 'text-base text-text font-medium pl-4 xl:pl-5'}>Profile</p>
                {/* NOTIFICATION */}
                {/* <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary left-10 top-2'/> */}
              </div>
            )}
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default NavBar