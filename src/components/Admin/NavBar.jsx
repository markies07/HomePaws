import React from 'react'
import { NavLink } from 'react-router-dom'
import findpet from './assets/findpet-icon.svg'
import activefindpet from './assets/active-findpet.svg'
import usersTab from './assets/users.svg'
import activeaUsersTab from './assets/active-users.svg'
import adoption from './assets/adoption.svg'
import activeaAdoption from './assets/active-adoption.svg'
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

function NavBar() {
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

                {/* ADOPTION MANAGEMENT */}
                <NavLink to="/admin/adoption-management" className={({ isActive }) => isActive ? 'py-2 relative bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-8 h-7' src={isActive ? activeaAdoption : adoption} alt="Paw Icon" />
                )}
                </NavLink>

                {/* REPORT MANAGEMENT */}
                <NavLink to="/admin/report-management" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-8 h-7' src={isActive ? activeReport : report} alt="Paw Icon" />
                )}
                </NavLink>

                {/* NOTIFICATION */}
                <NavLink to="/admin/notification" className={({ isActive }) => isActive ? 'py-2 relative bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-8 h-7' src={isActive ? activenotification : notification} alt="Paw Icon" />
                )}
                </NavLink>

                {/* NEWS FEED */}
                <NavLink to="/admin/news-feed" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-8 h-7' src={isActive ? activenewsfeed : newsfeed} alt="Paw Icon" />
                )}
                </NavLink>

                {/* CHAT */}
                <NavLink to="/admin/chat" className={({ isActive }) => isActive ? 'py-2 bg-primary cursor-pointer duration-150 px-2 rounded-md' : 'py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-2 rounded-md'}>
                {({isActive}) => (
                    <img className='w-9 h-7' src={isActive ? activechat : chat} alt="Paw Icon" />
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

                    {/* ADOPTION MANAGEMENT */}
                    <NavLink to="/admin/adoption-management" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-5 w-12' src={ isActive ? activeaAdoption : adoption} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium pl-4 leading-4' : 'text-base text-text font-medium leading-4 pl-4 '}>Adoption Management</p>
                        </div>
                        )}
                    </NavLink>

                    {/* REPORT MANAGEMENT */}
                    <NavLink to="/admin/report-management" className={({ isActive }) => isActive ? 'bg-primary relative flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-5 w-12' src={ isActive ? activeReport : report} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium pl-4 leading-4' : 'text-base text-text font-medium leading-4 pl-4'}>Report Management</p>
                        </div>
                        )}
                    </NavLink>

                    {/* NOTIFICATION */}
                    <NavLink to="/admin/notification" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-[19px] w-[47px]' src={ isActive ? activenotification : notification} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium pl-[17px] leading-4' : 'text-base text-text font-medium leading-4 pl-[17px]'}>Notification</p>
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

                    {/* CHAT */}
                    <NavLink to="/admin/chat" className={({ isActive }) => isActive ? 'bg-primary flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-primary shrink-0' : 'flex duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 hover:bg-[#D9D9D9] shrink-0'}>
                        {({isActive}) => (
                        <div className='flex items-center relative'>
                            <img className='pl-[19px] w-12' src={ isActive ? activechat : chat} alt="" />
                            <p className={isActive ? 'text-base text-white font-medium leading-4 pl-4' : 'text-base text-text leading-4 font-medium pl-4'}>Chat</p>
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