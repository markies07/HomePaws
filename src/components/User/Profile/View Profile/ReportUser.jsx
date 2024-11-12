import React, { useContext, useState } from 'react'
import close from '../assets/close-dark.svg';
import { notifyErrorOrange, notifySuccessOrange } from '../../../General/CustomToast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { AuthContext } from '../../../General/AuthProvider';


function ReportUser({userID, closeReport, data}) {
    const {user, userData} = useContext(AuthContext);
    const [selectedReason, setSelectedReason] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReasonClick = (reason) => {
        setSelectedReason(reason);
    };

    const handleSubmitReport = async () => {
        setLoading(true);
        if(!selectedReason){
            notifyErrorOrange('Please select a reason for reporting.');
            setLoading(false)
            return;
        }

        const reportData = {
            reportedBy: user.uid,
            reportedByName: userData.fullName,
            profilePictureURL: userData.profilePictureURL,
            userReported: userID,
            read: false,
            reportedName: data.fullName,
            reason: selectedReason,
            additionalDetails: additionalDetails,
            reportedAt: serverTimestamp(),
            type: 'user',
            status: 'pending'
        };

        try{
            await addDoc(collection(db, 'userReports'), reportData);
            notifySuccessOrange('Report submitted successfully!');
            closeReport();
        }
        catch(error){
            console.error(error);
            setLoading(false);
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/70'>
            <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-[80%] overflow-y-auto rounded-lg py-3 flex flex-col">
                <img onClick={closeReport} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Report this User</h1>
                <p className='font-medium'>Why are you reporting this user?</p>

                {/* CHOICES */}
                <div className='flex mt-2 w-full flex-col gap-2'>
                    <p onClick={() => handleReasonClick('Harassment or Bullying')} className={`${selectedReason === 'Harassment or Bullying' ? 'border-primary text-primary' : 'border-transparent text-text'} bg-secondary border-2 text-center sm:text-start w-full rounded-md sm:py-3 py-2 px-3 font-medium cursor-pointer`}>Harassment or Bullying</p>
                    <p onClick={() => handleReasonClick('Spam or Fraud')} className={`${selectedReason === 'Spam or Fraud' ? 'border-primary text-primary' : 'border-transparent text-text'} bg-secondary border-2 text-center sm:text-start w-full rounded-md py-3 px-3 font-medium cursor-pointer`}>Spam or Fraud</p>
                    <p onClick={() => handleReasonClick('Inappropriate Content')} className={`${selectedReason === 'Inappropriate Content' ? 'border-primary text-primary' : 'border-transparent text-text'} bg-secondary border-2 text-center sm:text-start w-full rounded-md sm:py-3 py-2 px-3 font-medium cursor-pointer`}>Inappropriate Content</p>
                    <p onClick={() => handleReasonClick('Animal Welfare Concerns')} className={`${selectedReason === 'Animal Welfare Concerns' ? 'border-primary text-primary' : 'border-transparent text-text'} bg-secondary border-2 text-center sm:text-start w-full rounded-md sm:py-3 py-2 px-3 font-medium cursor-pointer`}>Animal Welfare Concerns</p>
                    <p onClick={() => handleReasonClick('Impersonation or Fake Profile')} className={`${selectedReason === 'Impersonation or Fake Profile' ? 'border-primary text-primary' : 'border-transparent text-text'} bg-secondary border-2 text-center sm:text-start w-full rounded-md sm:py-3 py-2 px-3 font-medium cursor-pointer`}>Impersonation or Fake Profile</p>
                </div>

                {/* MORE DETAILS */}
                <div className='pt-4 min-h-32 pb-11 flex-grow'>
                    <p className='font-medium pb-1'>Additional details:</p>
                    <textarea required value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} className='py-2 mb-5 w-full h-full px-3 outline-none rounded-md' placeholder='State your reason...'></textarea>
                </div>
                
                <div className='flex justify-center'>
                    <button onClick={handleSubmitReport} className='bg-primary hover:bg-primaryHover duration-150 py-2 px-5 rounded-md text-white'>{loading ? 'Submitting...' : 'Submit Report'}</button>
                </div>
                
            </div>
        </div>
    )
}

export default ReportUser