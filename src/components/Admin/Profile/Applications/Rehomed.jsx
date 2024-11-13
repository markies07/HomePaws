import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../General/AuthProvider';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import rehomed from '../assets/rehomed.svg';
import { useNavigate } from 'react-router-dom';

function Rehomed() {
  const [rehomedPets, setRehomedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { user } = useContext(AuthContext);
  const [adopterProfiles, setAdopterProfiles] = useState({});
  const [adopterNames, setAdopterNames] = useState({});  // Changed to plural for consistency
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
        setAdopterNames(prev => ({          // Changed from setAdopterName
          ...prev,
          [adopterUserID]: userData.fullName,
        }));
      }
    } catch (error) {
      console.error('Error fetching adopter profile:', error);
    }
  };

  useEffect(() => {
    const fetchRehomedPets = async () => {
      setLoading(true);
      try {
        const rehomedPetsRef = collection(db, 'rehomedPets');
        
        // Query where the user is the adopter
        const adopterQuery = query(
          rehomedPetsRef,
          where('adopterUserID', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
  
        // Query where the user is the previous owner
        const ownerQuery = query(
          rehomedPetsRef,
          where('ownerUserID', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
  
        const [adopterSnapshot, ownerSnapshot] = await Promise.all([
          getDocs(adopterQuery),
          getDocs(ownerQuery)
        ]);
  
        const adopterPets = adopterSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        const ownerPets = ownerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch profiles for all unique adopters
        const allPets = [...adopterPets, ...ownerPets];
        const uniqueAdopters = [...new Set(allPets.map(pet => pet.adopterUserID))];
        await Promise.all(uniqueAdopters.map(adopterId => fetchAdopterProfile(adopterId)));
  
        setRehomedPets(allPets);
      } catch (error) {
        console.error('Error fetching rehomed pets: ', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRehomedPets();
  }, [user.uid]);

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

  const filteredPets = rehomedPets.filter((pet) => {
    if (filter === 'Adoptee') {
        return pet.adopterUserID === user.uid;
    }
    if (filter === 'Adopter') {
      return pet.ownerUserID === user.uid;
    }
    return true;
  });
  
  const renderRehomedPet = (pet) => {
    const isAdopter = pet.ownerUserID === user.uid;
    const displayName = pet.adopterUserID === user.uid 
      ? 'You' 
      : (adopterNames[pet.adopterUserID] || 'Unknown User');

    return (
      <div 
        onClick={() => navigate(`/admin/profile/applications/rehomed/${pet.rehomedID}`)} 
        key={pet.rehomedID} 
        className='bg-secondary relative items-center flex shadow-custom hover:bg-[#f1f1f1] duration-150 cursor-pointer w-full p-3 rounded-lg'
      >
        <div className='relative w-12 h-12 shrink-0'>
          <img className='w-full h-full object-cover rounded-full' src={pet.petDetails.petImages[0]} alt={pet.petDetails.petName} />
          <img className='w-7 h-7 absolute rounded-full bottom-0 -right-1' src={rehomed} alt="" />
        </div>
        <div className='pl-3 flex flex-col justify-center'>
          <p className='text-sm sm:text-base leading-4'>
            <span className='font-semibold'>{displayName}</span> adopted {pet.petDetails.petName}
          </p>
          <p className='text-xs sm:text-[13px] text-[#8a8a8a] mt-1 sm:mt-0'>
            {getTimeDifference(pet.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <p className='text-lg font-semibold pt-1 sm:pt-0 sm:text-xl'>Rehomed Pets</p>

      <div className='flex mb-3 sm:mb-4 mt-2 gap-1'>
        {['All', 'Adoptee', 'Adopter'].map(buttonText => (
          <button
            key={buttonText}
            onClick={() => setFilter(buttonText)}
            className={`text-xs sm:text-sm font-medium px-2 sm:px-3 cursor-pointer py-1 ${filter === buttonText ? 'bg-primary rounded-md text-white' : ''}`}>
            {buttonText}
          </button>
        ))}
      </div>

      <div className='flex flex-col gap-2'>
        {loading ? (
          <div className="text-center bg-secondary relative items-center shadow-custom w-full p-5 rounded-lg font-medium">
            Loading...
          </div>
        ) : (
          filteredPets.length > 0 ? (
            filteredPets.map(renderRehomedPet)
          ) : (
            <div className="text-center bg-secondary relative items-center shadow-custom w-full p-5 rounded-lg font-medium">
              No Rehomed Pets Found
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Rehomed;