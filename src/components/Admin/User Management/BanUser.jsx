import React, { useRef } from 'react'
import { ban, successAlert } from '../../General/CustomAlert';
import emailjs from '@emailjs/browser';
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import banned from './assets/ban-white.svg';

function BanUser({ userName, userEmail, data }) {
    const form = useRef();
    const navigate = useNavigate();

    console.log(userName);

    const banUser = (e) => {
        e.preventDefault();
    
        ban(`Banning This User`, `Are you sure you want to ban ${userName}?<br><br> <span style='font-size: .85rem;'><strong>Note:</strong> All of the data of this user will be deleted.</span>`).then(async (result) => {
            if (result.isConfirmed) {

                try{
                    const formData = new FormData(form.current);
                    formData.append('email', userEmail); // Ensure email is added to form data
        
                    console.log('Form Data:', Object.fromEntries(formData.entries())); // Log form data
        
                    emailjs
                        .sendForm('service_yii1sji', 'template_eti1vex', form.current, 'JT0EGxZqCSR3-9IIa')
                        .then(
                            () => {
                                console.log('SUCCESS!');
                                successAlert(`${userName} has been banned from HomePaws!`);
                            },
                            (error) => {
                                console.log('FAILED...', error.text);
                            }
                        );
    
    
                    const userRef = doc(db, 'users', data.uid);

                    const userSnapshot = await getDoc(userRef);
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data();
                        await setDoc(doc(db, 'bannedUsers', data.uid), {
                            ...userData,
                            bannedAt: serverTimestamp()
                        });
                    }
    
                    // DELETE USER ACTIVITIES
                    await deleteActivities();

                    // DELETE USER ACTIVITIES
                    await deleteApplications();

                    // DELETE NOTIFICATIONS
                    await deleteNotifications();

                    // CLOSE OTHER APPLICATIONS
                    await closeApplicationsForBannedUser();
    
                    // DELETE USER FROM USERS
                    await deleteDoc(userRef);
                    console.log("User Deleted");
                    navigate('/admin/user-management');
                }
                catch(error){
                    console.error(error);
                }
            }
        });
    };

    // USER ACTIVITIES
    const deleteActivities = async () => {
        const collectionToDelete = ['userPosts', 'petsForAdoption', 'favoritePets'];

        for (const collectionName of collectionToDelete) {
            const q = query(collection(db, collectionName), where("userID", "==", data.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            })
        }
        console.log("Activities Deleted");
    } 

    // USER APPLICATIONS
    const deleteApplications = async () => {
        const collectionToDelete = ['adoptionApplications', 'acceptedApplications', 'closedApplications', 'rejectedApplications'];

        for (const collectionName of collectionToDelete) {
            const q = query(collection(db, collectionName), where("adopterUserID", "==", data.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            })
        }
        console.log("Applications Deleted");
    } 

    // MOVING USER APPLICATIONS TO CLOSE APPLICATIONS
    const closeApplicationsForBannedUser = async () => {
        const petOwnerID = data.uid; // ID of the banned user
    
        // Specify the collections to check
        const collectionsToClose = ['adoptionApplications', 'acceptedApplications'];
    
        for (const collectionName of collectionsToClose) {
            // Query applications for pets owned by the banned user
            const q = query(collection(db, collectionName), where("petOwnerID", "==", petOwnerID));
            const querySnapshot = await getDocs(q);
    
            for (const docSnapshot of querySnapshot.docs) {
                const applicationData = docSnapshot.data();

                // Selecting the first image from the petImages array or a default placeholder if the array is empty
                const petImage = applicationData.petImages && applicationData.petImages.length > 0 
                    && applicationData.petImages[0];

                // Data for closedApplications collection
                const closedAppData = { 
                    ...docSnapshot.data(), 
                    petImage: petImage,
                    status: 'closed', 
                    timestamp: serverTimestamp(),
                };
    
                // Move the application to closedApplications
                await setDoc(doc(db, 'closedApplications', docSnapshot.id), closedAppData);
    
                // Delete the original application
                await deleteDoc(docSnapshot.ref);
            }
        }
    
        console.log("Applications to banned user's pets have been moved to closedApplications and deleted from the original collections.");
    };
    

    // USER NOTIFICATIONS
    const deleteNotifications = async () => {
        // Delete notifications where senderId matches
        const senderQuery = query(
            collection(db, 'notifications'),
            where("senderId", "==", data.uid)
        );
        const senderSnapshot = await getDocs(senderQuery);
        senderSnapshot.forEach(async (docSnapshot) => {
            await deleteDoc(doc(db, 'notifications', docSnapshot.id));
        });
    
        // Delete notifications where userId matches
        const receiverQuery = query(
            collection(db, 'notifications'),
            where("userId", "==", data.uid)
        );
        const receiverSnapshot = await getDocs(receiverQuery);
        receiverSnapshot.forEach(async (docSnapshot) => {
            await deleteDoc(doc(db, 'notifications', docSnapshot.id));
        });
    
        console.log("Notifications Deleted");
    };
    

    return (
        <form className='w-full flex justify-center' ref={form} onSubmit={banUser}>
            <input className='hidden' type="text" defaultValue={`Your account has been banned in HomePaws`} name="subject" />
            <input className='hidden' type="text" defaultValue={`Hello, Your account has been banned due to policy violations.`} name="message" />
            <input className='hidden' type="text" defaultValue={userEmail} name="email" /> {/* Add this line */}
            <button type='submit' className='flex items-center text-sm bg-[#D25A5A] hover:bg-[#bb4d4d] sm:w-60 sm:px-3 sm:whitespace-nowrap duration-150 py-2 text-white rounded-md w-full leading-3 font-medium'><img className='w-7 mx-5' src={banned} alt="" />BAN USER</button>
        </form>
    );
    
}


export default BanUser