import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import LoadingScreen from './LoadingScreen';
import defaultProfile from '../../assets/icons/default-profile.svg';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    useEffect(() => {
        let handleBeforeUnload;
    
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                if (!currentUser.emailVerified) {
                    setUser(null);
                    setIsLoading(false);
                    return;
                }
    
                setUser(currentUser);
    
                const userRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userRef);
    
                if (userDoc.exists()) {
                    const userDataFromFirestore = userDoc.data();
    
                    // Convert Firestore Timestamp to JavaScript Date
                    const lastActive = userDataFromFirestore.lastActive;
                    const now = new Date();
                    console.log("Current time:", now);
    
                    // Ensure the lastActive field exists and is a Firestore Timestamp
                    const isUserInactive = (lastActive) => {
                        if (lastActive && lastActive.seconds) {
                            const lastActiveDate = new Date(lastActive.seconds * 1000); // Convert Firestore Timestamp to Date
                            const differenceInMinutes = (now - lastActiveDate) / (1000 * 60);
                            console.log("Last active time:", lastActiveDate);
                            console.log("Time difference in minutes:", differenceInMinutes);
                            return differenceInMinutes > 1; // Inactive if > 1 minute
                        }
                        return true; // If no lastActive, consider user as inactive
                    };

                    
                    // If the user is inactive (lastActive > 1 minute ago), set isActive to false
                    if (isUserInactive(lastActive)) {
                        await updateDoc(userRef, { isActive: false });
                    }
    
                    // Set isActive to true and update lastActive timestamp when user logs in
                    await updateDoc(userRef, { isActive: true, lastActive: serverTimestamp() });
    
                    setUserData(userDataFromFirestore);
    
                    // Handle tab/browser close
                    handleBeforeUnload = async () => {
                        try {
                            await updateDoc(userRef, { isActive: false, lastActive: serverTimestamp() });
                        } catch (error) {
                            console.error("Error updating isActive on unload:", error);
                        }
                    };
    
                    window.addEventListener('beforeunload', handleBeforeUnload);
                } else {
                    await signOut(auth);
                    return;
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setIsRoleLoading(false);
            setIsLoading(false);
        });
    
        return () => {
            if (handleBeforeUnload) {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            }
            unsubscribe();
        };
    }, []);


    if (isLoading || isRoleLoading) {
        return <LoadingScreen />;  // Display loading screen while checking auth status
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, setIsLoading, userData, isRoleLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
