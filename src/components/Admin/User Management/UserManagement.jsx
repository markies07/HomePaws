import React, { useContext, useEffect, useState } from 'react'
import Search from './Search';
import Users from './Users';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { AuthContext } from '../../General/AuthProvider';
import close from './assets/close.svg';


function UserManagement() {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [bannedUsers, setBannedUsers] = useState([]);
    const [deactivatedUsers, setDeactivatedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'admins', 'banned', or 'deactivated'

    // Fetch users with "isAdmin" or any user from the "users" collection
    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(fetchedUsers);
        });
        return () => unsubscribe();
    }, []);

    // Fetch banned users from "bannedUsers" collection
    useEffect(() => {
        const q = query(collection(db, 'bannedUsers'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedBannedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBannedUsers(fetchedBannedUsers);
        });
        return () => unsubscribe();
    }, []);

    // Fetch deactivated users from "deactivatedUsers" collection
    useEffect(() => {
        const q = query(collection(db, 'deactivatedUsers'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedDeactivatedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDeactivatedUsers(fetchedDeactivatedUsers);
        });
        return () => unsubscribe();
    }, []);

    // Filter users based on the selected filter and search query
    const getFilteredUsers = () => {
        let filtered = [];

        if (filter === 'admins') {
            filtered = users.filter(u => u.role === 'admin' && u.id !== user.uid);
        } else if (filter === 'banned') {
            filtered = bannedUsers;
        } else if (filter === 'deactivated') {
            filtered = deactivatedUsers;
        } else {
            // Show all users (exclude the current admin's own account)
            filtered = users.filter(u => u.id !== user.uid);
        }

        // Apply search query filtering on the result
        return filtered.filter(u => 
            u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    console.log(deactivatedUsers)


    return (
        <div className='pt-36 lg:pt-20 lg:pl-52 z-30 lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className='flex-grow mt-3 flex flex-col gap-1 items-center lg:items-start lg:flex-row'>
                <div className='flex-col flex w-full lg:flex-row mx-auto'>
                    <div className='order-1 lg:order-2'>
                        <Search setFilter={setFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                    <div className='order-2 lg:order-1 lg:ml-3 my-3 lg:my-0 lg:mb-3 justify-center flex-col flex mx-auto flex-grow sm:rounded-lg lg:rounded-lg bg-secondary shadow-custom w-full sm:w-[90%] lg:w-full lg:mr-[14.75rem] xl:mr-[15.75rem] 2xl:mr-[17.75rem]'>
                        <div className={filter !== 'all' ? 'block pl-5 xl:pl-7 pt-4 relative' : 'hidden'}>
                            <img onClick={() => setFilter('all')} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-3 cursor-pointer' src={close} alt="" />
                            <p className={`${filter === 'banned' ? 'block' : 'hidden'} text-2xl font-medium pt-4`}>Banned Users</p>
                            <p className={`${filter === 'deactivated' ? 'block' : 'hidden'} text-2xl font-medium pt-4`}>Deactivated Users</p>
                            <p className={`${filter === 'admins' ? 'block' : 'hidden'} text-2xl font-medium pt-4`}>Administrators</p>
                        </div>
                        <Users filteredUsers={getFilteredUsers()} />    
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserManagement