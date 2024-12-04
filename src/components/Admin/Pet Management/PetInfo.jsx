import React, { useContext, useEffect, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import back from './assets/back.svg'
import { AuthContext } from '../../General/AuthProvider';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useImageModal } from '../../General/ImageModalContext';
import pic from './assets/user.svg';
import contact from './assets/contact.svg';
import RemovePet from './RemovePet';
import EditPet from './EditPet';
import { confirm } from '../../General/CustomAlert';
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import yes from './assets/yes.svg'
import no from './assets/no.svg'

function PetInfo() {
    const { user } = useContext(AuthContext);
    const { showModal } = useImageModal();
    const location = useLocation();
    const [removePetOpen, setRemovePetOpen] = useState(false);
    const navigate = useNavigate();
    const path = location.pathname;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const col = path.includes('removed') ? 'removedPets' : 'petsForAdoption';


    const { petID } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    
                } catch (error) {
                    console.error("Error checking application status: ", error);
                }
            };

            checkApplicationStatus();
        }
    }, [user, petID]);


    const handleRemovePet = async (petID, petName) => {
        confirm(`Removing ${pet.petName}`, `Do you really want to remove ${pet.petName} from adoption?`).then(async (result) => {
            if(result.isConfirmed){
                try{
                    await deleteDoc(doc(db, 'petsForAdoption', petID));
                    notifySuccessOrange(`${petName} has been removed from adoption.`);
                    setTimeout(() => {
                        navigate(`/admin/pet-management`);
                    }, 1000);
                }
                catch(error){
                    console.error("Error removing pet: ", error);
                    notifyErrorOrange('There was an issue removing the pet.');
                }
            }
        })
    }

    // MESSAGING EACH OTHER
    const handleStartChat = async (receiver) => {

        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', receiver && user.uid)
        );

        const querySnapshot = await getDocs(q);
        let existingChat = null;

        querySnapshot.forEach(doc => {
            const participants = doc.data().participants;
            if(participants.includes(receiver)) {
                existingChat = doc.id;
            }
        });

        let chatID;
        if(existingChat){
            chatID = existingChat;
        }
        else{
            const newChatRef = await addDoc(collection(db, 'chats'), {
                participants: [user.uid, receiver],
            })
            chatID = newChatRef.id;
        }
        navigate(`/admin/chat/convo/${chatID}`);
    }

    const toggleRemovePet = () => {
        setRemovePetOpen(!removePetOpen);
    }

    const handleEditPetClick = () => {
        setIsEditOpen(!isEditOpen);
    }

    if (loading) {
    return <div>Loading...</div>;
    }


    return (
        <div className='pt-[8.75rem] lg:pt-[4.75rem] lg:pl-56 lg:ml-3 xl:pl-56 lg:pr-3 min-h-screen flex flex-col font-poppins text-text'>
            <div className={ !isEditOpen ? 'w-full flex flex-col lg:flex-row gap-3 h-full lg:pb-4 mt-4' : 'hidden'}>
                <div className='relative px-4 pb-5 bg-secondary mx-auto sm:rounded-lg shadow-custom w-full sm:w-[90%] lg:w-full md:w-[80%] h-full'>
                    <img onClick={() => navigate(`/admin/pet-management`)} className='absolute border-2 lg:hidden border-secondary hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                    
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

                {/* OWNNER'S INFORMATION */}
                <div>
                    <div className='w-[90%] sm:w-96 self-start lg:my-0 lg:rounded-lg shrink-0 lg:w-60 2xl:w-72 mx-auto bg-secondary mb-3 text-text shadow-custom py-3 px-5 rounded-md'>
                        <p className='font-semibold text-lg text-center py-2 pb-5'>Owner's Information</p>
                        <div className='flex flex-col gap-2'>
                            <p className='flex items-center font-semibold gap-3'><img className='w-6' src={pic} alt="" />Full Name</p>
                            <p>{pet.ownerFirstName} {pet.ownerMI} {pet.ownerLastName}</p>
                        </div>
                        <div className='w-full my-3'>
                            <div className='h-[1px] w-full relative bg-[#a1a1a1]'></div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='flex items-center font-semibold gap-3'><img className='w-6' src={contact} alt="" />Contact Number</p>
                            <p>{pet.contactNumber}</p>
                        </div>
                        <div className='w-full my-3 mb-4'>
                            <div className='h-[1px] w-full relative bg-[#a1a1a1]'></div>
                        </div>

                        {/* OTHER USERS */}
                        <div className={`${pet.userID === user.uid ? 'hidden' : 'flex'} flex-col gap-2`}>
                            <button onClick={() => handleStartChat(pet.userID)} className='bg-[#8FBB3E] text-sm w-full py-2 text-white rounded-md hover:bg-[#82aa38] duration-150 font-medium'>Message Owner</button>
                            <button onClick={toggleRemovePet} className='bg-primary text-sm w-full py-2 text-white rounded-md hover:bg-[#e44d1f] duration-150 font-medium'>Remove Pet</button>
                        </div>

                        {/* PET OWNER */}
                        <div className={`${pet.userID === user.uid ? 'flex' : 'hidden'} flex-col gap-2`}>
                            <button onClick={handleEditPetClick} className='bg-[#8FBB3E] text-sm w-full py-2 text-white rounded-md hover:bg-[#82aa38] duration-150 font-medium'>Edit Pet</button>
                            <button onClick={() => handleRemovePet(pet.petID, pet.petName)} className='bg-primary text-sm w-full py-2 text-white rounded-md hover:bg-[#e44d1f] duration-150 font-medium'>Remove Pet</button>
                        </div>

                    </div> 
                    

                    <div onClick={() => navigate('/admin/pet-management')} className='w-40 hidden lg:flex cursor-pointer hover:bg-[#f0f0f0] duration-150 bg-secondary rounded-lg shadow-custom mt-3 py-2 justify-center items-center font-semibold'>
                        <img className='w-9 mr-3' src={back} alt="" />
                        <p>Go back</p>
                    </div>
                </div>
            </div>

            {/* EDIT PET */}
            <div className={isEditOpen ? 'block' : 'hidden'}>
                <EditPet pet={pet} closeEdit={handleEditPetClick} />
            </div>

            {/* REMOVING PET */}
            <div className={removePetOpen ? 'block' : 'hidden'}>
                <RemovePet petName={pet.petName} pet={pet} closeUI={toggleRemovePet} />
            </div>
        </div>
        
    )
}

export default PetInfo