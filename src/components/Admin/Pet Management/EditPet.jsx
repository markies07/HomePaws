import React, { useContext, useEffect, useRef, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../../firebase/firebase'
import { notifySuccessOrange, notifyErrorOrange } from '../../General/CustomToast'
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage'
import { AuthContext } from '../../General/AuthProvider'

function EditPet({pet, closeEdit}) {
    const { user } = useContext(AuthContext);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        petType: '',
        breed: '',
        petName: '',
        age: '',
        gender: '',
        size: '',
        color: '',
        aboutPet: '',
        ownerFirstName: '',
        ownerLastName: '',
        ownerMI: '',
        ownerAge: '',
        ownerGender: '',
        contactNumber: '',
        municipality: '',
        barangay: '',
        houseNo: '',
        isItFree: '',
        goodWithKids: '',
        goodWithAnimals: '',
        houseTrained: '',
    });

    const [petImages, setPetImages] = useState(pet.petImages || []);
    const [newPetImages, setNewPetImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const petID = pet.petID;

    useEffect(() => {
        const fetchPetData = async () => {
            const petDocRef = doc(db, 'petsForAdoption', petID);
            const petDoc = await getDoc(petDocRef);

            if(petDoc.exists()) {
                setFormData(petDoc.data());
                setPetImages(petDoc.data().petImages || []);
            }
            else{
                console.error('No such document exists!');
            }
        }
        fetchPetData();
    }, [petID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);  // Get selected files
        setNewPetImages(files.slice(0, 3));  // Limit to 3 images
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target; // Extract the name and value from the event
        setFormData((prevState) => ({
            ...prevState,        // Spread the previous state
            [name]: value        // Update only the relevant field
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const wordCount = formData.aboutPet.trim().split(/\s+/).length;

        try {
            let imageUrls = formData.petImages || []; // Existing images

            if (petImages.length !== 3) {
                setErrors({ ...errors, petImages: 'You must upload exactly 3 images of the pet.' });
                notifyErrorOrange('You must upload exactly 3 images of the pet.');
                return; // Stop form submission
            }
    
            if(wordCount < 15) {
                notifyErrorOrange('Please enter at least 15 words About the Pet.');
                return;
            }
    
            if(formData.contactNumber.length !== 11){
                notifyErrorOrange('Please enter a valid contact number.');
                return;
            }

            if (newPetImages.length > 0) {
                // Upload new images if they were selected
                imageUrls = await Promise.all(
                    newPetImages.map(async (image, index) => {
                        const imageRef = ref(storage, `pet-images/${Date.now()}-${image.name}`);
                        await uploadBytes(imageRef, image);
                        const url = await getDownloadURL(imageRef);
                        return url;
                    })
                );
            }

            const petDocRef = doc(db, 'petsForAdoption', petID);
            await updateDoc(petDocRef, {
                ...formData,
                petImages: imageUrls
            });

            notifySuccessOrange('Pet information updated successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error updating document: ', error);
            notifyErrorOrange('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleButtonClick = () => {
        // Programmatically trigger the file input when button is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className='w-full h-full lg:pb-4 mt-4'>
            <div className='relative px-4 pb-5 bg-secondary lg:rounded-lg shadow-custom w-full h-full'>
                <img onClick={closeEdit} className='absolute border-2 border-secondary hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                <p className='text-center font-semibold text-2xl sm:text-3xl pt-12'>Edit Pet Information</p>
                <div className='max-w-[35rem] pb-5 mx-auto flex pt-5 gap-3 sm:gap-5 xl:gap-7'>
                    {newPetImages.length > 0 ? newPetImages.map((file, index) => (
                        <div key={index} className='bg-[#BCBCBC] rounded-md h-44 sm:h-48 w-full flex justify-center'>
                            <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className='object-cover w-full h-full rounded-md' />
                        </div>
                    )) 
                    : petImages.map((image, index) => (
                        <div key={index} className='bg-[#BCBCBC] rounded-md overflow-hidden h-44 sm:h-48 w-full flex justify-center'>
                            <img src={image} alt={`Existing Image ${index + 1}`}  className='w-full object-cover' />
                        </div>
                    ))
                    }
                </div>
                {/* FORM */}
                <form onSubmit={handleSubmit} className='max-w-[40rem] flex flex-col xl:max-w-[45rem] mx-auto'>
                    {/* PET IMAGES INPUT */}
                    <input id="images" ref={fileInputRef} name='petImages' type="file" accept="image/*" multiple onChange={handleImageChange} className='hidden'/>
                    <button type='button' onClick={handleButtonClick} className='bg-[#BCBCBC] hover:bg-[#cccccc] px-5 py-2 font-medium mx-auto text-sm rounded-md duration-150'>Upload Images</button>
                    {/* PET INFO */}

                    <div className='flex my-5 gap-3'>
                        <div className='w-24'>
                            <p className='font-semibold'>Pet Type</p>
                            <select name="petType" value={formData.petType} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                <option className="text-text py-2" value="Cat">Cat</option>
                                <option className="text-text py-2" value="Dog">Dog</option>
                            </select>
                        </div>
                        <div className='w-48'>
                            <p className='font-semibold'>Breed</p>
                            <select name="breed" value={formData.breed} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                <option className="text-text py-2" value="Puspin">Puspin</option>
                                <option className="text-text py-2" value="Aspin">Aspin</option>
                                <option className="text-text py-2" value="German Shepherd">German Shepherd</option>
                                <option className="text-text py-2" value="Golden Retriever">Golden Retriever</option>
                                <option className="text-text py-2" value="Persian">Persian</option>
                                <option className="text-text py-2" value="Pomeranian">Pomeranian</option>
                                <option className="text-text py-2" value="Ragdol">Ragdol</option>
                                <option className="text-text py-2" value="Shih Tzu">Shih Tzu</option>
                                <option className="text-text py-2" value="Siamese">Siamese</option>
                                <option className="text-text py-2" value="Siberian Husky">Siberian Husky</option>
                                <option className="text-text py-2" value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex flex-col xl:flex-row xl:gap-3'>
                        <div className='flex w-full items-center mb-5 gap-3'>
                            <div className='w-[60%]'>
                                <p className='font-semibold'>Pet Name</p>
                                <input required name="petName" value={formData.petName} onChange={handleInputChange} className='py-1 w-full px-2 border-2 border-text rounded-md' type="text" id="" />
                            </div>
                            <div className='flex flex-col w-[40%]'>
                                <p className='font-semibold'>Age</p>
                                <select name="age" value={formData.age} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Kitty/Puppy">Kitty/Puppy</option>
                                    <option className="text-text py-2" value="Young">Young</option>
                                    <option className="text-text py-2" value="Adult">Adult</option>
                                    <option className="text-text py-2" value="Senior">Senior</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex w-full items-center mb-5 gap-3'>
                            <div className='flex flex-col w-full'>
                                <p className='font-semibold'>Gender</p>
                                <select name="gender" value={formData.gender} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Male">Male</option>
                                    <option className="text-text py-2" value="Female">Female</option>
                                </select>
                            </div>
                            <div className='flex flex-col w-full'>
                                <p className='font-semibold'>Size</p>
                                <select name="size" value={formData.size} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Small">Small</option>
                                    <option className="text-text py-2" value="Medium">Medium</option>
                                    <option className="text-text py-2" value="Large">Large</option>
                                </select>
                            </div>
                            <div className='flex flex-col w-full'>
                                <p className='font-semibold'>Color</p>
                                <select name="color" value={formData.color} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Black">Black</option>
                                    <option className="text-text py-2" value="White">White</option>
                                    <option className="text-text py-2" value="Brown">Brown</option>
                                    <option className="text-text py-2" value="Gray">Gray</option>
                                    <option className="text-text py-2" value="Orange">Orange</option>
                                    <option className="text-text py-2" value="Multi-Color">Multi-Color</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center mb-5 gap-3'>
                        <div className='w-full'>
                            <p className='font-semibold'>About the pet</p>
                            <textarea required name="aboutPet" value={formData.aboutPet} onChange={handleInputChange} className='py-1 w-full h-40 px-2 border-2 border-text rounded-md' placeholder='(e.g., pet health condition, pet behavior)'></textarea>
                        </div>
                    </div>
                    <div className='w-full my-5'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* OWNER INFO */}
                    <div className='flex flex-col mb-5'>
                        <p className='text-2xl font-semibold pb-5'>Owner's Information</p>
                        <div className='flex flex-col xl:gap-3'>
                            <div className='flex w-full gap-3 pb-5 xl:pb-3'>
                                <div className='w-[45%]'>
                                    <p className='font-semibold'>First Name</p>
                                    <input name="ownerFirstName" value={formData.ownerFirstName} onChange={handleInputChange} required className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" />
                                </div>
                                <div className='w-[40%]'>
                                    <p className='font-semibold'>Last Name</p>
                                    <input name="ownerLastName" value={formData.ownerLastName} onChange={handleInputChange} required className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" />
                                </div>
                                <div className='flex flex-col w-[15%]'>
                                    <p className='font-semibold'>M.I.</p>
                                    <input name="ownerMI" maxLength='1' value={formData.ownerMI} onChange={handleInputChange} required className='py-1 outline-none w-full capitalize px-2 border-2 border-text rounded-md' type="text" />
                                </div>
                            </div>
                            <div className='flex w-full gap-3 pb-2'>
                                <div className='flex flex-col w-[15%]'>
                                    <p className='font-semibold'>Age</p>
                                    <input name="ownerAge" min='0' value={formData.ownerAge} onChange={handleInputChange} required className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' type="number" />
                                </div>
                                <div className='w-[25%]'>
                                    <p className='font-semibold'>Gender</p>
                                    <select name="ownerGender" value={formData.ownerGender} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                        <option className="text-text py-2" value="Male">Male</option>
                                        <option className="text-text py-2" value="Female">Female</option>
                                    </select>
                                </div>
                                <div className='flex flex-col w-[60%]'>
                                    <p className='font-semibold'>Contact No.</p>
                                    <input required min='11' name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' type="number" />
                                </div>
                            </div>
                        </div>
                        <p className='text-2xl font-semibold pb-2 pt-4'>Address</p>
                        <div className='flex flex-col gap-3'>
                            <div className='w-full gap-3 pb-2'>
                                <p className='font-semibold'>City / Municipality</p>
                                <select name="municipality" value={formData.municipality} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
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

                            <div className={`${formData.municipality === 'General Trias' ? 'block' : 'hidden'} w-full gap-3 pb-2`}>
                                <p className='font-semibold'>Barangay</p>
                                <select name="barangay" value={formData.barangay} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Alingaro">Alingaro</option>
                                    <option className="text-text py-2" value="Arnaldo Poblacion">Arnaldo Poblacion</option>
                                    <option className="text-text py-2" value="Bacao I">Bacao I</option>
                                    <option className="text-text py-2" value="Bacao II">Bacao II</option>
                                    <option className="text-text py-2" value="Bagumbayan Poblacion">Bagumbayan Poblacion</option>
                                    <option className="text-text py-2" value="Biclatan">Biclatan</option>
                                    <option className="text-text py-2" value="Buenavista I">Buenavista I</option>
                                    <option className="text-text py-2" value="Buenavista II">Buenavista II</option>
                                    <option className="text-text py-2" value="Buenavista III">Buenavista III</option>
                                    <option className="text-text py-2" value="Corregidor Poblacion">Corregidor Poblacion</option>
                                    <option className="text-text py-2" value="Dulong Bayan Poblacion">Dulong Bayan Poblacion</option>
                                    <option className="text-text py-2" value="Gov. Ferrer Poblacion">Gov. Ferrer Poblacion</option>
                                    <option className="text-text py-2" value="Javalera">Javalera</option>
                                    <option className="text-text py-2" value="Manggahan">Manggahan</option>
                                    <option className="text-text py-2" value="Navaro">Navaro</option>
                                    <option className="text-text py-2" value="Ninety Sixth Poblacion">Ninety Sixth Poblacion</option>
                                    <option className="text-text py-2" value="Panungyanan">Panungyanan</option>
                                    <option className="text-text py-2" value="Pasong Camachile I">Pasong Camachile I</option>
                                    <option className="text-text py-2" value="Pasong Camachile II">Pasong Camachile II</option>
                                    <option className="text-text py-2" value="Pasong Kawayan I">Pasong Kawayan I</option>
                                    <option className="text-text py-2" value="Pasong Kawayan II">Pasong Kawayan II</option>
                                    <option className="text-text py-2" value="Pinagtipunan">Pinagtipunan</option>
                                    <option className="text-text py-2" value="Prinza Poblacion">Prinza Poblacion</option>
                                    <option className="text-text py-2" value="Sampalucan Poblacion">Sampalucan Poblacion</option>
                                    <option className="text-text py-2" value="San Francisco">San Francisco</option>
                                    <option className="text-text py-2" value="San Gabriel Poblacion">San Gabriel Poblacion</option>
                                    <option className="text-text py-2" value="San Juan I">San Juan I</option>
                                    <option className="text-text py-2" value="San Juan II">San Juan II</option>
                                    <option className="text-text py-2" value="Santa Clara">Santa Clara</option>
                                    <option className="text-text py-2" value="Santiago">Santiago</option>
                                    <option className="text-text py-2" value="Tapia">Tapia</option>
                                    <option className="text-text py-2" value="Tejero">Tejero</option>
                                    <option className="text-text py-2" value="Vibora Poblacion">Vibora Poblacion</option>
                                </select>
                            </div>

                            <div className={`${formData.municipality === 'General Trias' ? 'hidden' : 'block'} w-full gap-3 pb-2`}>
                                <p className='font-semibold'>Barangay</p>
                                <input name="barangay" value={formData.barangay} onChange={handleInputChange} required className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" />
                            </div>

                            <div className='w-full gap-3 pb-2'>
                                <p className='font-semibold'>St. Name, Building, House No.</p>
                                <input name="houseNo" value={formData.houseNo} onChange={handleInputChange} required className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" />
                            </div>

                        </div>
                    </div>
                    <div className='w-full my-5'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* FREQUENTLY ASKED QUESTIONS */}
                    <div className='flex flex-col mb-5 gap-5'>
                        <p className='text-2xl font-semibold pb-3'>Additional Information</p>
                        <div className='flex flex-col xl:gap-3'>
                            <div className='flex flex-col'>
                                <div className='w-full gap-3 pb-5'>
                                    <p className='font-semibold'>Is the pet for free?</p>
                                    <div className='flex gap-6 mt-1'>
                                        <div className='flex items-center'>
                                            <input required className='mr-2 cursor-pointer w-5 h-5 ' type="radio" onChange={handleRadioChange} checked={formData.isItFree === "Yes"} name="isItFree" value="Yes" />
                                            <label className='font-semibold' htmlFor="Yes">Yes</label>
                                        </div>
                                        <div className='flex items-center'>
                                            <input required className='mr-2 cursor-pointer w-5 h-5' type="radio" onChange={handleRadioChange} checked={formData.isItFree === "No"} name="isItFree" value="No" />
                                            <label className='font-semibold' htmlFor="No">No</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full gap-3 pb-5'>
                                    <p className='font-semibold'>Is the pet good with kids?</p>
                                    <div className='flex gap-6 mt-1'>
                                        <div className='flex items-center'>
                                            <input required className='mr-2 cursor-pointer w-5 h-5' type="radio" onChange={handleRadioChange} checked={formData.goodWithKids === "Yes"} name="goodWithKids" value="Yes" />
                                            <label className='font-semibold' htmlFor="Yes">Yes</label>
                                        </div>
                                        <div className='flex items-center'>
                                            <input required className='mr-2 cursor-pointer w-5 h-5' type="radio" onChange={handleRadioChange} checked={formData.goodWithKids === "No"} name="goodWithKids" value="No" />
                                            <label className='font-semibold' htmlFor="No">No</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full gap-3 pb-5'>
                                    <p className='font-semibold'>Is the pet good with other animals?</p>
                                    <div className='flex gap-6 mt-1'>
                                        <div className='flex items-center'>
                                            <input required className='mr-2 cursor-pointer w-5 h-5' type="radio" onChange={handleRadioChange} checked={formData.goodWithAnimals === "Yes"} name="goodWithAnimals" value="Yes" />
                                            <label className='font-semibold' htmlFor="Yes">Yes</label>
                                        </div>
                                        <div className='flex items-center'>
                                            <input required className='mr-2 cursor-pointer w-5 h-5' type="radio" onChange={handleRadioChange} checked={formData.goodWithAnimals === "No"} name="goodWithAnimals" value="No" />
                                            <label className='font-semibold' htmlFor="No">No</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full gap-3 pb-5'>
                                    <p className='font-semibold'>Is the pet house-trained?</p>
                                    <div className='flex gap-6 mt-1'>
                                        <div className='flex items-center'>
                                            <input required className='mr-2 cursor-pointer w-5 h-5' type="radio" onChange={handleRadioChange} checked={formData.houseTrained === "Yes"} name="houseTrained" value="Yes" />
                                            <label className='font-semibold' htmlFor="Yes">Yes</label>
                                        </div>
                                        <div className='flex items-center'>
                                            <input required className='mr-2 cursor-pointer w-5 h-5' type="radio" onChange={handleRadioChange} checked={formData.houseTrained === "No"} name="houseTrained" value="No" />
                                            <label className='font-semibold' htmlFor="No">No</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                        </div>
                    </div>
                    <div className='w-full flex pb-5 justify-center'>
                        <button type='submit' disabled={isSubmitting} className='text-center bg-primary hover:bg-primaryHover px-5 py-2 rounded-md font-medium text-white'>{isSubmitting ? 'EDITING...' : 'EDIT PET'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditPet