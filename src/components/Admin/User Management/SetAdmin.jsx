import React from 'react'
import admin from './assets/admin-white.png';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { confirm, successAlert } from '../../General/CustomAlert';

function SetAdmin({data}) {

    const changeRole = () => {
        if(data.role === 'user'){
            confirm(`Set as Admin`,`Are you sure you want to set ${data.fullName} as admin?`).then(async (result) => {
                if(result.isConfirmed){
                    try{
                        const userRef = doc(db, 'users', data.uid);
                        await updateDoc(userRef, {
                            role: 'admin'
                        });
            
                        successAlert(`${data.fullName} is now an Admin!`);
                        setTimeout(() => {
                            window.location.reload();
                        }, [1500]);
                    }
                    catch (error){
                        console.error(error);
                    }
                }
            })
        }
        else if(data.role === 'admin'){
            confirm(`Demote as Admin`,`Are you sure you want to demote ${data.fullName} as admin?`).then(async (result) => {
                if(result.isConfirmed){
                    try{
                        const userRef = doc(db, 'users', data.uid);
                        await updateDoc(userRef, {
                            role: 'user'
                        });
            
                        successAlert(`${data.fullName} has been demoted as admin`);
                        setTimeout(() => {
                            window.location.reload();
                        }, [1500]);
                    }
                    catch (error){
                        console.error(error);
                    }
                }
            })
        }

    }

    return (
        <div className='w-full flex justify-center'>
            <button onClick={changeRole} className={`${data.role === 'user' ? 'flex' : 'hidden'} items-center text-sm bg-[#898989] hover:bg-[#6e6e6e] sm:w-60 sm:px-3 sm:whitespace-nowrap duration-150 py-2 text-white rounded-md w-full leading-3 font-medium`}><img className='w-8 mx-4 mr-5' src={admin} alt="" />SET AS ADMIN</button>
            <button onClick={changeRole} className={`${data.role === 'admin' ? 'flex' : 'hidden'} items-center text-sm bg-[#898989] hover:bg-[#6e6e6e] sm:w-60 sm:px-3 sm:whitespace-nowrap duration-150 py-2 text-white rounded-md w-full leading-3 font-medium`}><img className='w-8 mx-4 mr-5' src={admin} alt="" />DEMOTE AS ADMIN</button>
        </div>
    )
}

export default SetAdmin