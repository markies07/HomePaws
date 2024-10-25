import React, { useContext, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import images from './assets/images.svg'
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../../firebase/firebase'
import { notifySuccessOrange, notifyErrorOrange } from '../../General/CustomToast'
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage'
import { AuthContext } from '../../General/AuthProvider'

function PostPet({closePostPet}) {

    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        petType: 'Cat',
        breed: 'Puspin',
        petName: '',
        age: 'Kitty/Puppy',
        gender: 'Male',
        size: 'Small',
        color: 'Black',
        aboutPet: '',
        ownerName: '',
        ownerAge: '',
        ownerGender: 'Male',
        contactNumber: '',
        location: '',
        adoptionFee: '',
        goodWithKids: '',
        goodWithAnimals: '',
        timeAndPlace: '',
    });

    const [petImages, setPetImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
    
        if (name === 'petName') {
            updatedValue = value.replace(/\b\w/g, char => char.toUpperCase());
        }
    
        setFormData({ ...formData, [name]: updatedValue });
    
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setPetImages(files.slice(0, 3));

        if (errors.petImages) {
          setErrors({ ...errors, petImages: '' });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission started');
        

        setIsSubmitting(true);
        try{
            console.log('Uploading images...');
            const imageUrls = await Promise.all(
                petImages.map(async (image, index) => {
                    console.log(`Uploading image ${index + 1}...`);
                    const imageRef = ref(storage, `pet-images/${Date.now()}-${image.name}`);
                    await uploadBytes(imageRef, image);
                    const url = await getDownloadURL(imageRef);
                    console.log(`Image ${index + 1} uploaded successfully`);
                    return url;
                })
            );
            console.log('All images uploaded successfully');

            console.log('Adding document to Firestore...');
            const docRef = await addDoc(collection(db, 'petsForAdoption'), {
                ...formData,
                petImages: imageUrls,
                petID: '',
                timePosted: serverTimestamp(),
                userID: user.uid,
                status: 'For Adoption',
            });

            await updateDoc(docRef, {
                petID: docRef.id
            });
            console.log('Document written with ID: ', docRef.id);
            notifySuccessOrange('Pet posted successfully!');

            setFormData({
                petType: 'Cat',
                breed: 'Puspin',
                petName: '',
                age: 'Kitty/Puppy',
                gender: 'Male',
                size: 'Small',
                color: 'Black',
                aboutPet: '',
                ownerName: '',
                ownerAge: '',
                ownerGender: 'Male',
                contactNumber: '',
                location: '',
                adoptionFee: '',
                goodWithKids: '',
                goodWithAnimals: '',
                timeAndPlace: '',
            });
            setPetImages([]);
        }
        catch (error) {
            console.error("Error adding document: ", error);
            notifyErrorOrange('An error occured. Please try again.');
        }
        finally {
            setTimeout(() => {
                window.location.reload();
            }, 2500);
            setIsSubmitting(false);
            console.log('Form submission completed');
        }
    };


    return (
        <div className='w-full h-full my-3 lg:my-4'>
            <div className='relative px-4 pb-5 bg-secondary lg:rounded-lg shadow-custom w-full h-full'>
                <img onClick={closePostPet} className='absolute border-2 border-secondary hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                <p className='text-center font-medium text-3xl pt-12'>Post Pet for Adoption</p>
                <div className='max-w-[35rem] pb-5 mx-auto flex pt-5 gap-3 sm:gap-5 xl:gap-7'>
                    {petImages.length > 0 ? petImages.map((image, index) => (
                        <div key={index} className='bg-[#BCBCBC] rounded-md h-44 sm:h-48 w-full flex justify-center'>
                            <img src={URL.createObjectURL(image)} alt={`Uploaded ${index + 1}`} className='object-cover w-full h-full rounded-md' />
                        </div>
                    )) : (
                        <>
                            <div className='bg-[#BCBCBC] rounded-md h-44 sm:h-48 w-full flex justify-center'>
                                <img className='w-12 lg:w-14' src={images} alt="" />
                            </div>
                            <div className='bg-[#BCBCBC] rounded-md h-44 sm:h-48 w-full flex justify-center'>
                                <img className='w-12 lg:w-14' src={images} alt="" />
                            </div>
                            <div className='bg-[#BCBCBC] rounded-md h-44 sm:h-48 w-full flex justify-center'>
                                <img className='w-12 lg:w-14' src={images} alt="" />
                            </div>
                        </>
                    )}
                </div>
                {/* FORM */}
                <form onSubmit={handleSubmit} className='max-w-[40rem] flex flex-col xl:max-w-[45rem] mx-auto'>
                    {/* PET IMAGES INPUT */}
                    <button type='button' onClick={() => document.getElementById('images').click()} className='bg-[#BCBCBC] hover:bg-[#cccccc] px-5 py-2 font-medium mx-auto text-sm rounded-md duration-150'>Upload Images</button>
                    <input id="images" type="file" accept="image/*" multiple onChange={handleImageChange} style={{display: 'none'}}/>
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
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Pet Name</p>
                                <input required name="petName" value={formData.petName} onChange={handleInputChange} className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" id="" />
                            </div>
                            <div className='flex flex-col w-[50%]'>
                                <p className='font-semibold'>Age</p>
                                <select name="age" value={formData.age} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Kitty/Puppy">Kitty/Puppy (1 - 6 months)</option>
                                    <option className="text-text py-2" value="Young">Young (6 months - 2 years)</option>
                                    <option className="text-text py-2" value="Adult">Adult (2 - 7 years)</option>
                                    <option className="text-text py-2" value="Senior">Senior (7 years and older)</option>
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
                            <textarea required name="aboutPet" value={formData.aboutPet} onChange={handleInputChange} className='py-1 outline-none w-full h-40 px-2 border-2 border-text rounded-md' placeholder='(e.g., pet health condition, pet behavior)'></textarea>
                        </div>
                    </div>
                    <div className='w-full my-5'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* OWNER INFO */}
                    <div className='flex flex-col mb-5 gap-3'>
                        <p className='text-2xl font-semibold pb-3'>Owner's Information</p>
                        <div className='flex flex-col xl:flex-row xl:gap-3'>
                            <div className='flex w-full gap-3 pb-5 xl:pb-3'>
                                <div className='w-[75%]'>
                                    <p className='font-semibold'>Full Name</p>
                                    <input name="ownerName" value={formData.ownerName} onChange={handleInputChange} required className='py-1 outline-none capitalize w-full px-2 border-2 border-text rounded-md' type="text" />
                                </div>
                                <div className='flex flex-col w-[25%]'>
                                    <p className='font-semibold'>Age</p>
                                    <input name="ownerAge" value={formData.ownerAge} onChange={handleInputChange} required className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' type="number" />
                                </div>
                            </div>
                            <div className='flex w-full gap-3 pb-2'>
                                <div className='w-[40%]'>
                                    <p className='font-semibold'>Gender</p>
                                    <select name="ownerGender" value={formData.ownerGender} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                        <option className="text-text py-2" value="Male">Male</option>
                                        <option className="text-text py-2" value="Female">Female</option>
                                    </select>
                                </div>
                                <div className='flex flex-col w-[60%]'>
                                    <p className='font-semibold'>Contact No.</p>
                                    <input required name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' type="number" />
                                </div>
                            </div>
                        </div>
                        <div className='w-full gap-3 pb-2'>
                            <p className='font-semibold'>Location</p>
                            <input name="location" value={formData.location} onChange={handleInputChange} required className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' type="text" />
                        </div>
                    </div>
                    <div className='w-full my-5'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* FREQUENTLY ASKED QUESTIONS */}
                    <div className='flex flex-col mb-5 gap-3'>
                        <p className='text-2xl font-semibold pb-3'>Frequently Asked Questions</p>
                        <div className='flex flex-col xl:gap-3'>
                            <div className='w-full gap-3 pb-5 xl:pb-3'>
                                <p className='font-semibold'>How much the adoption fee for the pet?</p>
                                <input name="adoptionFee" value={formData.adoptionFee} onChange={handleInputChange} required className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' type="text" />
                            </div>
                            <div className='w-full gap-3 pb-5 xl:pb-3'>
                                <p className='font-semibold'>Is the pet good with kids?</p>
                                <input name="goodWithKids" value={formData.goodWithKids} onChange={handleInputChange} required className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' type="text" />
                            </div>
                            <div className='w-full gap-3 pb-5 xl:pb-3'>
                                <p className='font-semibold'>Is the pet good with other animals?</p>
                                <input name="goodWithAnimals" value={formData.goodWithAnimals} onChange={handleInputChange} required className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' type="text" />
                            </div>
                            <div className='w-full gap-3 pb-5 xl:pb-3'>
                                <p className='font-semibold'>When and where can I adopt the pet?</p>
                                <input name="timeAndPlace" value={formData.timeAndPlace} onChange={handleInputChange} required className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' type="text" />
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex pb-5 justify-center'>
                        <button type='submit' disabled={isSubmitting} className='text-center bg-primary hover:bg-primaryHover px-5 py-2 rounded-md font-medium text-white'>{isSubmitting ? 'POSTING...' : 'POST'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostPet