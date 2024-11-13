import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close.svg'
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../General/AuthProvider'
import Reject from './Reject'
import RejectionDetails from './RejectionDetails'
import { confirm, successAlert } from '../../General/CustomAlert'

function Application() {
    const navigate = useNavigate();
    const {user, userData} = useContext(AuthContext);
    const { applicationID } = useParams();
    const location = useLocation();
    const [applicationData, setApplicationData] = useState({});
    const [petData, setPetData] = useState({});
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [isRejectionDetailsOpen, setIsRejectionDetailsOpen] = useState(false);


    useEffect(() => {
        const fetchApplication = async () => {
            try{
                const collectionName = location.pathname.includes('closed') ? 'closedApplications' : location.pathname.includes('rejected') ? 'rejectedApplications' : 'adoptionApplications';
                console.log(collectionName)

                const docRef = doc(db, collectionName, applicationID);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()){
                    const application = docSnap.data();
                    setApplicationData(application);

                    if(application.petID){
                        fetchPetData(application.petID)
                    }
                }
                else{
                    console.log("No document!");
                }
            }
            catch(error){
                console.error(error);
            }
        }

        const fetchPetData = async (petID) => {
            try {
                const petRef = doc(db, 'petsForAdoption', petID);
                const petSnap = await getDoc(petRef);

                if (petSnap.exists()) {
                    const pet = petSnap.data();
                    setPetData(pet); // Set the pet data (including image URL)
                } else {
                    console.log("No such pet document!");
                }
            } catch (error) {
                console.error("Error fetching pet data: ", error);
            }
        };

        if(applicationID){
            fetchApplication();
        }
    }, [applicationID]);

    // ACCEPTING APPLICATION
    const acceptApplication = async () => {
        confirm(`Accepting Adoption Application`, `Are you sure you want to accept this application?`).then(async (result) => {
            if(result.isConfirmed){
                try{
                    const applicationRef = doc(db, 'adoptionApplications', applicationID);

                    const applicationSnap = await getDoc(applicationRef);

                    if(applicationSnap.exists()){
                        const applicationData = applicationSnap.data();

                        const adopterDocRef = doc(db, 'users', applicationData.adopterUserID);
                        const adopterDocSnap = await getDoc(adopterDocRef);
                        const adopterData = adopterDocSnap.data();
                        const adopterEmail = adopterData.email;

                        await setDoc(doc(db, 'acceptedApplications', applicationID), {
                            ...applicationData,
                            status: 'accepted',
                            meetupNotified: false,
                            isScheduled: false,
                            petOwnerEmail: userData.email,
                            adopterEmail: adopterEmail,
                            petOwnerName: userData.fullName,
                            acceptedDate: serverTimestamp(),
                        });

                        await updateDoc(applicationRef, {
                            status: 'accepted',
                        });

                        // NOTIFICATION
                        const notificationRef = collection(db, 'notifications');
                        await addDoc(notificationRef, {
                            content: 'accepted your adoption application.',
                            applicationID: applicationData.applicationID,
                            type: 'adoption',
                            image: image,
                            senderName: applicationData.petName+'\'s pet owner',
                            senderId: user.uid,
                            userId: applicationData.adopterUserID,
                            isRead: false,
                            accepted: true,
                            timestamp: serverTimestamp(),
                        });

                        successAlert('Application accepted successfully!');
                        navigate(`/admin/profile/applications/accepted/${applicationID}`)

                    }
                }
                catch(error){
                    console.error(error);
                }
            }
        });
    }

    const toggleReject = () => {
        setIsRejectOpen(!isRejectOpen);
    } 

    const toggleRejectionDetails = () => {
        setIsRejectionDetailsOpen(!isRejectionDetailsOpen);
    } 

    const image = petData.petImages && petData.petImages.length > 0 ? petData.petImages[0] : null;
   

    return (
        <div className='pt-[9.75rem] relative lg:pt-[5.75rem] lg:pl-[13.8rem] lg:pr-[13px] sm:px-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className='bg-[#E9E9E9] p-3 mb-3 lg:mb-4 sm:p-5 relative w-full sm:w-[95%] lg:w-full sm:mx-auto shadow-custom h-full sm:rounded-md lg:rounded-lg'>
                <img className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' onClick={() => window.history.back()} src={close} alt="" />
                <div className='flex flex-col gap-4 justify-center items-center w-full'>
                    <h1 className='text-2xl sm:text-3xl font-medium text-center pt-7'>Adoption Application</h1>
                    <div className='w-60 mb-5 duration-150 relative h-64 flex flex-col drop-shadow-md rounded-xl overflow-hidden'>
                        <img draggable='false' src={image || applicationData.petImage} className='h-full w-full object-cover bg-text' alt="" />
                        <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>{applicationData.petName}</p>
                    </div>
                </div>

                <div className='w-full sm:w-[80%] lg:w-[40rem] sm:mx-auto'>
                    <div className='w-full mb-3 mt-3'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* ADOPTER"S INFO */}
                    <div>
                        <h1 className='text-lg sm:text-xl pt-2 font-semibold mb-2 sm:mb-3'>Adopter's Information</h1>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-[75%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Full Name:</p>
                                <p>{applicationData.adopterName}</p>
                            </div>
                            <div className='flex flex-col shadow-custom w-[25%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Gender:</p>
                                <p>{applicationData.gender}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-[18%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Age:</p>
                                <p>{applicationData.age}</p>
                            </div>
                            <div className='flex flex-col shadow-custom w-[40%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Date of Birth:</p>
                                <p>{applicationData.dateOfBirth}</p>
                            </div>
                            <div className='flex flex-col shadow-custom w-[43%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Contact No:</p>
                                <p>{applicationData.contactNumber}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Email Address:</p>
                                <p>{applicationData.emailAddress}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Full Address:</p>
                                <p>{applicationData.fullAddress}</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full mb-3 mt-7'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* ADOPTION APPLICATION DETAILS */}
                    <div>
                        <h1 className='text-lg sm:text-xl pt-2 font-semibold mb-2 sm:mb-3'>Adoption Application Details</h1>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Reason for adopting:</p>
                                <p>{applicationData.reasonForAdopting}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Experience with pets:</p>
                                <p>{applicationData.experienceWithPets}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-[50%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Type of residence:</p>
                                <p>{applicationData.typeOfResidence}</p>
                            </div>
                            <div className='flex flex-col shadow-custom w-[50%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Occupation:</p>
                                <p>{applicationData.occupation}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Salary range:</p>
                                <p>{applicationData.salaryRange}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Commitment:</p>
                                <p>{applicationData.commitment}</p>
                            </div>
                        </div>
                    </div>

                    {/* ACCEPT OR REJECT */}
                    <div className={`pt-5 pb-2 justify-center gap-3 sm:gap-5 ${applicationData.petOwnerID === user.uid && applicationData.status === 'pending' ? 'flex' : 'hidden'}`}>
                        <button onClick={acceptApplication} className='bg-[#84B725] cursor-pointer hover:bg-[#76a321] duration-150 font-medium text-white py-2 px-6 text-sm sm:text-base rounded-md'>ACCEPT</button>
                        <button onClick={toggleReject} className='bg-[#D25A5A] cursor-pointer hover:bg-[#b94d4d] duration-150 font-medium text-white py-2 px-6 text-sm sm:text-base rounded-md'>REJECT</button>
                    </div>

                    {/* REVIEWING APPLICAITON */}
                    <div className={`pt-5 pb-2 justify-center gap-3 sm:gap-5 ${applicationData.petOwnerID !== user.uid && applicationData.status !== 'rejected' && applicationData.status !== 'accepted' && applicationData.status !== 'closed' ? 'flex' : 'hidden'}`}>
                        <p className='border-2 border-primary font-medium text-primary bg-secondary py-2 px-6 text-sm sm:text-base rounded-full'>Application Under Review</p>
                    </div>

                    {/* REJECTED */}
                    <div onClick={toggleRejectionDetails} className={`pt-5 pb-2 justify-center gap-3 sm:gap-5 ${applicationData.status === 'rejected' ? 'flex' : 'hidden'}`}>
                        <p className='bg-primary hover:bg-primaryHover duration-150 cursor-pointer font-medium text-white py-2 px-6 text-sm sm:text-base rounded-full'>Rejected Adoption Application</p>
                    </div>
                </div>

                {/* REJECTING APPLICATION */}
                <div className={`${isRejectOpen ? 'block' : 'hidden'}`}>
                    <Reject application={applicationData} petImage={image} closeReject={toggleReject} />
                </div>

                <div className={`${isRejectionDetailsOpen ? 'block' : 'hidden'}`}>
                    <RejectionDetails applicationID={applicationData.applicationID} petName={applicationData.petName} closeIt={toggleRejectionDetails} />
                </div>

            </div>
        </div>
    )
}

export default Application