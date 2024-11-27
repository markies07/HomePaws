import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close-dark.svg'
import { AuthContext } from '../../General/AuthProvider'
import { db } from '../../../firebase/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { successAlert } from '../../General/CustomAlert';
import { notifyErrorOrange } from '../../General/CustomToast';
import paw from './assets/white-paw.svg'
import RehomedComplete from './RehomedComplete'

function Schedule({closeUI, data, pet, adopter, isMeetup}) {
    const {user, userData} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [meetUpDate, setMeetUpDate] = useState('');
    const [meetUpTime, setMeetUpTime] = useState('');
    const [meetUpPlace, setMeetUpPlace] = useState('');
    const [isScheduled, setIsScheduled] = useState(data.isScheduled);

    useEffect(() => {
        if (data && data.meetupSchedule) {
          setMeetUpDate(data.meetupSchedule.meetUpDate || '');
          setMeetUpTime(data.meetupSchedule.meetUpTime || '');
          setMeetUpPlace(data.meetupSchedule.meetUpPlace || '');
        }
      }, [data]);

    // CHANGING FORMAT OF TIME
    function convertTo12Hour(time) {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        return `${hours}:${minutes} ${ampm}`;
    }

    // CHANGING FORMAT OF DATE
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const submitSchedule = async () => {
        setLoading(true);

        if (!meetUpDate || !meetUpTime || !meetUpPlace) {
            notifyErrorOrange("Please fill out all fields");
            setLoading(false);
            return;
        }

        try{
            const applicationRef = doc(db, 'acceptedApplications', data.applicationID);
            
            const meetUpData = {
                meetupSchedule: {
                    meetUpDate,
                    meetUpTime,
                    meetUpPlace,
                },
                status: 'scheduled',
                isScheduled: true,
            }

            // NOTIFICATION
            const notificationRef = collection(db, 'notifications');
            await addDoc(notificationRef, {
                content: `submitted your meet up schedule with ${data.petName}.`,
                applicationID: data.applicationID,
                type: 'adoption',
                image: userData.profilePictureURL,
                senderName: userData.fullName,
                senderId: user.uid,
                userId: data.adopterUserID,
                isRead: false,
                accepted: true,
                timestamp: serverTimestamp(),
            });
    
            await updateDoc(applicationRef, meetUpData);
            successAlert('Meet-up schedule submitted successfully!');
            setTimeout(() => {
                window.location.reload();
            }, [1000])
            
        }
        catch(error){
            console.error(error);
            notifyErrorOrange("Failed to submit meet-up schedule. Please try again.");
        }
        finally{
            setLoading(false);
        }
    }

    const submitReschedule = async () => {
        setLoading(true);

        try{
            const docRef = doc(db, 'acceptedApplications', data.applicationID);

            await updateDoc(docRef, {
                "meetupSchedule.meetUpDate": meetUpDate,
                "meetupSchedule.meetUpTime": meetUpTime,
                "meetupSchedule.meetUpPlace": meetUpPlace,
                status: 'scheduled',
            })
            successAlert('New schedule submitted successfully!');
            setTimeout(() => {
                window.location.reload();
            }, [1000])
        }
        catch(error){
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    }

    

    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/65'>
            <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-auto rounded-lg py-5 flex flex-col">
                <img onClick={closeUI} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 sm:pt-0 mb-4'>Meet up Schedule</h1>
                
                {/* SETTING UP SCHEDULE */}
                {data.isScheduled === false && data.petOwnerID === user.uid && (
                    <div className='mt-3'>
                        <div className='w-full flex gap-2'>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Date</p>
                                <input required min={new Date(new Date().setDate(new Date().getDate())).toISOString().split("T")[0]} onChange={(e) => setMeetUpDate(e.target.value)} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="date" />
                            </div>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Time</p>
                                <input required onChange={(e) => setMeetUpTime(e.target.value)} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="time" />
                            </div>
                        </div>
                        <div className='w-full mt-3'>
                            <p className='font-semibold'>Place</p>
                            <textarea required onChange={(e) => setMeetUpPlace(e.target.value)} className='py-1 w-full h-20 px-2 outline-none border-2 border-text rounded-md' placeholder='Place of meet up'></textarea>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className='flex justify-center gap-2 pt-7'>
                            <button onClick={submitSchedule} className='bg-[#90b845] hover:bg-[#98c24a] cursor-pointer duration-150 font-medium gap-2 text-white py-1 px-5 rounded-md'>{loading ? 'SUBMITTING...' : 'SUBMIT'}</button>
                        </div>
                    </div>
                )}

                {/* FOR ADOPTER */}
                { data.isScheduled === false && data.adopterUserID === user.uid && (
                    <div className='w-full mt-3 bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                        <p className='font-semibold text-center leading-5'>Waiting for the pet owner to set up a schedule</p>
                    </div>
                )}

                {/* SUBMITTED SCHEDULE */}
                {data.isScheduled === true && isScheduled === true && (
                    <div className='mt-2'>

                        <div className='flex gap-2'>
                            <div className='w-[65%] bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                                <p className='font-semibold'>Date:</p>
                                <p>{formatDate(data.meetupSchedule.meetUpDate)}</p>
                            </div>
                            <div className='w-[35%] bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                                <p className='font-semibold'>Time:</p>
                                <p>{convertTo12Hour(data.meetupSchedule.meetUpTime)}</p>
                            </div>
                        </div>
                        <div className='w-full mt-2 bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                            <p className='font-semibold'>Place:</p>
                            <p>{data.meetupSchedule.meetUpPlace}</p>
                        </div>

                        {/* BUTTONS */}
                        <div className='flex justify-center gap-2 pt-7'>
                            <button onClick={() => setIsScheduled(false)} className={`${data.status !== 'meetup' ? 'block' : 'hidden'} bg-[#D25A5A] hover:bg-[#c25454] cursor-pointer duration-150  font-medium gap-2 text-white py-1 px-4 rounded-md`}>RESCHEDULE</button>
                            <RehomedComplete isMeetup={isMeetup} adopter={adopter} data={data} pet={pet} />
                        </div>
                       
                    </div>
                )}

                {/* RESCHEDULING MEET-UP */}
                {isScheduled === false && data.meetupSchedule && (
                    <div className='mt-3'>
                        <div className='w-full flex gap-2'>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Date</p>
                                <input required min={new Date(new Date().setDate(new Date().getDate())).toISOString().split("T")[0]} onChange={(e) => setMeetUpDate(e.target.value)} value={meetUpDate} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="date" />
                            </div>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Time</p>
                                <input required onChange={(e) => setMeetUpTime(e.target.value)} value={meetUpTime} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="time" />
                            </div>
                        </div>
                        <div className='w-full mt-3'>
                            <p className='font-semibold'>Place</p>
                            <textarea required onChange={(e) => setMeetUpPlace(e.target.value)} value={meetUpPlace} className='py-1 w-full h-20 px-2 outline-none border-2 border-text rounded-md' placeholder='Place of meet up'></textarea>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className='flex justify-center gap-2 pt-7'>
                            <button onClick={submitReschedule} className='bg-[#90b845] hover:bg-[#98c24a] cursor-pointer duration-150 font-medium gap-2 text-white py-1 px-5 rounded-md'>{loading ? 'SUBMITTING...' : 'SUBMIT'}</button>
                            <button onClick={() => setIsScheduled(true)} className='bg-[#D25A5A] hover:bg-[#c25454] cursor-pointer duration-150 font-medium gap-2 text-white py-1 px-5 rounded-md'>CANCEL</button>
                        </div>
                    </div>
                )}

                
            </div>
        </div>
    )
}

export default Schedule