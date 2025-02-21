import React, { useEffect, useState } from 'react'
import star from './assets/star.svg'
import unstar from './assets/unstar.svg'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

function Feedbacks() {

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try{
                const feedbackRef = collection(db, 'userFeedback');
                const feedbackQuery = query(feedbackRef, orderBy('submittedAt', 'desc'), limit(3));
                const querySnapshot = await getDocs(feedbackQuery);

                const feedbackData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setFeedbacks(feedbackData);
            }
            catch(error){
                console.error(error);
                setLoading(false);
            }
            finally{
                setLoading(false);
            }
        }
        fetchFeedbacks();
    }, []);

    return (
        <div className='w-full h-full flex flex-col items-center text-text my-24 sm:mt-32 bg-secondary'>
            <p className='text-3xl font-medium border-b-2 px-5 border-text'>Feedback</p>
            
            {/* USER FEEDBACK */}
            <div className='mt-16 flex flex-col lg:flex-row gap-20 lg:gap-10 text-text py-4'>

                {loading ? (
                    <p className='text-center font-medium'>Loading Feedback ...</p>
                ) :
                feedbacks.map((feedback) => (
                    <div key={feedback.id} className='shadow-custom flex flex-col justify-between lg:w-64 w-auto mx-auto rounded-lg p-5 relative'>

                        {/* USER PROFILE */}
                        <div className='flex flex-col items-center gap-2 absolute -top-7 left-0 w-full'>
                            <img className='w-16 h-16 object-cover bg-text rounded-full' src={feedback.userProfile} alt="" />
                            <p className='font-medium text-sm'>{feedback.userName}</p>
                        </div>

                        {/* FEEDBACK */}
                        <div className='mt-14 flex justify-center items-center h-full'>
                            <p className='font-semibold text-center pb-5'>"{feedback.feedback}"</p>
                        </div>

                        {/* STARS */}
                        <div className='max-w-60 gap-2 px-5 mx-auto justify-between flex'>
                            <img className='w-7 h-7' src={star} alt="" />
                            <img className='w-7 h-7' src={feedback.rating >= 1 ? star : unstar} alt="" />
                            <img className='w-7 h-7' src={feedback.rating >= 2 ? star : unstar} alt="" />
                            <img className='w-7 h-7' src={feedback.rating >= 3 ? star : unstar} alt="" />
                            <img className='w-7 h-7' src={feedback.rating == 5 ? star : unstar} alt="" />
                        </div>
                    </div>
                ))}
                
            </div>

        </div>
    )
}

export default Feedbacks