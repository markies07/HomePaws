import { collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import paws from './assets/paws.svg';
import { db } from '../../firebase/firebase';
import { useRef, useEffect } from 'react';

const MeetupChecker = () => {
    const hasCheckedRef = useRef(false); // To track if the check has already run

    useEffect(() => {
        const checkMeetups = async () => {
            // Return early if we've already checked
            if (hasCheckedRef.current) {
                return;
            }
            
            // Mark as checked immediately
            hasCheckedRef.current = true;

            const today = new Date().toISOString().split('T')[0];
            console.log('checkMeetups started:', today);

            const applicationRef = collection(db, 'acceptedApplications');
            const q = query(applicationRef, 
                where('meetupSchedule.meetUpDate', '==', today),
                where('meetupNotified', '==', false)
            );

            try {
                const querySnapshot = await getDocs(q);
                console.log('Found meetings:', querySnapshot.size);

                if (!querySnapshot.empty) {
                    const batch = writeBatch(db); // Start batch write for performance
                    for (const docSnap of querySnapshot.docs) {
                        const data = docSnap.data();

                        // Create notification for Adopter
                        const adopterNotifRef = doc(collection(db, 'notifications'));
                        batch.set(adopterNotifRef, {
                            content: `is your meet-up with ${data.petName}.`,
                            applicationID: docSnap.id,
                            senderName: 'Today',
                            type: 'adoption',
                            image: paws,
                            senderId: data.petOwnerID,
                            userId: data.adopterUserID,
                            accepted: true,
                            isRead: false,
                            timestamp: serverTimestamp(),
                        });

                        // Create notification for Pet Owner
                        const ownerNotifRef = doc(collection(db, 'notifications'));
                        batch.set(ownerNotifRef, {
                            content: `is your meet-up with ${data.adopterName}.`,
                            applicationID: docSnap.id,
                            senderName: 'Today',
                            type: 'adoption',
                            image: paws,
                            senderId: data.adopterUserID,
                            accepted: true,
                            userId: data.petOwnerID,
                            isRead: false,
                            timestamp: serverTimestamp(),
                        });

                        // Update the application status
                        const applicationRef = doc(db, 'acceptedApplications', docSnap.id);
                        batch.update(applicationRef, {
                            meetupNotified: true,
                            status: 'meetup',
                        });
                    }
                    await batch.commit(); // Commit all writes at once for better performance
                } else {
                    console.log('No meet-ups scheduled for today or all notifications sent.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        checkMeetups();
    }, []); // Empty dependency array to run only once

    return null;
};

export default MeetupChecker;
