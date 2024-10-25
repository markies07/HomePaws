import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../../firebase/firebase'; 
import { collection, query, where, getDocs, addDoc, deleteDoc } from "firebase/firestore"; 
import { AuthContext } from '../../General/AuthProvider';
import unfavorite from '../../../assets/icons/unfavorite.svg'
import favorite from '../../../assets/icons/favorite.svg'

const FavoritePet = ({ petID, petOwner }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const {user} = useContext(AuthContext);

  // Check if the pet is already favorited when the component mounts
  useEffect(() => {
    const checkIfFavorited = async () => {
      try {
        // Reference to the 'favoritePets' collection
        const favoriteRef = collection(db, 'favoritePets');
        
        // Query to check if this pet is already favorited by the user
        const q = query(favoriteRef, where('userID', '==', user.uid), where('petID', '==', petID));
        
        // Execute the query
        const snapshot = await getDocs(q);
        
        // If a document exists, the pet is already favorited
        setIsFavorited(!snapshot.empty);
      } catch (error) {
        console.error("Error checking favorite status: ", error);
      }
    };

    checkIfFavorited();
  }, [petID, user.uid]);

  // Function to handle the click on the paw icon
  const toggleFavorite = async () => {
    const favoriteRef = collection(db, 'favoritePets');

    try {
      if (isFavorited) {
        // If already favorited, find the document and delete it
        const q = query(favoriteRef, where('userID', '==', user.uid), where('petID', '==', petID));
        const snapshot = await getDocs(q);

        // Loop through documents and delete them
        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);  // Delete the document
        });

        setIsFavorited(false);  // Update the state to unfavorited
      } else {
        // If not favorited, add the pet to the 'favoritePets' collection
        await addDoc(favoriteRef, {
          userID: user.uid,
          petID: petID,
          timestamp: new Date()  // Optionally, track when it was added
        });

        setIsFavorited(true);  // Update the state to favorited
      }
    } catch (error) {
      console.error("Error updating favorite status: ", error);
    }
  };

  return (
    <button className={petOwner === user.uid ? 'hidden' : 'block'} onClick={toggleFavorite}>
      {/* Change icon based on whether the pet is favorited */}
      <img className='opacity-95 hover:opacity-100 duration-150 bg-[#FAFAFA] w-12 h-12 rounded-full p-2' src={ isFavorited ? favorite : unfavorite} alt="" />  {/* Replace with your paw icon */}
    </button>
  );
};

export default FavoritePet;