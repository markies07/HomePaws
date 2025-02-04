import React, { useContext, useState } from 'react'
import close from './assets/close.svg'
import id from './assets/ID.svg'
import { db, storage } from '../../../firebase/firebase';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import { AuthContext } from '../../General/AuthProvider';

function Verify({closeVerify}) {
    const {userData} = useContext(AuthContext)
    const [idPic, setIdPic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [typeOfId, setTypeOfId] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setIdPic(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(idPic === null){
            notifyErrorOrange('Please upload your ID!');
            setLoading(false);
            return;
        }

        if (!fullName.trim() || !birthday.trim() || !typeOfId.trim() || !idNumber.trim()) {
            notifyErrorOrange('Please fill up all the fields!');
            setLoading(false);
            return;
        }

        try {
            let imageUrl = "";
            
            // Upload ID image if selected
            if (idPic) {
                const storageRef = ref(storage, `idVerification/${idPic.name}`);
                await uploadBytes(storageRef, idPic);
                imageUrl = await getDownloadURL(storageRef);
            }

            // Store data in Firestore
            await addDoc(collection(db, "pendingVerification"), {
                idPic: imageUrl,
                fullName,
                birthday,
                typeOfId,
                idNumber,
                isRead: false,
                userID: userData.uid,
                timestamp: serverTimestamp()
            });

            notifySuccessOrange('Verification submitted successfully!')
            setIdPic(null);
            setFullName("");
            setBirthday("");
            setTypeOfId("");
            setIdNumber("");

            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error("Error submitting verification:", error);
            notifyErrorOrange("Failed to submit verification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-3 lg:pt-3 lg:px-0 min-h-[calc(100dvh-145px)] lg:min-h-[calc(100dvh-80px)] w-full'>
            <div className='bg-secondary py-3 px-5 sm:p-5 relative w-full shadow-custom h-full rounded-md lg:rounded-lg'>
                <img onClick={closeVerify} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <p className='text-2xl sm:text-3xl text-center pt-7 font-medium'>Identity Verification</p>
                
                <form onSubmit={handleSubmit} className='flex flex-col items-center mt-7 sm:mt-10'>
                    {/* ID PICTURE */}
                    <div className='flex flex-col items-center gap-2'>
                        <div className='flex justify-center overflow-hidden items-center w-60 sm:w-72 h-36 sm:h-40 rounded-md'>
                            <img className='w-full object-cover' src={idPic ? URL.createObjectURL(idPic) : id} alt="" />
                            <input onChange={handleFileChange} id='idpic' accept="image/*" type='file' className='hidden' />
                        </div>
                        <button type='button' onClick={() => document.getElementById('idpic').click()} className='bg-primary hover:bg-primaryHover duration-150 py-1 px-2 rounded-md text-xs text-white'>Photo of Front ID</button>
                    </div>

                    {/* INFORMATION */}
                    <div className='w-full flex items-center flex-col mt-5 sm:mt-7 md:mt-12'>
                        <div className='flex flex-col sm:flex-row w-full sm:gap-3 max-w-[40rem]'>
                            <div className='w-full'>
                                <p className='font-semibold text-sm sm:text-base'>Full Name</p>
                                <input autoComplete='off' value={fullName} onChange={(e) => setFullName(e.target.value)} className='w-full text-sm sm:text-base mb-3 py-2 px-3 rounded-md outline-none bg-[#D9D9D9]' type="text" />
                            </div>
                            <div className='w-full'>
                                <p className='font-semibold text-sm sm:text-base'>Birthday</p>
                                <input autoComplete='off' value={birthday} onChange={(e) => setBirthday(e.target.value)} className='w-full text-sm sm:text-base mb-3 py-[7px] px-3 rounded-md outline-none bg-[#D9D9D9]' type="date" />
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row w-full sm:gap-3 max-w-[40rem]'>
                            <div className='w-full'>
                                <p className='font-semibold text-sm sm:text-base'>Type of ID</p>
                                <input autoComplete='off' value={typeOfId} onChange={(e) => setTypeOfId(e.target.value)} className='w-full text-sm sm:text-base mb-3 py-2 px-3 rounded-md outline-none bg-[#D9D9D9]' type="text" />
                            </div>
                            <div className='w-full'>
                                <p className='font-semibold text-sm sm:text-base'>ID Number</p>
                                <input autoComplete='off' value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className='w-full text-sm sm:text-base mb-3 py-2 px-3 rounded-md outline-none bg-[#D9D9D9]' type="text" />
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button type='submit' disabled={loading} className='bg-primary font-medium mt-5 md:mt-10 mb-2 hover:bg-primaryHover duration-150 py-2 px-4 rounded-md text-sm text-white'>{loading ? "SUBMITTING..." : "SUBMIT"}</button>
                </form>
                
            </div>
        </div>
    )
}

export default Verify