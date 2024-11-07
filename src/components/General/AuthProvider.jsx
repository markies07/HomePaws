import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import LoadingScreen from './LoadingScreen';
import defaultProfile from '../../assets/icons/default-profile.svg';
import { errorAlert } from './CustomAlert';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

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

                    // Check if the user is in the deactivatedUsers collection
                    const q = query(collection(db, 'deactivatedUsers'), where('userID', '==', currentUser.uid));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        // User is deactivated, force sign out
                        await signOut(auth);
                        return;
                    }
                    
                    setUserData(userDataFromFirestore);
                }
                else {
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

    if (isLoading || isRoleLoading) {
        return <LoadingScreen />;  // Display loading screen while checking auth status
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, setIsLoading, userData, isRoleLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
