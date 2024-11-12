import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/firebase';
import { AuthContext } from '../../General/AuthProvider';

function ReportManagement() {
    const {user} = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPending, setIsPending] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try{
                setLoading(true);
                const status = isPending ? ['pending', 'pending'] : ['approved', 'declined'];
                const reportRef = query(
                    collection(db, 'userReports'),
                    where('status', 'in', status),
                    orderBy(isPending ? 'reportedBy' : 'actionAt', 'desc')
                );

                const snapshot = await getDocs(reportRef);
                const userReports = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setReports(userReports);
            }
            catch(error){
                console.error(error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchReports();
    }, [user.uid, isPending]);


    const getTimeDifference = (timestamp) => {
        if (!timestamp) return 'Invalid date';
        const now = new Date();
        const timeDiff = Math.abs(now - timestamp.toDate()); // Convert Firestore timestamp to JS Date
      
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
      
        if (seconds < 10) {
          return 'Just now';
        } else if (years > 0) {
          return years === 1 ? '1y ago' : `${years}y ago`;
        } else if (months > 0) {
          return months === 1 ? '1m ago' : `${months}m ago`;
        } else if (days > 0) {
          return days === 1 ? '1d ago' : `${days}d ago`;
        } else if (hours > 0) {
          return hours === 1 ? '1h ago' : `${hours}h ago`;
        } else if (minutes > 0) {
          return minutes === 1 ? '1min ago' : `${minutes}min ago`;
        } else {
          return `${seconds}s ago`;
        }
    };


    const goTo = async (type, reportID) => {

        const reportRef = doc(db, 'userReports', reportID);

        await updateDoc(reportRef, {
            read: true
        })

        if(type === 'user'){
            navigate(`reason/user/${reportID}`)
        }
        else if(type === 'post'){
            navigate(`reason/post/${reportID}`)
        }
    }

    // Handle toggling between "All" and "Unread" tabs
    const handleTabClick = (selected) => {
        setIsPending(selected);
    };

    


    return (
        <div className='pt-36 relative lg:pt-20 lg:pl-56 lg:pr-3 lg:ml-3 min-h-screen flex flex-col font-poppins text-text'>
            <div className='flex mt-3 lg:mt-3 bg-secondary sm:mx-auto lg:mx-0 flex-grow mb-3 w-full text-text sm:w-[97%] lg:w-full sm:rounded-md lg:rounded-lg shadow-custom'>
                <div className='p-5 md:px-7 w-full'>
                    <div className='flex relative justify-between'>
                        <h1 className='text-2xl font-semibold'>Reports</h1>
                    </div>
                    
                    {/* FILTER */}
                    <div className='flex gap-1 my-3'>
                        <p onClick={() => handleTabClick(true)} className={`cursor-pointer text-sm font-medium py-1 px-3 ${isPending ? 'bg-primary rounded-md text-white' : ''}`}>Pending</p>
                        <p onClick={() => handleTabClick(false)} className={`cursor-pointer text-sm font-medium py-1 px-3 ${!isPending ? 'bg-primary rounded-md text-white' : ''}`}>Done</p>
                    </div>

                    {/* REPORTS */}
                    <div className='mt-4 flex flex-col gap-3'>
                        {/* Check if there are no notifications */}
                        {loading ? (
                            <div className="text-center text-gray-500 font-medium py-5 bg-[#E9E9E9] rounded-md">Loading...</div>
                        ) : 
                        reports.length === 0 ? (
                            <div className="text-center text-gray-500 font-medium py-5 bg-[#E9E9E9] rounded-md">No Reports Found</div>
                        ) : (
                            reports.map((report) => (
                                <div key={report.id} onClick={() => goTo(report.type, report.id)} className='bg-[#E9E9E9] relative items-center flex hover:bg-[#d3d3d3] duration-150 cursor-pointer w-full p-3 rounded-lg'>
                                    <div className='relative w-12 h-12 shrink-0'>
                                        <img className='w-full h-full object-cover rounded-full' src={report.profilePictureURL} alt="" />
                                    </div>
                                    <div className={`pl-3 sm:pl-4 flex flex-col justify-center ${report.read ? 'pr-0' : 'pr-7'}`}>
                                        <p className='font-semibold text-sm sm:text-base leading-4'>{report.reportedByName} <span className='font-normal'>reported {report.type === 'user' ? report.reportedName : `a post`}.</span></p>
                                        <p className={`${isPending ? 'block' : 'hidden'} text-xs sm:text-[13px] text-[#8a8a8a] mt-1 sm:mt-0`}>{getTimeDifference(report.reportedAt)}</p>
                                        <p className={`${!isPending ? 'block' : 'hidden'} text-xs sm:text-[13px] text-[#8a8a8a] mt-1 sm:mt-0`}>{getTimeDifference(report.actionAt)}</p>
                                    </div>
                                    <div style={{display: !report.read ? 'flex' : 'none'}} className='absolute right-3 sm:right-5 top-0 h-full items-center'>
                                        <div className='w-4 h-4 bg-primary rounded-full' />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ReportManagement