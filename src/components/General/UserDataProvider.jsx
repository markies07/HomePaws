import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { AuthContext } from "./AuthProvider";
import { doc, getDoc } from "firebase/firestore";

export const UserDataContext = createContext();

export const useUserData = () => {
  return useContext(UserDataContext);
};

export const UserDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Get the current authenticated user from the AuthProvider
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid) // Replace 'users' with your collection name
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.error('User data not found in Firestore');
          }
        }
      } catch (error) {
        console.error('Error fetching user data from Firestore: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);


  return (
    <UserDataContext.Provider value={{ userData, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};
