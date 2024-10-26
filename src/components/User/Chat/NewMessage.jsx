import React, { useContext, useEffect, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import search from './assets/search.svg'
import { addDoc, collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../General/AuthProvider';

function NewMessage({setIsNewMessage, closeUI}) {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(fetchedUsers);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(u => 
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) && u.id !== user.uid
    );

    const handleStartChat = async (receiver) => {

        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', receiver && user.uid)
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
            setIsNewMessage(false);
        }
        else{
            const newChatRef = await addDoc(collection(db, 'chats'), {
                participants: [user.uid, receiver],
            })
            chatID = newChatRef.id;
            setIsNewMessage(true);
        }
        closeUI();
        navigate(`convo/${chatID}`);
    }


    return (
        <>
            <div className='flex justify-between'>
                <h1 className='self-end text-2xl font-medium'>New Message</h1>
                <img onClick={closeUI} className='p-[10px] w-[43px] bg-[#E1E1E1] rounded-full overflow-visible cursor-pointer hover:bg-[#cecece] duration-150' src={close} alt="" />
            </div>
            <div className='relative w-full rounded-full overflow-hidden mt-3 mb-5'>
                <img className='absolute top-2 left-3' src={search} alt="" />
                <input onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} className='bg-[#E1E1E1] w-full pl-11 py-2 outline-none pr-3' type="text" placeholder='Enter user name'/>
            </div>

            {/* USERS */}
            <div className='flex flex-col gap-3 max-h-[calc(100vh-320px)] lg:max-h-[calc(100vh-257px)] overflow-y-auto'>
                {filteredUsers.map(user => (

                    <div key={user.id} onClick={() => handleStartChat(user.id)} className='bg-[#E9E9E9] relative w-full p-3 rounded-lg flex items-center hover:bg-[#d6d6d6] duration-150 cursor-pointer'>
                        <img className='w-10 h-10 bg-text rounded-full' src={user.profilePictureURL} alt="" />
                        <p className='font-medium pl-3 leading-4 w-52'>{user.fullName}</p>
                    </div>
                    
                ))}
            </div>
        </>
    )
}

export default NewMessage