import React, { useContext } from 'react'
import { AuthContext } from '../../General/AuthProvider'
import paw from './assets/white-paw.svg'
import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { confirm, successAlert } from '../../General/CustomAlert';
import { useNavigate } from 'react-router-dom';
import rehomed from './assets/rehomed.svg';

function RehomedComplete({data, pet}) {
    const {user} = useContext(AuthContext);
    const navigation = useNavigate();

    const RehomeComplete = async () => {
        confirm(`Rehome Complete`, `Are you sure rehoming ${pet.petName} is completed?`).then(async (result) => {
            if(result.isConfirmed){
                try{
                    const batch = writeBatch(db);

                    const rehomedRef = doc(collection(db, 'rehomedPets'));
                    const rehomedID = rehomedRef.id;
        
                    const rehomedData = {
                        rehomedID: rehomedID,
                        adopterUserID: data.adopterUserID,
                        ownerUserID: pet.userID,
                        adopterDetails: {
                            acceptedDate: data.acceptedDate,
                            adopterEmail: data.adopterEmail,
                            adopterName: data.adopterName,
                            adopterAge: data.age,
                            adopterCommitment: data.commitment,
                            adopterContact: data.contactNumber,
                            adopterBirthday: data.dateOfBirth,
                            dateSubmitted: data.dateSubmitted,
                            adopterName: data.adopterName,
                            adopterAddress: data.fullAddress,
                            adopterGender: data.gender,
                            adopterName: data.adopterName,
                            adopterOccupation: data.occupation,
                            adopterName: data.adopterName
                        },

                        petDetails: {
                            aboutPet: pet.aboutPet,
                            adoptionFee: pet.adoptionFee,
                            petAge: pet.age,
                            aboutPet: pet.aboutPet,
                            breed: pet.breed,
                            color: pet.color,
                            ownerContact: pet.contactNumber,
                            ownerGender: pet.ownerGender,
                            petGender: pet.gender,
                            location: pet.location,
                            ownerAge: pet.ownerAge,
                            ownerName: pet.ownerName,
                            ownerEmail: data.petOwnerEmail,
                            aboutPet: pet.aboutPet,
                            petImages: pet.petImages,
                            petName: pet.petName,
                            petType: pet.petType,
                            petSize: pet.size,
                            timePosted: pet.timePosted,
                        },

                        meetupSchedule: {
                            meetupSchedule: data.meetupSchedule,
                            timestamp: serverTimestamp(),
                        }
                    };

                    // DELETE NOTIFICATIONS RELATED TO THE APPLICATION
                    const notificationsQuery = query(
                        collection(db, 'notifications'),
                        where('applicationID', '==', data.applicationID)
                    );
                    try {
                        const notificationsSnapshot = await getDocs(notificationsQuery);
                    
                        // Check if any documents were returned
                        if (!notificationsSnapshot.empty) {
                            notificationsSnapshot.forEach((notificationDoc) => {
                                batch.delete(notificationDoc.ref);
                            });
                            console.log(`Deleted ${notificationsSnapshot.size} notifications for applicationID: ${data.applicationID}`);
                        } else {
                            console.warn(`No notifications found for applicationID: ${data.applicationID}`);
                        }
                    } catch (error) {
                        console.error('Error deleting notifications: ', error);
                    }

                    // ADD A NEW NOTIFICATION (Pet successfully rehomed)
                    const petOwnerNotificationRef  = doc(collection(db, 'notifications'));
                    const adopterNotificationRef = doc(collection(db, 'notifications'));

                    const petOwnerNotificationData = {
                        rehomed: true,
                        applicationID: rehomedID, // rehomedID is now the applicationID in rehomedPets
                        content: `has been successfully rehomed!`,
                        isRead: false,
                        image: rehomed, // You can change this based on who should receive the notification
                        type: 'rehome',
                        senderID: data.adopterUserID,
                        userId: data.petOwnerID,
                        senderName: pet.petName,
                        timestamp: serverTimestamp(),
                    };

                    const adopterNotificationData = {
                        rehomed: true,
                        applicationID: rehomedID, // rehomedID is now the applicationID in rehomedPets
                        content: `has been successfully rehomed!`,
                        isRead: false,
                        image: rehomed, // You can change this based on who should receive the notification
                        type: 'rehome',
                        senderID: data.petOwnerID,
                        userId: data.adopterUserID,
                        senderName: pet.petName,
                        timestamp: serverTimestamp(),
                    };

                    // ADDING BOTH NOTIFICATIONS TO BATCH
                    batch.set(petOwnerNotificationRef, petOwnerNotificationData);
                    batch.set(adopterNotificationRef, adopterNotificationData);
        
                    // STORING IN FIRESTORE
                    batch.set(rehomedRef, rehomedData);
        
                    // DELETING IN ADOPTION APPLICATIONS
                    const adoptionApplicationRef = doc(db, 'adoptionApplications', data.applicationID);
                    batch.delete(adoptionApplicationRef);

                    // DELETING IN ACCEPTED APPLICATIONS
                    const acceptedApplicationRef = doc(db, 'acceptedApplications', data.applicationID);
                    batch.delete(acceptedApplicationRef);
        
                    // DELETING PET FOR ADOPTION
                    const petsForAdoptionRef = doc(db, 'petsForAdoption', data.petID);
                    batch.delete(petsForAdoptionRef);
        
                    await batch.commit();
                    successAlert(`${pet.petName} successfully rehomed!`);
                    navigation(`/dashboard/profile/applications/rehomed/${rehomedID}`);
        
                }
                catch(error){
                    console.error(error);
                }
            }
        })
    }

    return (
        <div>
            <button onClick={RehomeComplete} className={`${data.status === 'meetup' && data.petOwnerID === user.uid ? 'flex' : 'hidden'} bg-[#84B725] hover:bg-[#76a321] text-xs md:text-base cursor-pointer duration-150  items-center font-medium gap-2 text-white p-2 rounded-md`}><img className='w-5 h-5' src={paw} alt="" />Rehome Complete</button>
        </div>
    )
}

export default RehomedComplete