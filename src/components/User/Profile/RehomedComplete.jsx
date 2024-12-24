import React, { useContext } from 'react';
import { AuthContext } from '../../General/AuthProvider';
import paw from './assets/white-paw.svg';
import { collection, doc, getDocs, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { confirm, successAlert } from '../../General/CustomAlert';
import { useNavigate } from 'react-router-dom';
import rehomed from './assets/rehomed.png';

function RehomedComplete({ data, pet, adopter, isMeetup }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const RehomeComplete = async () => {
        confirm(`Rehome Complete`, `Are you sure rehoming ${pet.petName} is completed?`).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const batch = writeBatch(db);
                    const rehomedRef = doc(collection(db, 'rehomedPets'));
                    const rehomedID = rehomedRef.id;

                    // Step 1: Store the application to `rehomedPets`
                    const rehomedData = {
                        rehomedID: rehomedID,
                        adopterUserID: data.adopterUserID,
                        ownerUserID: pet.userID,
                        meetupSchedule: data.meetupSchedule,
                        timestamp: serverTimestamp(),
                        adopterDetails: {
                            profilePictureURL: adopter.profilePictureURL,
                            acceptedDate: data.acceptedDate,
                            adopterEmail: data.adopterEmail,
                            adopterFirstName: data.adopterFirstName,
                            adopterLastName: data.adopterLastName,
                            adopterMI: data.adopterMI,
                            adopterAge: data.age,
                            adopterContact: data.contactNumber,
                            adopterBirthday: data.dateOfBirth,
                            dateSubmitted: data.dateSubmitted,
                            houseNo: data.houseNo,
                            barangay: data.barangay,
                            municipality: data.municipality,
                            adopterGender: data.gender,
                            adopterOccupation: data.occupation,
                        },
                        petDetails: {
                            aboutPet: pet.aboutPet,
                            petAge: pet.age,
                            color: pet.color,
                            ownerContact: pet.contactNumber,
                            ownerGender: pet.ownerGender,
                            petGender: pet.gender,
                            houseNo: pet.houseNo,
                            barangay: pet.barangay,
                            municipality: pet.municipality,
                            ownerAge: pet.ownerAge,
                            ownerFirstName: pet.ownerFirstName,
                            ownerLastName: pet.ownerLastName,
                            ownerMI: pet.ownerMI,
                            ownerEmail: data.petOwnerEmail,
                            petImages: pet.petImages,
                            petName: pet.petName,
                            petType: pet.petType,
                            petSize: pet.size,
                            timePosted: pet.timePosted,
                        },
                    };
                    batch.set(rehomedRef, rehomedData);

                    // Step 2: Delete the application from `adoptionApplications`
                    const adoptionApplicationRef = doc(db, 'adoptionApplications', data.applicationID);
                    batch.delete(adoptionApplicationRef);

                    // Step 3: Notify both users that rehoming is completed
                    const petImage = pet.petImages && pet.petImages.length > 0 ? pet.petImages[0] : rehomed;

                    const petOwnerNotificationRef = doc(collection(db, 'notifications'));
                    const adopterNotificationRef = doc(collection(db, 'notifications'));
                    
                    const notificationDataTemplate = {
                        rehomed: true,
                        applicationID: rehomedID,
                        content: `has been successfully rehomed!`,
                        isRead: false,
                        image: petImage,
                        type: 'rehome',
                        timestamp: serverTimestamp(),
                    };
                    
                    batch.set(petOwnerNotificationRef, {
                        ...notificationDataTemplate,
                        senderID: data.adopterUserID,
                        userId: data.petOwnerID,
                        senderName: pet.petName,
                    });
                    
                    batch.set(adopterNotificationRef, {
                        ...notificationDataTemplate,
                        senderID: data.petOwnerID,
                        userId: data.adopterUserID,
                        senderName: pet.petName,
                    });

                    // Step 4: Move remaining applications to `closedApplications` and notify users
                    const applicationsQuery = query(
                        collection(db, 'adoptionApplications'),
                        where('petID', '==', data.petID),
                        where('status', '!=', 'accepted')
                    );
                    const applicationsSnapshot = await getDocs(applicationsQuery);

                    applicationsSnapshot.forEach((appDoc) => {
                        const applicationData = appDoc.data();
                        const closedApplicationRef = doc(db, 'closedApplications', appDoc.id);

                        // Move to `closedApplications`
                        batch.set(closedApplicationRef, {
                            ...applicationData,
                            petImage: petImage,
                            status: 'closed',
                            timestamp: serverTimestamp(),
                        });

                        // Delete from adoptionApplications
                        const adoptionAppRef = doc(db, 'adoptionApplications', appDoc.id);
                        batch.delete(adoptionAppRef);

                        // Notify user of closed application
                        const notificationRef = doc(collection(db, 'notifications'));
                        batch.set(notificationRef, {
                            image: petImage,
                            userId: applicationData.adopterUserID,
                            content: `adoption application for ${pet.petName} has been closed.`,
                            isRead: false,
                            senderName: 'Your',
                            senderId: user.uid,
                            timestamp: serverTimestamp(),
                            type: 'closed',
                            applicationID: applicationData.applicationID,
                        });
                    });

                    // Step 5: Delete all related notifications for the current applicationID
                    const notificationsQuery = query(
                        collection(db, 'notifications'),
                        where('applicationID', '==', data.applicationID)
                    );
                    const notificationsSnapshot = await getDocs(notificationsQuery);

                    notificationsSnapshot.forEach((notificationDoc) => {
                        batch.delete(notificationDoc.ref);
                    });

                     // Delete all notifications related to the petID
                     const petNotificationsQuery = query(
                        collection(db, 'notifications'),
                        where('petId', '==', data.petID)
                    );
                    const petNotificationsSnapshot = await getDocs(petNotificationsQuery);

                    petNotificationsSnapshot.forEach((notificationDoc) => {
                        batch.delete(notificationDoc.ref);
                    });

                    // Step 6: Delete from `acceptedApplications`
                    const acceptedApplicationRef = doc(db, 'acceptedApplications', data.applicationID);
                    batch.delete(acceptedApplicationRef);

                    // Step 7: Delete the pet information from `petsForAdoption`
                    const petsForAdoptionRef = doc(db, 'petsForAdoption', data.petID);
                    batch.delete(petsForAdoptionRef);

                    // Commit all operations in a batch
                    await batch.commit();
                    successAlert(`${pet.petName} successfully rehomed!`);
                    navigate(`/dashboard/profile/applications/rehomed/${rehomedID}`);

                } catch (error) {
                    console.error("Error completing rehoming process: ", error);
                }
            }
        });
    };

    const today = new Date();
    const scheduleDate = new Date(data?.meetupSchedule?.meetUpDate);

    today.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);

    console.log(scheduleDate <= today)


    return (
        <div>
            <button
                onClick={RehomeComplete}
                className={`${scheduleDate <= today && data.petOwnerID === user.uid ? 'flex' : 'hidden'} bg-[#84B725] hover:bg-[#76a321] text-xs md:text-base cursor-pointer duration-150 items-center font-medium gap-2 text-white p-2 rounded-md`}
            >
                <img className="w-5 h-5" src={paw} alt="" />
                Rehome Complete
            </button>
        </div>
    );
}

export default RehomedComplete;
