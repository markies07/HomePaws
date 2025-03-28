import React, { useContext, useEffect, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import { useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import { AuthContext } from '../../General/AuthProvider';
import emailjs from '@emailjs/browser';
import check from './assets/check.svg';
import uncheck from './assets/uncheck.svg';
import TermsAndConditions from './TermsAndConditions';

function AdoptionForm() {
    const { petID } = useParams();
    const { userData, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [pet, setPet] = useState([]);

    const barangayOptions = {
        'General Trias': [
            'Alingaro',
            'Arnaldo Poblacion',
            'Bacao I',
            'Bacao II',
            'Bagumbayan Poblacion',
            'Buenavista I',
            'Buenavista II',
            'Buenavista III',
            'Corregidor Poblacion',
            'Dulong Bayan Poblacion',
            'Gov. Ferrer Poblacion',
            'Javalera',
            'Manggahan',
            'Navarro',
            'Ninety Sixth Poblacion',
            'Panungyanan',
            'Pasong Camachile I',
            'Pasong Camachile II',
            'Pasong Kawayan I',
            'Pasong Kawayan II',
            'Pinagtipunan',
            'Prinza Poblacion',
            'Sampalucan Poblacion',
            'San Francisco',
            'San Gabriel Poblacion',
            'San Juan I',
            'San Juan II',
            'Santa Clara',
            'Santiago',
            'Tapia',
            'Tejero',
            'Vibora Poblacion',
        ],
    };
    

    const [formData, setFormData] = useState({
        adopterFirstName: '',
        adopterLastName: '',
        adopterMI: '',
        petName: '',
        age: '',
        dateOfBirth: '',
        gender: 'Male',
        contactNumber: '',
        emailAddress: '',
        municipality: 'Alfonso',
        barangay: '',
        houseNo: '',
        reasonForAdopting: '',
        experienceWithPets: '',
        typeOfResidence: 'House',
        occupation: '',
        salaryRange: 'Less than Php 10,000',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // Dynamically update barangay when municipality changes
    useEffect(() => {
        if (formData.municipality === 'General Trias') {
            setFormData((prevState) => ({
                ...prevState,
                barangay: barangayOptions['General Trias'][0], // Default to the first barangay
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                barangay: '', // Reset barangay if not General Trias
            }));
        }
    }, [formData.municipality]);

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

    // Function to send email notifications using EmailJS
    const sendEmailNotification = async (recipientEmail) => {
        try {
            const templateParams = {
                subject: `You got an adoption application!`,
                message: `${userData.fullName} submitted an adoption application.\nclick here: https://paws-ae1eb.web.app/`,
                email: recipientEmail
            };

            // Replace these with your EmailJS credentials
            const SERVICE_ID = 'service_yii1sji';
            const TEMPLATE_ID = 'template_eti1vex';
            const USER_ID = 'JT0EGxZqCSR3-9IIa';

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
            console.log(`Email notification sent to ${recipientEmail}`);
        } catch (error) {
            console.error('Failed to send email notification: ', error);
        }
    };

    // SUBMITTING APPLICATION
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        if(!isAccepted) {
            notifyErrorOrange('You need to accept terms and conditions');
            setIsSubmitting(false);
            return;
        }

        if(formData.contactNumber.length !== 11){
            notifyErrorOrange('Please enter a valid contact number.');
            setIsSubmitting(false);
            return;
        }

        try{
            const docRef = await addDoc(collection(db, 'adoptionApplications'), {
                ...formData,
                petImage: pet.petImages[0],
                dateSubmitted: Timestamp.now(),
                status: 'pending',
            });

            await updateDoc(docRef, {
                applicationID: docRef.id,
            });

            // Fetch post owner's data
            const petOwnerRef = doc(db, 'users', pet.userID);
            const petOwnerSnapshot = await getDoc(petOwnerRef);
            const petOwnerData = petOwnerSnapshot.data();

            // Check lastActive timestamp
            if (petOwnerData && petOwnerData.lastActive) {
                const now = Timestamp.now();
                const lastActive = petOwnerData.lastActive;
                const differenceInMinutes = (now.toMillis() - lastActive.toMillis()) / (1000 * 60);

                if (differenceInMinutes >= 3) {
                    // Send email notification if the post owner has been inactive for 3 minutes or more
                    await sendEmailNotification(
                        petOwnerData.email
                    );
                }
            }

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
            }, 1500);
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

    const toggleTerms = () => {
        setIsTermsOpen(!isTermsOpen);
    }


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
                    <div className='flex w-full gap-2 pb-5 xl:pb-3'>
                        <div className='w-[45%]'>
                            <p className='font-semibold'>First Name</p>
                            <input name="adopterFirstName" value={formData.adopterFirstName || ''} onChange={handleChange} required className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" />
                        </div>
                        <div className='w-[40%]'>
                            <p className='font-semibold'>Last Name</p>
                            <input name="adopterLastName" value={formData.adopterLastName || ''} onChange={handleChange} required className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" />
                        </div>
                        <div className='flex flex-col w-[15%]'>
                            <p className='font-semibold'>M.I.</p>
                            <input name="adopterMI" maxLength='1' value={formData.adopterMI || ''} onChange={handleChange} required className='py-1 outline-none w-full capitalize px-2 border-2 border-text rounded-md' type="text" />
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
                            <input required min='11' name="contactNumber" value={formData.contactNumber || ''} onChange={handleChange} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="number" id="" />
                        </div>
                        <div className='w-full'>
                            <p className='font-semibold'>Email Address</p>
                            <input required disabled name="emailAddress" value={formData.emailAddress || ''} className='py-1 bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="text" id="" />
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='w-full gap-3 pb-2'>
                            <p className='font-semibold'>City / Municipality</p>
                            <select name="municipality" value={formData.municipality} onChange={handleChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                <option className="text-text py-2" value="Alfonso">Alfonso</option>
                                <option className="text-text py-2" value="Amadeo">Amadeo</option>
                                <option className="text-text py-2" value="Bacoor">Bacoor</option>
                                <option className="text-text py-2" value="Carmona">Carmona</option>
                                <option className="text-text py-2" value="Cavite City">Cavite City</option>
                                <option className="text-text py-2" value="Dasmariñas">Dasmariñas</option>
                                <option className="text-text py-2" value="General Emilio Aguinaldo">General Emilio Aguinaldo</option>
                                <option className="text-text py-2" value="General Mariano Alvarez">General Mariano Alvarez</option>
                                <option className="text-text py-2" value="General Trias">General Trias</option>
                                <option className="text-text py-2" value="Imus">Imus</option>
                                <option className="text-text py-2" value="Indang">Indang</option>
                                <option className="text-text py-2" value="Kawit">Kawit</option>
                                <option className="text-text py-2" value="Magallanes">Magallanes</option>
                                <option className="text-text py-2" value="Maragondon">Maragondon</option>
                                <option className="text-text py-2" value="Mendez">Mendez</option>
                                <option className="text-text py-2" value="Naic">Naic</option>
                                <option className="text-text py-2" value="Noveleta">Noveleta</option>
                                <option className="text-text py-2" value="Rosario">Rosario</option>
                                <option className="text-text py-2" value="Silang">Silang</option>
                                <option className="text-text py-2" value="Tagaytay">Tagaytay</option>
                                <option className="text-text py-2" value="Tanza">Tanza</option>
                                <option className="text-text py-2" value="Ternate">Ternate</option>
                                <option className="text-text py-2" value="Trece Martires">Trece Martires</option>
                            </select>
                        </div>

                        {/* Barangay Section */}
                        {formData.municipality === 'General Trias' ? (
                            <div className="w-full gap-3 pb-2">
                                <p className="font-semibold">Barangay</p>
                                <select
                                    name="barangay"
                                    value={formData.barangay}
                                    onChange={handleInputChange}
                                    className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2"
                                >
                                    {barangayOptions['General Trias'].map((barangay) => (
                                        <option className="text-text py-2" key={barangay} value={barangay}>
                                            {barangay}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className={`${formData.municipality === 'General Trias' ? 'hidden' : 'block'} w-full gap-3 pb-2`}>
                                <p className='font-semibold'>Barangay</p>
                                <input name="barangay" value={formData.barangay} onChange={handleChange} required className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" />
                            </div>
                        )}

                        <div className='w-full gap-3 pb-2'>
                            <p className='font-semibold'>St. Name, Building, House No.</p>
                            <input name="houseNo" value={formData.houseNo} onChange={handleChange} required className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" />
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
                    <div className='w-full flex pb-5 pt-3'>
                        <div className='w-full gap-2 flex justify-center'>
                            <img onClick={toggleTerms} className='w-7 h-7 object-cover cursor-pointer' src={isAccepted ? check : uncheck} alt="" />
                            <p onClick={toggleTerms} className='font-semibold text-lg text-text underline cursor-pointer'>Read Terms and Conditions</p>
                        </div>
                    </div>
                    <div className='flex justify-center py-3'>
                        <button type='submit' disabled={isSubmitting} className='bg-primary hover:bg-primaryHover text-center duration-150 py-2 px-3 font-medium text-white rounded-md'>{isSubmitting ? 'Submitting' : 'Submit Application'}</button>
                    </div>
                </form>

                {/* TERMS AND CONDITIONS */}
                <div className={isTermsOpen ? 'block' : 'hidden'}>
                    < TermsAndConditions setIsAccepted={setIsAccepted} closeTerms={toggleTerms} />
                </div>

            </div>
        </div>
    )
}

export default AdoptionForm