import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../General/AuthProvider';
import { addDoc, collection, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import Contract from '../../User/Profile/Contract';
import LoadingScreen from '../../General/LoadingScreen';
import close from './assets/close-dark.svg'
import check from './assets/check.svg'
import complete from './assets/complete.svg'
import comment from './assets/white-comment.svg'
import schedule from './assets/schedule.svg'

function RehomeInfo() {
    const navigate = useNavigate();
    const {user, userData} = useContext(AuthContext);
    const {rehomedID} = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [scheduleOpen, setScheduleOpen] = useState(false);

    // FETCHING DATA FROM REHOMEDPETS
    useEffect(() => {
        setLoading(true);
        const fetchRehomedPets = async () => {
            try{
                const docRef = doc(db, 'rehomedPets', rehomedID);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()){
                    setData(docSnap.data());
                }
                else{
                    console.log('No document found!');
                }
            }
            catch(error){
                console.error(error);
            }
            finally{
                setLoading(false);
            }
        }
        
        fetchRehomedPets();
        
    }, [rehomedID]);

    useEffect(() => {
        setLoading(true);
        const fetchProfilePicture = async () => {
            if (!data.adopterUserID) return;
        
            try {
                const adopterDoc = await getDoc(doc(db, 'users', data.adopterUserID));
                if (adopterDoc.exists()) {
                    const adopterData = adopterDoc.data();
                    setProfilePictureURL(adopterData.profilePictureURL);
                } else {
                    console.log('No such adopter!');
                }
            } catch (error) {
                console.error('Error fetching adopter profile: ', error);
            }
            finally{
                setLoading(false);
            }
        };
    
        fetchProfilePicture();
    }, [data.adopterUserID]);

    // MESSAGE EACH OTHER
    const handleStartChat = async (receiver) => {

        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', receiver && user.uid),
        );

        const querySnapshot = await getDocs(q);
        let existingChat = null;

        querySnapshot.forEach(doc => {
            const participants = doc.data().participants;
            if(participants.includes(receiver)) {
                existingChat = doc.id;
            }
        });

        let chatID;
        if(existingChat){
            chatID = existingChat;
        }
        else{
            const newChatRef = await addDoc(collection(db, 'chats'), {
                participants: [user.uid, receiver],
            })
            chatID = newChatRef.id;
        }
        navigate(`/dashboard/chat/convo/${chatID}`);
    }

    if(loading){
        <LoadingScreen />
    }

    // CHANGING FORMAT OF DATE
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // CHANGING FORMAT OF TIME
    function convertTo12Hour(time) {
        if(data?.meetupSchedule?.meetUpTime){
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert to 12-hour format
            return `${hours}:${minutes} ${ampm}`;
        }
    }

    const toggleMeetup = () => {
        setScheduleOpen(!scheduleOpen);
    }

    return (
        <div className='pt-[9.75rem] relative lg:pt-[5.75rem] lg:pl-56 lg:ml-3 xl:pl-[13.8rem] lg:pr-[13px] sm:px-3 min-h-screen flex flex-col font-poppins text-text'>
            <div className='bg-secondary flex flex-col mb-3 pt-3 overflow-hidden flex-grow sm:pt-5 relative w-full shadow-custom h-full sm:rounded-md lg:rounded-lg'>
                <img onClick={() => navigate('/admin/pet-management')} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <p className='text-2xl text-center sm:text-start pt-6 px-3 sm:px-5 font-semibold sm:pt-0'>Rehomed Pet</p>
                {/* PROGRESS BAR */}
                <div className='relative sm:w-[90%] xl:w-[70%] sm:mx-auto mt-10 h-28 sm:h-auto px-5 flex justify-between'>
                    {/* 1ST PROGRESS */}
                    <div className='flex z-10 items-center self-end sm:self-auto sm:pt-5 flex-col justify-center'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex justify-center items-center'>
                            <img className='w-5 h-5' src={check} alt="" />
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2'>Accepted<br />Application</p>
                    </div>
                    {/* 2ND PROGRESS */}
                    <div className='flex z-10 items-center flex-col self-start sm:self-auto sm:pt-5 justify-center'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary flex justify-center items-center rounded-full sm:order-1 order-2'>
                            <img className='w-5 h-5' src={check} alt="" />
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2 order-1 sm:order-2'>Meet Up<br />Scheduled</p>
                    </div>
                    {/* 3RD PROGRESS */}
                    <div className='flex z-10 items-center flex-col self-end sm:self-auto sm:pt-5 justify-center'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary flex justify-center items-center rounded-full'>
                            <img className='w-5 h-5' src={check} alt="" />
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2'>Day of<br />Meet-Up</p>
                    </div>
                    {/* 4TH PROGRESS */}
                    <div className='flex z-10 items-center flex-col self-start sm:self-auto justify-center pt-1'>
                        <div className='w-12 h-12 sm:w-14 sm:h-14 bg-primary flex justify-center items-center rounded-full sm:order-1 order-2'>
                            <img className='w-7 h-7 sm:w-8 sm:h-8' src={complete} alt="" />
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2 order-1 sm:order-2'>Rehomed</p>
                    </div>

                    {/* BAR */}
                    <div className='absolute px-14 md:px-16 top-0 sm:pb-4 md:pb-8 left-0 w-full h-full flex justify-between items-center'>
                        <div className={`bg-primary w-full h-3 border-r-2`}></div>
                        <div className={`bg-primary w-full h-3 border-r-2`}></div>
                        <div className={`bg-primary w-full h-3 border-r-2`}></div>
                    </div>
                </div>

                {/* STATUS */}
                <div className='w-full mt-7 sm:px-5 2xl:w-[90%] 2xl:mx-auto'>
                    <div className='w-full py-3 px-3 gap-2 md:gap-0 flex-col md:flex-row sm:px-5 flex justify-between items-center rounded-md lg:rounded-lg bg-[#E9E9E9]'>
                        <div className='flex md:flex-col sm:text-lg md:gap-0 xl:flex-row xl:gap-2 gap-2'>
                            <p className='font-semibold'>Status:</p>
                            <p>Rehomed Completed!</p>
                        </div>
                        <div className='flex gap-2'>
                            <button onClick={toggleMeetup} className={`flex bg-[#90b845] cursor-pointer duration-150 hover:bg-[#98c24a] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md`}><img className='w-4 h-4' src={schedule} alt="" />Meet-up Schedule</button>
                            {data?.meetupSchedule && 
                                < Contract data={data} />
                            }
                        </div>
                    </div>
                </div>


                <div className='w-full 2xl:w-[90%] 2xl:mx-auto flex flex-col lg:flex-row mt-5 lg:mt-3 lg:px-5 lg:gap-3'>

                    {/* PET DETAILS */}
                    <div className='w-full sm:px-5 lg:px-0 lg:w-1/2 pb-5 lg:order-2'>
                        <div className='w-full p-3 sm:px-5 rounded-md lg:rounded-lg bg-[#E9E9E9]'>
                            <p className='text-center text-xl font-semibold'>Pet Details</p>

                            <div className='flex flex-col gap-2 mt-4 text-sm sm:text-base'>
                                <div className='flex w-full gap-2'>
                                    <img className='w-32 shrink-0 object-cover h-[120px] sm:h-[152px] rounded-lg bg-text' src={data?.petDetails?.petImages?.length > 0 ? data?.petDetails?.petImages[0] : null} alt="" />
                                    <div className='w-full flex flex-col gap-2'>
                                        <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                            <p className='font-semibold'>Pet Name:</p>
                                            <p>{data?.petDetails?.petName}</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='bg-secondary w-[50%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Pet Type:</p>
                                                <p>{data?.petDetails?.petType}</p>
                                            </div>
                                            <div className='bg-secondary w-[50%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Age:</p>
                                                <p>{data?.petDetails?.petAge}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Pet Owner:</p>
                                    <p>{data?.petDetails?.ownerFirstName} {data?.petDetails?.ownerMI} {data?.petDetails?.ownerLastName}</p>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Full Address:</p>
                                    <p>{data?.petDetails?.houseNo} {data?.petDetails?.barangay} {data?.petDetails?.municipality}, Cavite</p>
                                </div>
                            </div>
                            <div className='pt-5 pb-2 flex justify-center gap-2'>
                                <button onClick={() => handleStartChat(data.ownerUserID)} className={`${data?.adopterUserID === user.uid ? 'hidden' : 'flex'} bg-[#6AAAAA] leading-snug cursor-pointer duration-150 hover:bg-[#619b9b] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md`}><img className='w-4 h-4' src={comment} alt="" />Message Previous Owner</button>
                            </div>
                        </div>
                    </div>

                    {/* ADOPTER DETAILS */}
                    <div className='w-full sm:px-5 lg:px-0 lg:w-1/2 pb-5 lg:order-1'>
                        <div className='w-full p-3 sm:px-5 rounded-md lg:rounded-lg bg-[#E9E9E9]'>
                            <p className='text-center text-xl font-semibold'>Adopter Details</p>

                            <div className='flex flex-col gap-2 mt-4 text-sm sm:text-base'>
                                <div className='flex w-full gap-2'>
                                    <img className='w-32 shrink-0 h-[120px] sm:h-[152px] rounded-lg object-cover bg-text' src={profilePictureURL} alt="" />
                                    <div className='w-full flex flex-col gap-2'>
                                        <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                            <p className='font-semibold'>Full Name:</p>
                                            <p>{data?.adopterDetails?.adopterFirstName} {data?.adopterDetails?.ownerMI} {data?.adopterDetails?.ownerLastName}</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='bg-secondary w-[30%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Age:</p>
                                                <p>{data?.adopterDetails?.adopterAge}</p>
                                            </div>
                                            <div className='bg-secondary w-[70%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Contact No:</p>
                                                <p>{data?.adopterDetails?.adopterContact}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Full Address:</p>
                                    <p>{data?.adopterDetails?.houseNo} {data?.adopterDetails?.barangay} {data?.adopterDetails?.municipality}, Cavite</p>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Commitment:</p>
                                    <p>{data?.adopterDetails?.adopterCommitment}</p>
                                </div>
                            </div>
                            <div className='pt-5 pb-2 flex justify-center gap-2'>
                                <button onClick={() => handleStartChat(data.adopterUserID)} className={` bg-[#6AAAAA] flex leading-snug cursor-pointer duration-150 hover:bg-[#619b9b] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md`}><img className='w-4 h-4' src={comment} alt="" />Message Adopter</button>
                            </div>
                        </div>
                    </div>
                 </div>   

                 {/* MEET UP */}
                 <div className={scheduleOpen ? 'block' : 'hidden'}>
                    <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/65'>
                        <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-auto rounded-lg py-5 flex flex-col">
                            <img onClick={toggleMeetup} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                            <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 sm:pt-0 mb-4'>Meet up Schedule</h1>
                            
                            <div className='mt-2'>
                                <div className='flex gap-2'>
                                    <div className='w-[65%] bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                                        <p className='font-semibold'>Date:</p>
                                        <p>{formatDate(data?.meetupSchedule?.meetUpDate)}</p>
                                    </div>
                                    <div className='w-[35%] bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                                        <p className='font-semibold'>Time:</p>
                                        <p>{convertTo12Hour(data?.meetupSchedule?.meetUpTime)}</p>
                                    </div>
                                </div>
                                <div className='w-full mt-2 bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Place:</p>
                                    <p>{data?.meetupSchedule?.meetUpPlace}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RehomeInfo