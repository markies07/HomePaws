import { getDocs, collection, where, query, doc, addDoc, serverTimestamp, Timestamp, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase'

// Function to check and send follow-up notifications
export const checkFollowUps = async ({ userID }) => {
  if (!userID) {
    console.error("Invalid userID passed to checkFollowUps:", userID);
    return { error: "Invalid userID" };
  }

  try {
    // Get eligible follow-ups for this user
    const followUpsRef = collection(db, "followUps");
    const q = query(
      followUpsRef, 
      where("adopterID", "==", userID), 
      where("notificationsSent", "<", 4)
    );
    
    const querySnapshot = await getDocs(q);
    let notificationsSent = 0;
    
    for (const docSnap of querySnapshot.docs) {
      const followUpRef = doc(db, "followUps", docSnap.id);
      const followUp = docSnap.data();
      followUp.id = docSnap.id;
      
      // Safely access nextNotificationDate
      let nextNotificationDate;
      if (followUp.nextNotificationDate) {
        if (followUp.nextNotificationDate.toDate) {
          nextNotificationDate = followUp.nextNotificationDate.toDate();
        } else {
          nextNotificationDate = new Date(followUp.nextNotificationDate);
        }
      } else {
        nextNotificationDate = new Date(Date.now() - 1); // Default to past date to trigger notification
      }
      
      // Check if it's time to send notification
      if (new Date() >= nextNotificationDate) {
        // Send the notifications
        await sendNotification(followUp);
        notificationsSent++;
        
        // Update the follow-up document
        const newNotificationsSent = (followUp.notificationsSent || 0) + 1;
        if (newNotificationsSent >= 4) {
          await deleteDoc(followUpRef);
        } else {
          await updateDoc(followUpRef, {
            notificationsSent: newNotificationsSent,
            nextNotificationDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
          });
        }
      }
    }
    
    return { processed: notificationsSent };
  } catch (error) {
    console.error("Error in checkFollowUps:", error);
    return { error: error.message };
  }
};

// Function to send notifications to the adopter and previous pet owner
const sendNotification = async (followUp) => {
  if (!followUp.previousOwnerID || !followUp.adopterID || !followUp.petName) {
    console.error("Missing required fields in followUp:", followUp);
    return false;
  }
  
  try {
    // Send to previous owner
    await addDoc(collection(db, "notifications"), {
      content: `on ${followUp.petName}'s new home! Ask for an update from the adopter.`,
      senderName: "Follow up",
      type: 'followup',
      image: followUp.petImage || null,
      senderId: followUp.adopterID,
      timestamp: serverTimestamp(),
      isRead: false,
      userId: followUp.previousOwnerID,
    });

    // Send to adopter
    await addDoc(collection(db, "notifications"), {
      content: `the previous owner about ${followUp.petName}.`,
      senderName: "Please update",
      type: 'followup',
      image: followUp.petImage || null,
      senderId: followUp.previousOwnerID,
      timestamp: serverTimestamp(),
      isRead: false,
      userId: followUp.adopterID,
    });
    
    return true;
  } catch (error) {
    console.error("Error sending notifications:", error);
    return false;
  }
};