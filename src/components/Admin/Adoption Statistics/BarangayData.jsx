import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase"; // Adjust the path to match your project structure

const GENERAL_TRIAS_BARANGAYS = [
  "Alingaro",
  "Arnaldo Poblacion",
  "Bacao I",
  "Bacao II",
  "Bagumbayan Poblacion",
  "Biclatan",
  "Buenavista I",
  "Buenavista II",
  "Buenavista III",
  "Corregidor Poblacion",
  "Dulong Bayan Poblacion",
  "Gov. Ferrer Poblacion",
  "Javalera",
  "Manggahan",
  "Navaro",
  "Ninety Sixth Poblacion",
  "Panungyanan",
  "Pasong Camachile I",
  "Pasong Camachile II",
  "Pasong Kawayan I",
  "Pasong Kawayan II",
  "Pinagtipunan",
  "Prinza Poblacion",
  "Sampalucan Poblacion",
  "San Francisco",
  "San Gabriel Poblacion",
  "San Juan I",
  "San Juan II",
  "Santa Clara",
  "Santiago",
  "Tapia",
  "Tejero",
  "Vibora Poblacion",
];

export const fetchBarangayData = async () => {
    const barangayCountsForAdoption = {};
    const barangayCountsRehomed = {};
  
    try {
      const adoptionSnapshot = await getDocs(collection(db, "petsForAdoption"));
      const rehomedSnapshot = await getDocs(collection(db, "rehomedPets"));
  
      // Count pets for adoption by barangay
      adoptionSnapshot.forEach((doc) => {
        const { barangay } = doc.data();
        if (barangay && GENERAL_TRIAS_BARANGAYS.includes(barangay)) {
          barangayCountsForAdoption[barangay] =
            (barangayCountsForAdoption[barangay] || 0) + 1;
        }
      });
  
      // Count rehomed pets by barangay
      rehomedSnapshot.forEach((doc) => {
        const barangay = doc.data().adopterDetails?.barangay;
        if (barangay && GENERAL_TRIAS_BARANGAYS.includes(barangay)) {
          barangayCountsRehomed[barangay] =
            (barangayCountsRehomed[barangay] || 0) + 1;
        }
      });
  
      return {
        adoptionCounts: barangayCountsForAdoption,
        rehomedCounts: barangayCountsRehomed,
      };
    } catch (error) {
      console.error("Error fetching barangay data: ", error);
      throw error;
    }
  };
  
