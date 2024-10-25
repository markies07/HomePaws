import React, { useContext, useEffect, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import { useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import { AuthContext } from '../../General/AuthProvider';

function AdoptionForm() {
    const { petID } = useParams();
    const { userData, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pet, setPet] = useState([]);
    const [formData, setFormData] = useState({
        adopterName: '',
        petName: '',
        age: '',
        dateOfBirth: '',
        gender: 'Male',
        contactNumber: '',
        emailAddress: '',
        fullAddress: '',
        reasonForAdopting: '',
        experienceWithPets: '',
        typeOfResidence: 'House',
        occupation: '',
        salaryRange: 'Less than Php 10,000',
        commitment: '', 
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        if (pet && userData) {
          setFormData((prevData) => ({
            ...prevData,
            petName: pet.petName,
            emailAddress: userData.email,
            petID: petID,
            adopterUserID: user.uid,
            petOwnerID: pet.userID,
            read: false,
          }));
        }
    }, [pet, userData]);

    // SUBMITTING APPLICATION
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        try{
            const docRef = await addDoc(collection(db, 'adoptionApplications'), {
                ...formData,
                dateSubmitted: Timestamp.now(),
                status: 'pending',
            });

            await updateDoc(docRef, {
                applicationID: docRef.id,
            });

            const notificationRef = collection(db, 'notifications');
            await addDoc(notificationRef, {
                userId: pet.userID,
                senderId: user.uid,
                applicationID: docRef.id,
                senderName: userData.fullName,
                image: userData.profilePictureURL,
                type: 'adoption',
                petId: petID,
                content: `submitted an adoption application.`,
                isRead: false,
                timestamp: serverTimestamp(),
            })

            notifySuccessOrange('Adoption application submitted successfully!');
        }
        catch(error){
            console.error('Error submitting application:', error);
            notifyErrorOrange('Failed to submit application. Please try again.');
        }
        finally{
            setTimeout(() => {
                navigate(`/dashboard/find-pet/${pet.petID}`);
            }, 2500);
            setIsSubmitting(false);
        }
    }

    // FETCHING PET DATA
    useEffect(() => {
        const fetchPetData = async () => {
          try {
            const petDocRef = doc(db, 'petsForAdoption', petID); 
            const petDocSnap = await getDoc(petDocRef);
    
            if (petDocSnap.exists()) {
              setPet(petDocSnap.data());  
              console.log("data found!")
            } else {
              console.log('No such document!');
            }
          } catch (error) {
            console.error('Error fetching pet data:', error);
          } 
        };
    
        if (petID) {
          fetchPetData();
        }
    }, [petID]);


    return (
        <div className='pt-[9.75rem] lg:pt-[5.75rem] lg:pl-48 xl:pl-56 lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className='relative px-4 pb-5 bg-[#E9E9E9] sm:w-[97%] lg:w-full mx-auto mb-4 sm:rounded-lg shadow-custom w-full h-full'>
                <img onClick={() => window.history.back()} className='absolute border-2 border-[#E9E9E9] hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                <h1 className='text-2xl sm:text-3xl font-semibold text-center pt-12 pb-7'>Adoption Application</h1>
                
                {/* FORM */}
                <form onSubmit={handleSubmit} className='w-full flex flex-col max-w-[35rem] xl:max-w-[40rem] mx-auto'>
                    <div className='w-48 lg:w-60'>
                        <p className='font-semibold'>Pet Name</p>
                        <input name="petName" value={formData.petName || ''} disabled className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="text" id="" />
                    </div>
                    <div className='w-full my-5'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* ADOPTER INFORMATION */}
                    <h1 className='text-xl font-semibold pb-4'>Adopter's Information</h1>
                    <div className='w-full flex gap-2 pb-4'>
                        <div className='w-full'>
                            <p className='font-semibold'>Full Name</p>
                            <input required name="adopterName" onChange={handleChange} value={formData.adopterName || ''} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="text" id="" />
                        </div>
                    </div>
                    <div className='w-full flex gap-2 pb-4'>
                        <div className='w-[20%] shrink-0'>
                            <p className='font-semibold'>Age</p>
                            <input required name="age" value={formData.age || ''} onChange={handleChange} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="number" id="" />
                        </div>
                        <div className='w-[45%] shrink-0'>
                            <p className='font-semibold'>Date of Birth</p>
                            <input required name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} className='py-[3px] bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="date" />
                        </div>
                        <div className='w-[35%]'>
                            <p className='font-semibold'>Gender</p>
                            <select name="gender" value={formData.gender || ''} onChange={handleChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                <option className="text-text py-2" value="Male">Male</option>
                                <option className="text-text py-2" value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className='w-full flex gap-2 pb-4'>
                        <div className='w-80'>
                            <p className='font-semibold'>Contact Number</p>
                            <input required name="contactNumber" value={formData.contactNumber || ''} onChange={handleChange} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="number" id="" />
                        </div>
                        <div className='w-full'>
                            <p className='font-semibold'>Email Address</p>
                            <input required disabled name="emailAddress" value={formData.emailAddress || ''} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="text" id="" />
                        </div>
                    </div>
                    <div className='w-full flex gap-2 pb-4'>
                        <div className='w-full'>
                            <p className='font-semibold'>Full Address</p>
                            <input required name="fullAddress" value={formData.fullAddress || ''} onChange={handleChange} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="text" id="" />
                        </div>
                    </div>
                    <div className='w-full my-5'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* MORE DETAILS */}
                    <h1 className='text-xl font-semibold pb-4'>Adoption Application Details</h1>
                    <div className='w-full flex gap-2 pb-4'>
                        <div className='w-full'>
                            <p className='font-semibold'>Reason for adopting</p>
                            <input required name="reasonForAdopting" value={formData.reasonForAdopting || ''} onChange={handleChange} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="text" id="" />
                        </div>
                    </div>
                    <div className='w-full flex gap-2 pb-4'>
                        <div className='w-full'>
                            <p className='font-semibold'>Experience with pets</p>
                            <input required name="experienceWithPets" value={formData.experienceWithPets || ''} onChange={handleChange} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' placeholder='(e.g., Did you ever have a pet before?)' type="text" id="" />
                        </div>
                    </div>
                    <div className='w-full flex gap-2 pb-4'>
                        <div className='w-[50%]'>
                            <p className='font-semibold'>Type of residence</p>
                            <select name="typeOfResidence" value={formData.typeOfResidence || ''} onChange={handleChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                <option className="text-text py-2" value="House">House</option>
                                <option className="text-text py-2" value="Apartment">Apartment</option>
                                <option className="text-text py-2" value="Condo">Condo</option>
                                <option className="text-text py-2" value="Townhouse">Townhouse</option>
                            </select>
                        </div>
                        <div className='w-[50%]'>
                            <p className='font-semibold'>Occupation</p>
                            <input required name="occupation" value={formData.occupation || ''} onChange={handleChange} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="text" id="" />
                        </div>
                    </div>
                    <div className='w-full flex gap-2 pb-4'>
                        <div className='w-full'>
                            <p className='font-semibold'>Salary range</p>
                            <select name="salaryRange" value={formData.salaryRange || ''} onChange={handleChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                <option className="text-text py-2" value="Less than Php 10,000">Less than Php 10,000</option>
                                <option className="text-text py-2" value="Php 10,000 - 30,000">Php 10,000 - 30,000</option>
                                <option className="text-text py-2" value="Php 30,000 - 50,000">Php 30,000 - 50,000</option>
                                <option className="text-text py-2" value="More than Php 50,000">More than Php 50,000</option>
                            </select>
                        </div>
                    </div>
                    <div className='w-full flex gap-2 pb-4'>
                        <div className='w-full'>
                            <p className='font-semibold'>Commitment</p>
                            <textarea required name="commitment" value={formData.commitment || ''} onChange={handleChange} className='py-1 w-full h-20 px-2 border-2 border-text rounded-md' placeholder='(e.g., Prove that you will take care of the pet.)'></textarea>
                        </div>
                    </div>
                    <div className='flex justify-center py-3'>
                        <button type='submit' disabled={isSubmitting} className='bg-primary hover:bg-primaryHover duration-150 py-2 px-3 font-medium text-white rounded-md'>{isSubmitting ? 'Submitting' : 'Submit Application'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdoptionForm