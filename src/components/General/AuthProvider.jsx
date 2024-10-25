import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoadingScreen from './LoadingScreen';
import defaultProfile from '../../assets/icons/default-profile.svg';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {

                
                // Check if the email is verified
                if (!currentUser.emailVerified) {
                    setUser(null); // Optionally set user to null if not verified
                    setIsLoading(false);
                    return;
                }
    
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const userDataFromFirestore = userDoc.data();
                    
                    if(!userDataFromFirestore.profilePictureURL){
                        userDataFromFirestore.profilePictureURL = defaultProfile;
                    }
                    setUserData(userDataFromFirestore);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setIsLoading(false);
        });
    
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return <LoadingScreen />;  // Display loading screen while checking auth status
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, setIsLoading, userData }}>
            {children}
        </AuthContext.Provider>
    );
};
