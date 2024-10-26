import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close.svg'
import { useLocation, useNavigate } from 'react-router-dom';
import AppNavBar from './AppNavBar';
import Active from './Applications/Active';
import Accepted from './Applications/Accepted';
import Rejected from './Applications/Rejected';
import Closed from './Applications/Closed';
import Rehomed from './Applications/Rehomed';
import { AuthContext } from '../../General/AuthProvider';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

function AdoptionApplications({initialTab}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState(initialTab);
    const {user, userData} = useContext(AuthContext);
    const [otherApplications, setOtherApplications] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userImages, setUserImages] = useState({});
    const [petImages, setPetImages] = useState({});
    const [status, setStatus] = useState('pending');

    useEffect(() => {
      const path = location.pathname;
      if (path.includes('active')) setSelectedTab('Active');
      if (path.includes('accepted')) setSelectedTab('Accepted');
      if (path.includes('rejected')) setSelectedTab('Rejected');
      if (path.includes('closed')) setSelectedTab('Closed');
      if (path.includes('rehomed')) setSelectedTab('Rehomed');
    }, [location]);

    const renderComponent = () => {
      switch (selectedTab) {
          case 'Active':
              return <Active petImages={petImages} userImages={userImages} loading={loading} otherApplications={otherApplications} myApplications={myApplications} />;
          case 'Accepted':
              return <Accepted petImages={petImages} userImages={userImages} loading={loading} otherApplications={otherApplications} myApplications={myApplications} />;
          case 'Rejected':
              return <Rejected />;
          case 'Closed':
              return <Closed />;
          case 'Rehomed':
              return <Rehomed />;
          default:
              return <Active petImages={petImages} userImages={userImages} loading={loading} otherApplications={otherApplications} myApplications={myApplications} />;
      }
    }

    const handleTabClick = (tab) => {
      setSelectedTab(tab);
      navigate(`/dashboard/profile/applications/${tab.toLowerCase()}`);
    };

    useEffect(() => {
      switch (selectedTab) {
        case 'Active':
          setStatus('pending');
          break;
        case 'Accepted':
          setStatus('accepted');
          break;
        case 'Rejected':
          setStatus('rejected');
          break;
        case 'Closed':
          setStatus('closed');
          break;
        case 'Rehomed':
          setStatus('rehomed');
          break;
        default:
          setStatus('pending');
      }
    }, [selectedTab]);


    useEffect(() => {
      setLoading(true);
      const fetchApplications = async () => {
          try{
              const otherApplicationsRef = query(
                  collection(db, 'adoptionApplications'), 
                  where('petOwnerID' , '==', user.uid), 
                  where('status' , '==', status), 
                  orderBy('dateSubmitted', 'desc')
              );

              const myApplicationsRef = query(
                  collection(db, 'adoptionApplications'), 
                  where('adopterUserID' , '==', user.uid), 
                  where('status' , '==', status), 
                  orderBy('dateSubmitted', 'desc')
              );

              const [otherSnapshot, mySnapshot] = await Promise.all([
                  getDocs(otherApplicationsRef),
                  getDocs(myApplicationsRef)
              ]);

              const otherApplications = otherSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
              }));

              const myApplications = mySnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
              }));

              setOtherApplications(otherApplications);
              setMyApplications(myApplications);
          }
          catch(error){
              console.error(error);
          }
          finally{
              setLoading(false);
          }
      }
      fetchApplications();
  }, [user.uid, status]);

  useEffect(() => {
    const fetchImages = async () => {
      const userImagePromises = otherApplications.map(async (app) => {
        const userDoc = await getDoc(doc(db, 'users', app.adopterUserID));
        return { [app.id]: userDoc.data().profilePictureURL };
      });

      const petImagePromises = myApplications.map(async (app) => {
        const petDoc = await getDoc(doc(db, 'petsForAdoption', app.petID));
        return { [app.id]: petDoc.data().petImages[1] };
      });

      const userImagesArray = await Promise.all(userImagePromises);
      const petImagesArray = await Promise.all(petImagePromises);

      setUserImages(Object.assign({}, ...userImagesArray));
      setPetImages(Object.assign({}, ...petImagesArray));
    };

    fetchImages();
  }, [db, otherApplications, myApplications, status]);

  return (
      <div className='pt-[9.75rem] relative lg:pt-[5.75rem] lg:pl-48 xl:pl-[13.8rem] lg:pr-[13px] sm:px-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
          <div className='bg-secondary flex flex-col mb-3 pt-3 overflow-hidden flex-grow sm:pt-5 relative w-full shadow-custom h-full sm:rounded-md lg:rounded-lg'>
              <img onClick={() => navigate('/dashboard/profile')} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
              <p className='text-xl px-3 sm:px-5 font-semibold pt-1 sm:pt-0 sm:text-2xl'>Adoption Applications</p>

              {/* TABS */}
              <div className='pt-3 px-3 z-10 sm:px-5'>
                <div className='flex w-full justify-between sm:justify-start sm:gap-5 lg:gap-7 text-[#898989] font-semibold text-xs sm:text-base'>
                  {['Active', 'Accepted', 'Rejected', 'Closed', 'Rehomed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`pt-2 sm:px-3 lg:px-5 ${
                        selectedTab === tab ? 'text-primary border-b-[3px] border-primary' : 'border-b-[3px] border-transparent'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className='bg-[#E9E9E9] h-full flex-grow p-3 sm:p-5 -mt-[3px]'>
                  {renderComponent()}
              </div>

          </div>
      </div>
  )
}

export default AdoptionApplications