import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import findpet from './assets/findpet-icon.svg'
import activefindpet from './assets/active-findpet.svg'
import usersTab from './assets/users.svg'
import activeaUsersTab from './assets/active-users.svg'
import report from './assets/report.svg'
import activeReport from './assets/active-report.svg'
import chat from './assets/chat-icon.svg'
import activechat from './assets/active-chat.svg'
import newsfeed from './assets/newsfeed-icon.svg'
import activenewsfeed from './assets/active-newsfeed.svg'
import profile from './assets/profile-icon.svg'
import activeprofile from './assets/active-profile.svg'
import notification from './assets/notification.svg'
import activenotification from './assets/active-notification.svg'
import stats from './assets/stats.svg'
import activestats from './assets/active-stats.svg'
import { AuthContext } from '../General/AuthProvider'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

function NavBar() {
    const { user } = useContext(AuthContext);
    const [hasUnseenNotif, setHasUnseenNotif] = useState(false);
    const [hasUnseenMess, setHasUnseenMess] = useState(false);
    const [hasUnseenReport, setHasUnseenReport] = useState(false);
    
    useEffect(() => {
      if (!user || !user.uid) return;
    
      // Listener for unseen notifications
      const notificationRef = collection(db, 'notifications');
      const notificationQuery = query(notificationRef, where('userId', '==', user.uid), where('isRead', '==', false));
    
      const unsubscribeNotifications = onSnapshot(notificationQuery, (snapshot) => {
        setHasUnseenNotif(!snapshot.empty); // Set to true if unseen notifications exist
      });
    
      // Listener for unseen messages
      const chatQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid)
      );
    
      const unsubscribeMessages = onSnapshot(chatQuery, async (chatSnapshot) => {
        let hasUnseenMessages = false;
    
        const checkMessages = async () => {
          for (const chatDoc of chatSnapshot.docs) {
            const messagesRef = collection(db, `chats/${chatDoc.id}/messages_${user.uid}`);
            const unseenMessagesQuery = query(messagesRef, where('read', '==', false));
    
            const messagesSnapshot = await getDocs(unseenMessagesQuery);
            if (!messagesSnapshot.empty) {
              hasUnseenMessages = true;
              break; // Stop checking further if an unread message is found
            }
          }
        };
    
        await checkMessages();
        setHasUnseenMess(hasUnseenMessages);
      });
    
      // Listener for unseen user reports
      const reportsRef = collection(db, 'userReports');
      const reportsQuery = query(reportsRef, where('read', '==', false));
    
      const unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
        setHasUnseenReport(!snapshot.empty); // Set to true if unseen reports exist
      });
    
      // Cleanup listeners on unmount
      return () => {
        unsubscribeNotifications();
        unsubscribeMessages();
        unsubscribeReports();
      };
    }, [user.uid]);


    return (
        <>
            {/* MOBILE VIEW */}
            <div className='fixed top-20 z-10 w-full text-text bg-secondary items-center flex justify-between px-5 sm:px-10 md:px-24 pb-3 pt-2 -mt-1 shadow-md lg:hidden'>
                
                {/* PET MANAGEMENT */}
                <NavLink to="/admin/pet-management" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-8 h-7' src={isActive ? activefindpet : findpet} alt="Paw Icon" />
                )}
                </NavLink>

                {/* USER MANAGEMENT */}
                <NavLink to="/admin/user-management" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-8 h-7' src={isActive ? activeaUsersTab : usersTab} alt="Paw Icon" />
                )}
                </NavLink>

                {/* ADOPTION STATISTICS */}
                <NavLink to="/admin/adoption-stats" className={({ isActive }) => isActive ? 'py-2 relative bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-8 h-7' src={isActive ? activestats : stats} alt="Paw Icon" />
                )}
                </NavLink>

                {/* REPORT MANAGEMENT */}
                <NavLink to="/admin/report-management" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <div className='relative'>
                        <img className='w-8 h-7' src={isActive ? activeReport : report} alt="Paw Icon" />
                        {/* NOTIFICATION */}
                        {hasUnseenReport && (
                            <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary -right-1 -top-1'/>
                        )}
                    </div>
                )}
                </NavLink>

                {/* NEWS FEED */}
                <NavLink to="/admin/news-feed" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-8 h-7' src={isActive ? activenewsfeed : newsfeed} alt="Paw Icon" />
                )}
                </NavLink>

                {/* NOTIFICATION */}
                <NavLink to="/admin/notification" onClick={() => setHasUnseenNotif(false)} className={({ isActive }) => isActive ? 'py-2 relative bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <div className='relative'>
                        <img className='w-8 h-7' src={isActive ? activenotification : notification} alt="Paw Icon" />
                        {/* NOTIFICATION */}
                        {hasUnseenNotif && (
                            <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary -right-1 -top-1'/>
                        )}
                    </div>
                )}
                </NavLink>

                {/* CHAT */}
                <NavLink to="/admin/chat" onClick={() => setHasUnseenMess(false)} className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <div className='relative'>
                        <img className='w-9 h-7' src={isActive ? activechat : chat} alt="Paw Icon" />
                        {/* NOTIFICATION */}
                        {hasUnseenMess && (
                            <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary -right-2 -top-2'/>
                        )}
                    </div>
                )}
                </NavLink>

                {/* PROFILE */}
                <NavLink to="/admin/profile" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-10 h-8' src={isActive ? activeprofile : profile} alt="Paw Icon" />
                )}
                </NavLink>
            </div>

            {/* DESKTOP VIEW */}
            <div className='hidden lg:block shadow-lg fixed max-h-[calc(100dvh-90px)] overflow-y-auto top-[5.75rem]'>
                <div className='pt-7 bg-secondary pb-4 flex-grow min-h-[calc(100dvh-90px)] shrink-0 flex flex-col items-center rounded-tr-lg gap-5 px-3 w-56 text-text font-semibold'>
                
                    {/* PET MANAGEMENT */}
                    <NavLink to="/admin/pet-management" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center'>
                            <img className='pl-4 w-12' src={ isActive ? activefindpet : findpet} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium leading-4 pl-4' : 'text-base text-text leading-4 font-medium pl-4'}>Pet Management</p>
                        </div>
                        )}
                    </NavLink>

                    {/* USER MANAGEMENT */}
                    <NavLink to="/admin/user-management" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center'>
                            <img className='pl-5 w-12' src={ isActive ? activeaUsersTab : usersTab} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium pl-4 leading-4' : 'text-base text-text font-medium leading-4 pl-4'}>User Management</p>
                        </div>
                        )}
                    </NavLink>

                    {/* ADOPTION STATISTICS */}
                    <NavLink to="/admin/adoption-stats" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-5 w-12' src={ isActive ? activestats : stats} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium pl-4 leading-4' : 'text-base text-text font-medium leading-4 pl-4 '}>Adoption Statistics</p>
                        </div>
                        )}
                    </NavLink>

                    {/* REPORT MANAGEMENT */}
                    <NavLink to="/admin/report-management" className={({ isActive }) => isActive ? 'bg-primary relative flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-5 w-12' src={ isActive ? activeReport : report} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium pl-4 leading-4' : 'text-base text-text font-medium leading-4 pl-4'}>Report Management</p>
                            {/* NOTIFICATION */}
                            {hasUnseenReport && (
                                <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary left-10 top-2'/>
                            )}
                        </div>
                        )}
                    </NavLink>

                    {/* NEWS FEED */}
                    <NavLink to="/admin/news-feed" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-[19px] w-[47px]' src={ isActive ? activenewsfeed : newsfeed} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium pl-[17px] leading-4' : 'text-base text-text font-medium leading-4 pl-[17px]'}>News Feed</p>
                        </div>
                        )}
                    </NavLink>

                    {/* NOTIFICATION */}
                    <NavLink to="/admin/notification" onClick={() => setHasUnseenNotif(false)} className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-[19px] w-[47px]' src={ isActive ? activenotification : notification} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium pl-[17px] leading-4' : 'text-base text-text font-medium leading-4 pl-[17px]'}>Notification</p>
                            {/* NOTIFICATION */}
                            {hasUnseenNotif && (
                                <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary left-10 top-2'/>
                            )}
                        </div>
                        )}
                    </NavLink>

                    {/* CHAT */}
                    <NavLink to="/admin/chat" onClick={() => setHasUnseenMess(false)} className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-[19px] w-12' src={ isActive ? activechat : chat} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium leading-4 pl-4' : 'text-base text-text leading-4 font-medium pl-4'}>Chat</p>
                            {/* NOTIFICATION */}
                            {hasUnseenMess && (
                                <div className='absolute w-4 h-4 rounded-full border-2 border-secondary bg-primary left-10 top-2'/>
                            )}
                        </div>
                        )}
                    </NavLink>

                    {/* PROFILE */}
                    <NavLink to="/admin/profile" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-[17px] w-[3.3rem]' src={ isActive ? activeprofile : profile} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium leading-4 pl-[12px]' : 'text-base text-text leading-4 font-medium pl-[12px]'}>Profile</p>
                        </div>
                        )}
                    </NavLink>
                </div>
            </div>

           
        </>
    )
}

export default NavBar