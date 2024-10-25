import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { AuthContext } from "./AuthProvider";
import { doc, getDoc } from "firebase/firestore";

export const AdoptionDataContext = createContext();

export const useUserData = () => {
  return useContext(AdoptionDataContext);
};

export const AdoptionDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Get the current authenticated user from the AuthProvider
  const [adoptionData, setAdoptionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdoptionData = async () => {
      try {
        if (user) {
          const adoptionDocRef = doc(db, 'adoptionApplications', user.uid) 
          const adoptionDoc = await getDoc(adoptionDocRef);

          if (adoptionDoc.exists) {
            setAdoptionData(adoptionDoc.data());
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

    fetchAdoptionData();
  }, [user]);


  return (
    <AdoptionDataContext.Provider value={{ adoptionData, loading }}>
      {children}
    </AdoptionDataContext.Provider>
  );
};
