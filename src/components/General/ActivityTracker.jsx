import React, { useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from './AuthProvider'; // Import your AuthProvider to get the current user

const ActivityTracker = () => {
    const { user } = useAuth();

    useEffect(() => {
        let timeoutId;

        const updateLastActive = async () => {
            if (user) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    await updateDoc(userRef, {
                        lastActive: serverTimestamp(),
                    });
                } catch (error) {
                    console.error('Failed to update lastActive:', error);
                }
            }
        };

        const resetTimeout = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateLastActive, 3000); // Update every 1 second
        };

        // Listeners for user activity
        window.addEventListener('mousemove', resetTimeout);
        window.addEventListener('keydown', resetTimeout);
        window.addEventListener('click', resetTimeout);

        // Start tracking
        resetTimeout();

        // Cleanup listeners
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', resetTimeout);
            window.removeEventListener('keydown', resetTimeout);
            window.removeEventListener('click', resetTimeout);
        };
    }, [user]);

    return null; // No UI needed for this tracker
};

export default ActivityTracker;
