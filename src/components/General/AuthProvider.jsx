import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import LoadingScreen from './LoadingScreen';
import defaultProfile from '../../assets/icons/default-profile.svg';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    const preloadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
                resolve(); // Resolve even if loading fails
            };
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                if (!currentUser.emailVerified) {
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                setUser(currentUser);

                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const userDataFromFirestore = userDoc.data();

                    // Handle profile picture
                    if (!userDataFromFirestore.profilePictureURL) {
                        userDataFromFirestore.profilePictureURL = defaultProfile;
                    } else {
                        await preloadImage(userDataFromFirestore.profilePictureURL);
                    }

                    // Check if the user is deactivated
                    const q = query(collection(db, 'deactivatedUsers'), where('userID', '==', currentUser.uid));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        await signOut(auth);
                        return;
                    }

                    setUserData(userDataFromFirestore);
                } else {
                    await signOut(auth);
                    return;
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setIsLoading(false);
            setIsRoleLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Update lastActive timestamp
    useEffect(() => {
        let interval;
        if (user) {
            const updateLastActive = async () => {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    await updateDoc(userRef, { lastActive: new Date() });
                } catch (error) {
                    console.error('Failed to update lastActive:', error);
                }
            };

            interval = setInterval(updateLastActive, 60000);
            updateLastActive();
        }

        return () => clearInterval(interval);
    }, [user]);

    if (isLoading || isRoleLoading) {
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, setIsLoading, userData, isRoleLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
