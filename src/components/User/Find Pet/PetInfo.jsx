import React, { useContext, useEffect, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import back from './assets/back.svg'
import unfavorite from '../../../assets/icons/unfavorite.svg'
import { AuthContext } from '../../General/AuthProvider';
import { confirm } from '../../General/CustomAlert';
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import EditPet from './EditPet';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useImageModal } from '../../General/ImageModalContext';
import FavoritePet from './FavoritePet';
import yes from './assets/yes.svg'
import no from './assets/no.svg'

function PetInfo() {
    const { user } = useContext(AuthContext);
    const { showModal } = useImageModal();
    const [isFaqsOpen, setIsFaqsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const col = path.includes('removed') ? 'removedPets' : 'petsForAdoption';


    
    const handleRemovePet = async (petID, petName) => {
        confirm(`Removing ${pet.petName}`, `Do you really want to remove ${pet.petName} from adoption?`).then(async (result) => {
            if(result.isConfirmed){
                try{
                    await deleteDoc(doc(db, 'petsForAdoption', petID));
                    notifySuccessOrange(`${petName} has been removed from adoption.`);
                    setTimeout(() => {
                        navigate(`/dashboard/find-pet`);
                    }, 2500);
                }
                catch(error){
                    console.error("Error removing pet: ", error);
                    notifyErrorOrange('There was an issue removing the pet.');
                }
            }
        })
    }

    const handleFaqsClick = () => {
        setIsFaqsOpen(!isFaqsOpen);
    }

    const handleEditPetClick = () => {
        setIsEditOpen(!isEditOpen);
    }

    const { petID } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const fetchPetData = async () => {
          try {
            const petDocRef = doc(db, col, petID);  // Assume 'pets' is your collection
            const petDocSnap = await getDoc(petDocRef);
    
            if (petDocSnap.exists()) {
              setPet(petDocSnap.data());  // Store pet data in state
            } else {
              console.log('No such document!');
            }
          } catch (error) {
            console.error('Error fetching pet data:', error);
          } finally {
            setLoading(false);
          }
        };
    
        if (petID) {
          fetchPetData();
        }
      }, [petID]);
      

      useEffect(() => {
        if (user && petID) {
            const checkApplicationStatus = async () => {
                try {
                    // Create a reference to the 'adoptionApplications' collection
                    const adoptionApplicationsRef = collection(db, 'adoptionApplications');

                    // Create a query to find the application with the current user and petID
                    const q = query(
                        adoptionApplicationsRef,
                        where('adopterUserID', '==', user.uid),
                        where('petID', '==', petID)
                    );

                    // Execute the query
                    const querySnapshot = await getDocs(q);

                    // Check if there are any matching documents
                    if (!querySnapshot.empty) {
                        setIsPending(true);  // User has already applied
                    }
                    else {
                        setIsPending(false);
                    }
                    console.log(querySnapshot)
                } catch (error) {
                    console.error("Error checking application status: ", error);
                }
            };

            checkApplicationStatus();
        }
    }, [user, petID]);

    if (loading) {
    return <div>Loading...</div>;
    }


    return (
        <div className='pt-[8.75rem] lg:pt-[4.75rem] lg:pl-48 xl:ml-7 xl:pl-52 lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className={ !isFaqsOpen && !isEditOpen ? 'w-full flex flex-col lg:flex-row gap-3 h-full lg:pb-4 mt-4' : 'hidden'}>
                <div className='relative px-4 pb-5 bg-secondary mx-auto sm:rounded-lg shadow-custom w-full sm:w-[90%] lg:w-full md:w-[80%] h-full'>
                    <img onClick={() => navigate(`/dashboard/find-pet`)} className='absolute border-2 lg:hidden border-secondary hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                    
                    {/* PICTURES */}
                    <div className='max-w-[38rem] pb-7 mx-auto flex pt-14 lg:pt-7 gap-3 sm:gap-5 xl:gap-7'>
                        <div className='bg-[#BCBCBC] overflow-hidden rounded-md h-44 sm:h-56 w-full flex justify-center'>
                            <img className='w-full object-cover cursor-pointer' src={pet.petImages[0]} onClick={() => showModal(pet.petImages[0])} alt="" />
                        </div>
                        <div className='bg-[#BCBCBC] overflow-hidden rounded-md h-44 sm:h-56 w-full flex justify-center'>
                            <img className='w-full object-cover cursor-pointer' src={pet.petImages[1]} onClick={() => showModal(pet.petImages[1])} alt="" />
                        </div>
                        <div className='bg-[#BCBCBC] overflow-hidden rounded-md h-44 sm:h-56 w-full flex justify-center'>
                            <img className='w-full object-cover cursor-pointer' src={pet.petImages[2]} onClick={() => showModal(pet.petImages[2])} alt="" />
                        </div>
                    </div>

                    {/* INFORMATION */}
                    <div className='w-full relative bg-[#E9E9E9] p-3 rounded-md sm:px-5'>
                        <div className='absolute top-3 right-3 sm:top-4 sm:right-5' onClick={(e) => {e.stopPropagation();}}>
                            <FavoritePet petOwner={pet.userID} petID={petID} />
                        </div>
                        <div className='my-2'>
                            <p className='text-3xl font-medium pb-1'>{pet.petName}</p> 
                            {/* <p className='font-medium py-2 text-sm text-[#5D5D5D] flex items-center leading-3'>{pet.petType} <span className='h-1 w-1 mx-2 bg-text rounded-full'></span> {pet.location}</p>    */}
                            <p className='font-medium py-2 text-sm text-[#5D5D5D] flex items-center'>{pet.petType} <span className='h-1 w-1 mx-2 bg-text rounded-full'></span> {pet.age} <span className='h-1 w-1 mx-2 bg-text rounded-full'></span> {pet.gender} <span className='h-1 w-1 mx-2 bg-text rounded-full'></span> {pet.size}</p>   

                        </div>
                        <div className='w-full'>
                            <div className='h-[1px] w-full relative bg-text'></div>
                        </div>
                        <div className='my-2'> 
                            {/* <p className='font-medium py-2 text-sm text-[#5D5D5D] flex items-center'>{pet.age} <span className='h-1 w-1 mx-2 bg-text rounded-full'></span> {pet.gender} <span className='h-1 w-1 mx-2 bg-text rounded-full'></span> {pet.size}</p>    */}
                            <p className='font-medium py-2 text-sm text-[#5D5D5D] flex items-center leading-3'>{pet.barangay} {pet.municipality}, Cavite</p>
                        </div>
                        <div className='w-full'>
                            <div className='h-[1px] w-full relative bg-text'></div>
                        </div>
                        <div className='my-2'> 
                            <p className='text-2xl font-medium pt-2'>About</p> 
                            <p className='whitespace-pre-wrap pt-2'>{pet.aboutPet}</p>
                        </div>
                        <div className='w-full'>
                            <div className='h-[1px] w-full relative bg-text'></div>
                        </div>
                        <div className='my-2'> 
                            <p className='text-2xl font-medium pt-2'>RAQs</p> 
                            <p className='whitespace-pre-wrap font-medium pt-2'>Is the pet for free?</p>
                            <p className={`${pet.isItFree === 'Yes' ? 'bg-[#8cbd31] px-2 gap-1 inline-flex justify-center py-1 rounded-md text-white items-center font-medium' : 'bg-primary px-2 gap-1 inline-flex justify-center items-center py-1 rounded-md text-white font-medium'} whitespace-pre-wrap`}><img className={`${pet.isItFree === 'Yes' ? 'block' : 'hidden'} w-4 h-4`} src={yes} /> <img className={`${pet.isItFree === 'No' ? 'block' : 'hidden'} w-3 h-3`} src={no} /> {pet.isItFree}</p>
                            <p className='whitespace-pre-wrap font-medium pt-2'>Is the pet good with kids?</p>
                            <p className={`${pet.goodWithKids === 'Yes' ? 'bg-[#8cbd31] px-2 gap-1 inline-flex justify-center py-1 rounded-md text-white items-center font-medium' : 'bg-primary px-2 gap-1 inline-flex justify-center items-center py-1 rounded-md text-white font-medium'} whitespace-pre-wrap`}><img className={`${pet.goodWithKids === 'Yes' ? 'block' : 'hidden'} w-4 h-4`} src={yes} /> <img className={`${pet.goodWithKids === 'No' ? 'block' : 'hidden'} w-3 h-3`} src={no} /> {pet.goodWithKids}</p>
                            <p className='whitespace-pre-wrap font-medium pt-2'>Is the pet good with other animals?</p>
                            <p className={`${pet.goodWithAnimals === 'Yes' ? 'bg-[#8cbd31] px-2 gap-1 inline-flex justify-center py-1 rounded-md text-white items-center font-medium' : 'bg-primary px-2 gap-1 inline-flex justify-center items-center py-1 rounded-md text-white font-medium'} whitespace-pre-wrap`}><img className={`${pet.goodWithAnimals === 'Yes' ? 'block' : 'hidden'} w-4 h-4`} src={yes} /> <img className={`${pet.goodWithAnimals === 'No' ? 'block' : 'hidden'} w-3 h-3`} src={no} /> {pet.goodWithAnimals}</p>
                            <p className='whitespace-pre-wrap font-medium pt-2'>Is the pet house-trained?</p>
                            <p className={`${pet.houseTrained === 'Yes' ? 'bg-[#8cbd31] px-2 gap-1 inline-flex justify-center py-1 rounded-md text-white items-center font-medium' : 'bg-primary px-2 gap-1 inline-flex justify-center items-center py-1 rounded-md text-white font-medium'} whitespace-pre-wrap`}><img className={`${pet.houseTrained === 'Yes' ? 'block' : 'hidden'} w-4 h-4`} src={yes} /> <img className={`${pet.houseTrained === 'No' ? 'block' : 'hidden'} w-3 h-3`} src={no} /> {pet.houseTrained}</p>
                            
                        </div>
                    </div>
                </div>

                {/* INTERESTED */}
                <div>
                    <div className={ user.uid != pet.userID ? 'w-[90%] sm:w-96 self-start lg:my-0 lg:rounded-lg shrink-0 lg:w-60 2xl:w-72 mx-auto bg-primary mt-4 mb-7 text-white shadow-custom p-3 rounded-md' : 'hidden'}>
                        <p className='text-lg text-center py-4'>Considering {pet.petName} for adoption?</p>
                        <div className='w-[90%] mx-auto py-3'>
                            <button onClick={() => navigate(`/dashboard/find-pet/adoption/${pet.petID}`)} disabled={isPending} className={`w-full text-sm border-2 border-secondary duration-200 bg-secondary font-semibold text-primary rounded-full py-3 ${isPending ? 'cursor-default ' : 'hover:border-[#c74343] hover:bg-[#c74343] hover:text-white'} `}>{isPending ? 'PENDING ADOPTION' : 'START YOUR INQUIRY'}</button>
                        </div>
                    </div> 
                    
                    {/* PET OWNER ACTIONS */}
                    <div className={ col === 'removedPets' ? 'hidden' : user.uid === pet.userID ? 'w-[70%] sm:w-96 self-start lg:my-0 lg:rounded-lg shrink-0 lg:w-60 2xl:w-72 mx-auto bg-secondary mt-4 mb-7 text-text shadow-custom p-3 rounded-md' : 'hidden'}>
                        <p className='text-xl font-medium pb-3'>Actions</p>
                        <div className='lg:w-full w-[90%] mx-auto'>
                            <button onClick={handleEditPetClick} className='w-full text-sm hover:bg-[#82ac35] duration-200 bg-[#8FBB3E] font-semibold text-white rounded-lg py-3 mb-2'>EDIT PET</button>
                            <button onClick={() => handleRemovePet(pet.petID, pet.petName)} className='w-full text-sm hover:bg-[#ca4444] duration-200 bg-[#D25A5A] font-semibold text-white rounded-lg py-3'>REMOVE PET</button>
                        </div>
                    </div> 

                    {/* REASON OF REMOVAL */}
                    <div className={ col === 'removedPets' ? 'w-[70%] sm:w-96 self-start lg:my-0 lg:rounded-lg shrink-0 lg:w-60 2xl:w-72 mx-auto bg-primary mt-4 mb-7 text-center text-white shadow-custom p-3 rounded-md' : 'hidden'}>
                        <p className='text-xl font-medium pb-3'>Reason of removal</p>
                        <div className='lg:w-full w-[90%] bg-secondary rounded-md p-2 text-start text-text mx-auto'>
                            <p>{pet.reasonRemoved}</p>
                        </div>
                    </div> 

                    <div onClick={() => col === 'petsForAdoption' ? navigate('/dashboard/find-pet') : navigate('/dashboard/notification')} className='w-40 hidden lg:flex cursor-pointer hover:bg-[#f0f0f0] duration-150 bg-secondary rounded-lg shadow-custom mt-3 py-2 justify-center items-center font-semibold'>
                        <img className='w-9 mr-3' src={back} alt="" />
                        <p>Go back</p>
                    </div>
                </div>
            </div>

            {/* EDIT PET */}
            <div className={isEditOpen ? 'block' : 'hidden'}>
                <EditPet pet={pet} closeEdit={handleEditPetClick} />
            </div>
        </div>
        
    )
}

export default PetInfo