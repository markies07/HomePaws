import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Header from './Header'
import Question from './Question';
import LoadingScreen from '../General/LoadingScreen';
import { AuthContext } from '../General/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import MeetupChecker from './MeetupChecker';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [petOwnerTypeExists, setPetOwnerTypeExists] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (!user) {
        return <Navigate to="/" />; 
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if(user){
                try{
                    if(user){
                        const userDocRef = doc(db, 'users', user.uid);
                        const userDoc = await getDoc(userDocRef);
    
                        if(userDoc.exists()){
                            const userData = userDoc.data();
    
                            if(userData.petOwnerType){
                                setPetOwnerTypeExists(true);
                            }
                        }
                    }
                }
                catch (error){
                    console.error('Error fetching user data: ', error);
                }
                finally{
                    setIsLoading(false);
                }
            }
            else{
                setIsLoading(false);
            }
            
        }

        fetchUserData()
    }, [user]);

    const handleLogoutClick = async () => {
        setIsLogoutOpen(!isLogoutOpen);
    }

    const handlePetOwnerType = async (type) => {
        try{
            const userRef = doc(db, 'users', user.uid);

            await updateDoc(userRef, {
                petOwnerType: type
            });
            setPetOwnerTypeExists(true);
            window.location.reload();

        }
        catch (error) {
            console.error(error);
        }
    }



    if(isLoading){
        return <LoadingScreen />
    }


    return (
        <div className='w-full min-h-screen bg-[#A1E4E4] select-none font-poppins text-text'>
            <MeetupChecker />
            <Header openLogout={handleLogoutClick} isOpen={isLogoutOpen} loading={setIsLoading}/>
            {!petOwnerTypeExists ? <Question petOwnerType={handlePetOwnerType} /> : <Outlet />}
            <NavBar />
        </div>

    )
}

export default Dashboard