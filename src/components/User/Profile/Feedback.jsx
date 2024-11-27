import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close.svg'
import star from './assets/star.svg'
import unstar from './assets/unstar.svg'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { AuthContext } from '../../General/AuthProvider';
import { notifyErrorOrange } from '../../General/CustomToast';
import { successAlert } from '../../General/CustomAlert';

function Feedback({closeFeedback}) {
    const [rating, setRating] = useState(0); // State to manage the current rating
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const {user, userData} = useContext(AuthContext);

    // Function to handle star click
    const handleStarClick = (index) => {
        setRating((prev) => (prev === index + 1 ? 0 : index + 1)); // Toggle the clicked star
    };

    const cancelFeedback = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { hasFeedback: false });
        closeFeedback(true);
    }

    const handleSubmit = async () => {
        if(rating === 0 || feedback.trim() === ''){
            notifyErrorOrange('Please provide a star rating and feedback text before submitting.');
            return;
        }

        setLoading(true);

        try{
            const feedbackRef = collection(db, 'userFeedback');
            await addDoc(feedbackRef, {
                userID: user.uid,
                userProfile: userData.profilePictureURL,
                rating: rating,
                feedback: feedback,
                userName: userData.fullName,
                submittedAt: serverTimestamp()
            });

            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { hasFeedback: true });

            successAlert('Thank you for your feedback!');
            closeFeedback(true);
        }
        catch(error){
            console.error(error);
            setLoading(false);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 bg-black/70`}>
            <div className="relative p-7 bg-secondary w-[90%] sm:w-[30rem] h-auto rounded-lg py-3 flex flex-col">
                <img onClick={cancelFeedback} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Give Feedback</h1>

                <div className='mt-4'>

                    {/* STARS */}
                    <div className="w-full px-5 sm:px-10 flex justify-evenly">
                        {[...Array(5)].map((_, index) => (
                            <img
                            key={index}
                            className="w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                            src={rating > index ? star : unstar} // Conditional rendering of filled/unfilled star
                            alt={`Star ${index + 1}`}
                            onClick={() => handleStarClick(index)} // Handle click for each star
                            />
                        ))}
                    </div>

                    <p className='font-medium text-lg pt-4 text-center'>How would you rate your experience with <span className='font-semibold'>HomePaws</span>?</p>
                    <textarea onChange={(e) => setFeedback(e.target.value)} required className='py-1 mt-4 outline-none w-full h-20 px-2 border-2 border-text rounded-md' placeholder='Write your feedback...'></textarea>

                    <div className='flex w-full justify-center'>
                        <button onClick={handleSubmit} className='bg-primary hover:bg-primaryHover duration-200 rounded-md px-7 my-4 py-2 text-white font-medium'>{loading ? 'SUBMITTING...' : 'SUBMIT'}</button>
                    </div>
                    
                </div>

                
            </div>
        </div>
    )
}

export default Feedback