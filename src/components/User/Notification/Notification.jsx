import React, { useContext, useEffect, useState } from 'react'
import markAsRead from './assets/read.svg'
import readIcon from './assets/readIcon.svg'
import { AuthContext } from '../../General/AuthProvider'
import { collection, doc, getDocs, orderBy, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import like from './assets/like-type.svg'
import comment from './assets/comment-type.svg'
import application from './assets/application.svg'
import rehomed from './assets/rehomed.svg'
import { useNavigate } from 'react-router-dom';
import removed from './assets/removed.svg'
import closed from './assets/closed.svg'
import accepted from './assets/accepted.svg'

function Notification() {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [marOpen, setMarOpen] = useState(false);
    const [isUnreadSelected, setIsUnreadSelected] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // FETCHING NOTIFICATIONS
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true)
                const notificationsRef = query(
                    collection(db, 'notifications'),
                    where('userId', '==', user.uid),
                    orderBy('timestamp', 'desc')
                );
    
                const snapshot = await getDocs(notificationsRef);
                const userNotifications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
    
                setNotifications(userNotifications);
            } 
            catch (error) {
                console.error('Error: ', error);
            }
            finally{
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user.uid]);

    // Handle toggling between "All" and "Unread" tabs
    const handleTabClick = (unreadSelected) => {
        setIsUnreadSelected(unreadSelected);
    };

    const markAllAsRead = async (userId) => {
        try {
            // Create a batch instance
            const batch = writeBatch(db);
    
            // Fetch all unread notifications for the current user
            const notificationsRef = query(
                collection(db, 'notifications'),
                where('userId', '==', userId),
                where('isRead', '==', false)
            );
    
            const snapshot = await getDocs(notificationsRef);
    
            if (snapshot.empty) {
                console.log("No unread notifications to mark as read.");
                setMarOpen(false);
                return;
            }
    
            // Loop through each unread notification and update it to 'isRead: true'
            snapshot.docs.forEach((doc) => {
                const notificationRef = doc.ref; // Get the document reference
                batch.update(notificationRef, { isRead: true }); // Update the isRead field
            });
    
            // Commit the batch update
            await batch.commit();
            console.log("All notifications marked as read!");
            setMarOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Error marking notifications as read: ", error);
        }
    };

    // Filter notifications if "Unread" tab is selected
    const displayedNotifications = isUnreadSelected ? notifications.filter(notification => !notification.isRead) : notifications;

    const getTimeDifference = (timestamp) => {
        const now = new Date();
        const timeDiff = Math.abs(now - timestamp.toDate()); // Convert Firestore timestamp to JS Date
      
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
      
        if (seconds < 10) {
          return 'Just now';
        } else if (years > 0) {
          return years === 1 ? '1y ago' : `${years}y ago`;
        } else if (months > 0) {
          return months === 1 ? '1m ago' : `${months}m ago`;
        } else if (days > 0) {
          return days === 1 ? '1d ago' : `${days}d ago`;
        } else if (hours > 0) {
          return hours === 1 ? '1h ago' : `${hours}h ago`;
        } else if (minutes > 0) {
          return minutes === 1 ? '1min ago' : `${minutes}min ago`;
        } else {
          return `${seconds}s ago`;
        }
      };

    const openMarkAsRead = () => {
        setMarOpen(!marOpen);
    }

    const readNotif = async (postID, notificationID, notifType, applicationID, accepted, petID) => {
        const notificationRef = doc(db, 'notifications', notificationID);

        await updateDoc(notificationRef, {
            isRead: true,
        })

        if(notifType === 'like'){
            navigate(`post/${postID}`, {state: {notifType}});
        }
        else if(notifType === 'comment'){
            navigate(`post/${postID}`, {state: {notifType}});
        }
        else if(notifType === 'adoption'){
            if(accepted){
                navigate(`/dashboard/profile/applications/accepted/${applicationID}`, {state: {notifType}});
            }
            else{
                navigate(`/dashboard/profile/applications/application/${applicationID}`, {state: {notifType}});
            }
        }
        else if(notifType === 'rehome'){
            navigate(`/dashboard/profile/applications/rehomed/${applicationID}`, {state: {notifType}});
        }
        else if(notifType === 'rejected'){
            navigate(`/dashboard/profile/applications/rejected/application/${applicationID}`, {state: {notifType}});
        }
        else if(notifType === 'closed'){
            navigate(`/dashboard/profile/applications/closed/application/${applicationID}`, {state: {notifType}});
        }
        else if(notifType === 'removed'){
            navigate(`/dashboard/find-pet/removed/${petID}`, {state: {notifType}});
        }
    }

    return (
        <div className='pt-36 relative lg:pt-20 lg:pl-48 xl:pl-[13.8rem] lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className='flex mt-3 lg:mt-3 bg-secondary sm:mx-auto lg:mx-0 flex-grow mb-3 w-full text-text sm:w-[97%] lg:w-full sm:rounded-md lg:rounded-lg shadow-custom'>
                <div className='p-5 md:px-7 w-full'>
                    <div className='flex relative justify-between'>
                        <h1 className='text-2xl font-semibold'>Notification</h1>
                        <img onClick={openMarkAsRead} className='w-8 p-1 rounded-full hover:bg-[#d8d8d8] cursor-pointer duration-150' src={markAsRead} alt="" />
                        <div style={{display: marOpen ? 'flex' : 'none'}} onClick={() => markAllAsRead(user.uid)} className='absolute hover:bg-[#e6e6e6] duration-150 top-9 gap-3 rounded-lg items-center right-0 p-5 z-10 bg-white cursor-pointer shadow-custom'>
                            <img src={readIcon} alt="" />
                            <p className='font-medium'>Mark all as read</p>
                        </div>
                    </div>
                    <div className='flex gap-1 my-3'>
                        <p onClick={() => handleTabClick(false)} className={`cursor-pointer text-sm font-medium py-1 px-3 ${!isUnreadSelected ? 'bg-primary rounded-md text-white' : ''}`}>All</p>
                        <p onClick={() => handleTabClick(true)} className={`cursor-pointer text-sm font-medium py-1 px-3 ${isUnreadSelected ? 'bg-primary rounded-md text-white' : ''}`}>Unread</p>
                    </div>

                    {/* NOTIFICATION */}
                    <div className='mt-4 flex flex-col gap-3'>
                        {/* Check if there are no notifications */}
                        {loading ? (
                            <div className="text-center text-gray-500 font-medium py-5 bg-[#E9E9E9] rounded-md">Loading...</div>
                        ) : 
                        displayedNotifications.length === 0 ? (
                            <div className="text-center text-gray-500 font-medium py-5 bg-[#E9E9E9] rounded-md">No Notification</div>
                        ) : (
                            displayedNotifications.map((notification) => (
                                <div key={notification.id} onClick={() => readNotif(notification.postID, notification.id, notification.type, notification.applicationID, notification.accepted, notification.petID)} className='bg-[#E9E9E9] relative items-center flex hover:bg-[#d3d3d3] duration-150 cursor-pointer w-full p-3 rounded-lg'>
                                    <div className='relative w-12 h-12 shrink-0'>
                                        <img className='w-full h-full object-cover rounded-full' src={notification.image} alt="" />
                                        <img className={`${notification.type === 'like' || notification.type === 'comment' ? 'block' : 'hidden'} w-6 h-6 absolute rounded-full bottom-0 -right-1`} src={notification.type == 'like' ? like : notification.type == 'comment' ? comment : application} alt="" />
                                        <img className={`${notification.type === 'rehome' ? 'block' : 'hidden'} w-6 h-6 absolute rounded-full bottom-0 -right-1`} src={rehomed} alt="" />
                                        <img className={`${notification.type === 'removed' ? 'block' : 'hidden'} w-6 h-6 absolute rounded-full bottom-0 -right-1`} src={removed} alt="" />
                                        <img className={`${notification.type === 'closed' || notification.type === 'rejected' ? 'block' : 'hidden'} w-6 h-6 absolute rounded-full bottom-0 -right-1`} src={closed} alt="" />
                                        <img className={`${notification.type === 'adoption' ? 'block' : 'hidden'} w-6 h-6 absolute rounded-full bottom-0 -right-1`} src={application} alt="" />
                                    </div>
                                    <div className={`pl-3 sm:pl-4 flex flex-col justify-center ${notification.isRead ? 'pr-0' : 'pr-7'}`}>
                                        <p className='font-semibold text-sm sm:text-base leading-4'>{notification.senderName} <span className='font-normal'>{notification.content}</span></p>
                                        <p className='text-xs sm:text-[13px] text-[#8a8a8a] mt-1 sm:mt-0'>{getTimeDifference(notification.timestamp)}</p>
                                    </div>
                                    <div style={{display: !notification.isRead ? 'flex' : 'none'}} className='absolute right-3 sm:right-5 top-0 h-full items-center'>
                                        <div className='w-4 h-4 bg-primary rounded-full' />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Notification