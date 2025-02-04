import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close.svg'
import dog from '../assets/dog.svg'
import cat from '../assets/cat.svg'
import both from '../assets/both.svg'
import looking from '../assets/looking.svg'
import { AuthContext } from '../../General/AuthProvider';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../../../firebase/firebase'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast'
import selectedDog from './assets/selectedDog.svg'
import selectedCat from './assets/selectedCat.svg'
import selectedBoth from './assets/selectedBoth.svg'
import selectedLooking from './assets/selectedLooking.svg'


function EditProfile({closeEdit, openVerify}) {
    const { userData, user } = useContext(AuthContext);
    const [fullName, setFullName] = useState('');
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState('');
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [petOwnerType, setPetOwnerType] = useState('');
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                const userInfo = docSnap.data();
                setFullName(userInfo.fullName);
                setProfilePictureURL(userInfo.profilePictureURL);
                setPetOwnerType(userInfo.petOwnerType);
            }
            else {
                console.log('No such document!');
            }
        }

        fetchUserData();
    }, [user.uid])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewProfilePicture(file);
        setPreview(URL.createObjectURL(file));
    }

    const handleSaveChanges = async () => {
        setLoading(true);

        if(fullName.trim() === ''){
            notifyErrorOrange('Please input your full name!');
            setLoading(false);
            return;
        }

        try{
            const userRef = doc(db, 'users', user.uid);
            let updatedData = {
                fullName,
                petOwnerType,
            }

            if (newProfilePicture) {
                const storageRef = ref(storage, `profilePictures/${newProfilePicture.name}`);
                const uploadTask = uploadBytesResumable(storageRef, newProfilePicture);
        
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.error(error); // Handle upload error
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        updatedData.profilePictureURL = downloadURL;
        
                        // Wait until the upload is done and then update the Firestore document
                        await updateDoc(userRef, updatedData);
        
                        // Update the local state
                        setProfilePictureURL(downloadURL);
                        console.log("Profile updated successfully!");
                        notifySuccessOrange("Profile updated successfully!");
                        setLoading(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                );
            } else {
                // If no new profile picture, update the document directly
                await updateDoc(userRef, updatedData);
                console.log("Profile updated successfully!");
                notifySuccessOrange("Profile updated successfully!");
                setLoading(false);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }
        catch(error){
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        
        const checkVerificationStatus = async () => {
            try {
                const verificationRef = collection(db, 'pendingVerification');

                // Create a query to find the application with the current user and petID
                const q = query(
                    verificationRef,
                    where('userID', '==', user.uid),
                );

                // Execute the query
                const querySnapshot = await getDocs(q);

                // Check if there are any matching documents
                if (!querySnapshot.empty) {
                    setIsPending(true)  // User has already applied
                }
                else {
                    setIsPending(false);
                }
                console.log(querySnapshot)
            } catch (error) {
                console.error("Error checking application status: ", error);
            }
        };

        checkVerificationStatus();
        
    }, []);


    return (
        <div className='p-3 lg:pt-3 lg:px-0 min-h-[calc(100dvh-145px)] lg:min-h-[calc(100dvh-80px)] w-full'>
            <div className='bg-secondary py-3 px-5 sm:p-5 relative w-full shadow-custom h-full rounded-md lg:rounded-lg'>
                <img onClick={closeEdit} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <p className='text-2xl sm:text-3xl text-center pt-7 font-medium'>Edit Profile</p>
                
                <div className='flex flex-col items-center'>
                    <div className='w-28 h-28 sm:w-28 sm:h-28 shrink-0 bg-text mt-5 mb-3 rounded-full relative'>
                        <img className='w-full h-full object-cover rounded-full' src={preview || profilePictureURL} alt="" />
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            style={{display: 'none'}} 
                            id="profile"
                        />
                    </div>
                    <button onClick={() => document.getElementById('profile').click()} className='font-medium text-sm bg-primary rounded-md py-1 px-2 cursor-pointer hover:bg-primaryHover duration-150 text-white'>Change Profile Picture</button>

                    <div className='w-full flex flex-col gap-3 sm:w-96 py-5'>
                        <div className='w-full pb-3'>
                            <p className='font-semibold pb-1'>Full Name</p>
                            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} name="fullName" className='py-1 w-full px-2 border-2 border-text rounded-md' type="text" id="" />
                        </div>
                        <div className='w-full'>
                            <p className='font-semibold pb-2'>Type of Pet Owner</p>
                            <div className='h-full grid w-full grid-cols-2 gap-4 pb-2'>
                                <div onClick={() => setPetOwnerType('Dog Owner')} className={`${petOwnerType === 'Dog Owner' ? 'border-primary' : 'border-text'} w-full shrink-0 h-full cursor-pointer border-2 duration-150 flex flex-col justify-center items-center rounded-lg p-3 bg-secondary`}>
                                    <img className='w-14' src={petOwnerType === 'Dog Owner' ? selectedDog : dog} alt="" />
                                    <p className={`${petOwnerType === 'Dog Owner' ? 'text-primary' : ''} text-center font-medium pt-3`}>Dog Owner</p>
                                </div>
                                <div onClick={() => setPetOwnerType('Cat Owner')} className={`${petOwnerType === 'Cat Owner' ? 'border-primary' : 'border-text'} w-full shrink-0 h-full cursor-pointer border-2 duration-150 flex flex-col justify-center items-center rounded-lg p-3 bg-secondary`}>
                                    <img className='w-14 pt-[7px]' src={petOwnerType === 'Cat Owner' ? selectedCat : cat} alt="" />
                                    <p className={`${petOwnerType === 'Cat Owner' ? 'text-primary' : ''} text-center font-medium h-sm:pt-3 pt-[9px]`}>Cat Owner</p>
                                </div>
                                <div onClick={() => setPetOwnerType('Both')} className={`${petOwnerType === 'Both' ? 'border-primary' : 'border-text'} w-full shrink-0 h-full cursor-pointer border-2 duration-150 flex flex-col justify-center items-center rounded-lg p-3 bg-secondary`}>
                                    <img className='w-20' src={petOwnerType === 'Both' ? selectedBoth : both} alt="" />
                                    <p className={`${petOwnerType === 'Both' ? 'text-primary' : ''} text-center font-medium pt-3`}>Both</p>
                                </div>
                                <div onClick={() => setPetOwnerType('Looking to Adopt')} className={`${petOwnerType === 'Looking to Adopt' ? 'border-primary' : 'border-text'} w-full shrink-0 h-full cursor-pointer border-2 duration-150 flex flex-col justify-center items-center rounded-lg p-3 bg-secondary`}>
                                    <img className='w-[3rem] pt-1' src={petOwnerType === 'Looking to Adopt' ? selectedLooking : looking} alt="" />
                                    <p className={`${petOwnerType === 'Looking to Adopt' ? 'text-primary' : ''} text-center font-medium pt-3`}>Looking to Adopt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <button onClick={openVerify} disabled={isPending} className={`${userData.isVerified === false ? 'block' : 'hidden'} ${isPending ? 'text-primary' : 'bg-primary hover:bg-primaryHover text-white'} text-sm font-medium text-center my-3 py-2 px-3 sm:px-5 rounded-md duration-150 `}>{isPending ? 'Pending Verification' : 'Verify Account'}</button>
                        <button onClick={handleSaveChanges} className='bg-primary text-sm font-medium text-center my-3 py-2 px-3 sm:px-5 rounded-md hover:bg-primaryHover duration-150 text-white'>{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default EditProfile