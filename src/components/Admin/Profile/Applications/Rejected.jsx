import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../General/AuthProvider'
import { collection, doc, getDocs, orderBy, query, updateDoc, where, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import rejected from '../assets/rejected.svg';

function Rejected() {
  const [loading, setLoading] = useState(true);
  const {user, userData} = useContext(AuthContext);
  const [adopterProfiles, setAdopterProfiles] = useState({});
  const [adopterName, setAdopterName] = useState({});
  const [otherApplications, setOtherApplications] = useState([]);
  const navigate = useNavigate();

  const fetchAdopterProfile = async (adopterUserID) => {
    try {
      const userRef = doc(db, 'users', adopterUserID);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setAdopterProfiles(prev => ({
          ...prev,
          [adopterUserID]: userData.profilePictureURL || '',
        }));
        setAdopterName(prev => ({
          ...prev,
          [adopterUserID]: userData.fullName,
        }));
      }
    } catch (error) {
      console.error('Error fetching adopter profile:', error);
    }
  };

  const fetchRejectedApplications = async () => {
    try{
      const otherApplicationsRef = query(
          collection(db, 'rejectedApplications'), 
          where('petOwnerID' , '==', user.uid), 
          orderBy('rejectedAt', 'desc')
      );

      const otherSnapshot = await getDocs(otherApplicationsRef);
  
      const otherApplications = otherSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      await Promise.all(otherApplications.map(app => fetchAdopterProfile(app.adopterUserID)));
  
      setOtherApplications(otherApplications);
    }
    catch(error){
        console.error(error);
    }
    finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchRejectedApplications();
  }, []);

  const getTimeDifference = (timestamp) => {
      const now = new Date();
      const timeDiff = Math.abs(now - timestamp.toDate());
    
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

  const renderApplication = (application, isMyApplication) => (
      <div key={application.id} onClick={() => navigate(`application/${application.applicationID}`)} className='bg-secondary relative items-center flex shadow-custom hover:bg-[#f1f1f1] duration-150 cursor-pointer w-full p-3 rounded-lg'>
        <div className='relative w-12 h-12 shrink-0'>
          <img 
            className='w-full h-full bg-text object-cover rounded-full' 
            src={isMyApplication ? application.petImage : (adopterProfiles[application.adopterUserID])} 
            alt="" 
          />
          <img className='w-7 h-7 absolute rounded-full bottom-0 -right-1' src={rejected} alt="" />
        </div>
        <div className={`pl-3 flex flex-col justify-center`}>
          <p className={`${application.read === false && application.adopterUserID !== user.uid ? 'pr-7 sm:pr-10' : ''} font-semibold text-sm sm:text-base leading-4`}>
            {isMyApplication ? 'Your' : (adopterName[application.adopterUserID])+'\'s'} <span className='font-normal'>adoption application for {application.petName} has been <span className='font-semibold text-[#D25A5A]'>rejected</span>.</span>
          </p>
          <p className='text-xs sm:text-[13px] text-[#8a8a8a] mt-1 sm:mt-0'>{getTimeDifference(application.rejectedAt)}</p>
        </div>
      </div>
  );

  return (
      <div>
          <p className='text-lg font-semibold pt-1 sm:pt-0 sm:text-xl'>Rejected Applications</p>

          <div className='flex flex-col gap-2 mt-3'>
              {loading ? (
                  <div className="text-center bg-secondary relative items-center shadow-custom w-full p-5 rounded-lg font-medium">Loading...</div>
              ) : 
              otherApplications.length > 0 ? (
                  <div className='flex flex-col gap-2'>
                      {otherApplications.map(app => renderApplication(app, false))}
                  </div>
              ) : (
                  <div className="text-center bg-secondary relative items-center shadow-custom w-full p-5 rounded-lg font-medium">No Rejected Application Found</div>
              )}
          </div>
      </div>
  )
}

export default Rejected