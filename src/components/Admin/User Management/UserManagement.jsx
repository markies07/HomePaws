import React, { useContext, useEffect, useState } from 'react'
import Search from './Search'
import Users from './Users'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { AuthContext } from '../../General/AuthProvider';


function UserManagement() {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(fetchedUsers);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(u => 
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) && u.id !== user.uid
    );


    return (
        <div className='pt-36 lg:pt-20 lg:pl-52 z-30 lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className='flex-grow mt-3 flex flex-col gap-1 items-center lg:items-start lg:flex-row'>
                <div className='flex-col flex w-full lg:flex-row mx-auto'>
                    <div className='order-1 lg:order-2'>
                        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                    <div className='order-2 lg:order-1 lg:ml-3 my-3 lg:my-0 lg:mb-3 justify-center flex mx-auto flex-grow sm:rounded-lg lg:rounded-lg bg-secondary shadow-custom w-full sm:w-[90%] lg:w-full lg:mr-[14.75rem] xl:mr-[15.75rem] 2xl:mr-[17.75rem]'>
                        <Users filteredUsers={filteredUsers} users={users} />    
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserManagement