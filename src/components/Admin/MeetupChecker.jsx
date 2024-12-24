import { Timestamp, collection, query, where, getDocs, getDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import paws from './assets/paws.svg';
import { db } from '../../firebase/firebase';
import { useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const MeetupChecker = () => {
    const hasCheckedRef = useRef(false); // To track if the check has already run

    // Function to send email notifications using EmailJS
    const sendEmailNotification = async (recipientEmail, subject, message) => {
        try {
            const templateParams = {
                subject: subject,
                message: message,
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

    useEffect(() => {
        const checkMeetups = async () => {
            // Return early if we've already checked
            if (hasCheckedRef.current) return;
    
            hasCheckedRef.current = true; // Mark as checked
    
            const today = new Date().toISOString().split('T')[0];
            console.log('checkMeetups started:', today);
    
            const applicationRef = collection(db, 'acceptedApplications');
            const q = query(
                applicationRef,
                where('meetupSchedule.meetUpDate', '==', today),
                where('meetupNotified', '==', false)
            );
    
            try {
                const querySnapshot = await getDocs(q);
                console.log('Found meetings:', querySnapshot.size);
    
                if (!querySnapshot.empty) {
                    const batch = writeBatch(db);
    
                    // Helper function to check inactivity and send email
                    const checkAndSendEmail = async (userID, email, content) => {
                        const userDocRef = doc(db, 'users', userID);
                        const userDocSnap = await getDoc(userDocRef);
                        const userData = userDocSnap.data();
    
                        if (userData && userData.lastActive) {
                            const now = Timestamp.now();
                            const lastActive = userData.lastActive;
                            const differenceInMinutes = (now.toMillis() - lastActive.toMillis()) / (1000 * 60);
    
                            if (differenceInMinutes >= 3) {
                                // Send email notification
                                await sendEmailNotification(email, 'Today is the day!', content);
                            }
                        }
                    };
    
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
                            content: `is your meet-up with ${data.adopterFirstName}.`,
                            applicationID: docSnap.id,
                            senderName: 'Today',
                            type: 'adoption',
                            image: paws,
                            senderId: data.adopterUserID,
                            userId: data.petOwnerID,
                            accepted: true,
                            isRead: false,
                            timestamp: serverTimestamp(),
                        });
    
                        // Update the application status
                        const applicationRef = doc(db, 'acceptedApplications', docSnap.id);
                        batch.update(applicationRef, {
                            meetupNotified: true,
                            status: 'meetup',
                        });
    
                        // Send email notifications
                        const adopterContent = `Today is your meet-up with ${data.petName}.\nClick here: https://paws-ae1eb.web.app/`;
                        const petOwnerContent = `Today is your meet-up with ${data.adopterFirstName}.\nClick here: https://paws-ae1eb.web.app/`;
    
                        await Promise.all([
                            checkAndSendEmail(data.adopterUserID, data.adopterEmail, adopterContent),
                            checkAndSendEmail(data.petOwnerID, data.petOwnerEmail, petOwnerContent),
                        ]);
                    }
    
                    // Commit the batch after processing all meet-ups
                    await batch.commit();
                    console.log('Batch write completed successfully.');
                } else {
                    console.log('No meet-ups scheduled for today or all notifications sent.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        checkMeetups();
    }, []);

    return null;
};

export default MeetupChecker;
