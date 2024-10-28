import React, { useEffect, useState } from 'react';
import search from './assets/search.svg';
import close from './assets/close-dark.svg';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function Search({searchClose}) {
    const navigate = useNavigate();
    const [queryText, setQueryText] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [allPets, setAllPets] = useState([]);
    const [filteredResults, setFilteredResults] = useState({ users: [], pets: [] });
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        // Fetch users
        const unsubscribeUsers = onSnapshot(query(collection(db, 'users')), (snapshot) => {
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllUsers(users);
        });

        // Fetch pets
        const unsubscribePets = onSnapshot(query(collection(db, 'petsForAdoption')), (snapshot) => {
            const pets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllPets(pets);
        });

        return () => {
            unsubscribeUsers();
            unsubscribePets();
        };
    }, []);

    useEffect(() => {
        // Filter users and pets based on queryText and active filter
        const filteredUsers = allUsers.filter(user =>
            user.fullName.toLowerCase().includes(queryText.toLowerCase())
        );

        const filteredPets = allPets.filter(pet =>
            pet.petName.toLowerCase().includes(queryText.toLowerCase())
        );

        setFilteredResults({
            users: activeFilter === 'All' || activeFilter === 'Users' ? filteredUsers : [],
            pets: activeFilter === 'All' || activeFilter === 'Pets' ? filteredPets : [],
        });
    }, [queryText, activeFilter, allUsers, allPets]);

    const closeUI = () => {
        setQueryText('');
        searchClose();
    }

    const clickUsers = (userID) => {
        navigate(`/dashboard/profile/${userID}`);
        closeUI();
    }

    const clickPets = (petID) => {
        navigate(`/dashboard/find-pet/${petID}`)
        closeUI();
    }

    return (
        <div className='fixed inset-0 bg-[#A1E4E4]'>
            <img
                className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-3 right-3 cursor-pointer'
                src={close}
                alt="Close"
                onClick={closeUI}
            />
            <div className='relative w-full h-full px-7'>

                {/* SEARCH BAR */}
                <div className='relative w-full sm:w-[30rem] px-3 md:w-[40rem] xl:w-[50rem] mx-auto overflow-hidden mt-16'>
                    <img className='absolute w-6 h-6 top-2 sm:top-3 left-6' src={search} alt="Search" />
                    <input
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        className='bg-secondary rounded-full w-full pl-12 py-2 sm:py-3 outline-none pr-3'
                        type="text"
                        placeholder='Search user or pet'
                    />
                </div>

                {/* FILTER BUTTONS */}
                <div className='mt-5 mb-2 flex sm:w-[30rem] px-3 md:w-[40rem] xl:w-[50rem] gap-1 mx-auto'>
                    {['All', 'Users', 'Pets'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`font-medium px-2 py-1 ${activeFilter === filter ? 'bg-primary text-white' : ''} rounded-md text-sm`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* RESULTS */}
                <div className='flex flex-col py-3 gap-3 px-3 sm:w-[30rem] md:w-[40rem] xl:w-[50rem] mx-auto max-h-[calc(100vh-200px)] overflow-y-auto'>
                    {/* Render Users */}
                    {filteredResults.users.map(user => (
                        <div key={user.id} onClick={() => clickUsers(user.uid)} className='bg-secondary shadow-custom p-3 rounded-lg flex items-center hover:bg-[#d6d6d6] duration-150 cursor-pointer'>
                            <img className='w-12 h-12 bg-text rounded-full object-cover' src={user.profilePictureURL} alt={`${user.fullName}`} />
                            <p className='font-medium pl-3 pr-7 leading-4'>{user.fullName}</p>
                        </div>
                    ))}

                    {/* Render Pets */}
                    {filteredResults.pets.map(pet => (
                        <div key={pet.id} onClick={() => clickPets(pet.petID)} className='bg-secondary shadow-custom p-3 rounded-lg flex items-center hover:bg-[#d6d6d6] duration-150 cursor-pointer'>
                            <img className='w-12 h-12 bg-text rounded-full object-cover' src={pet.petImages[1]} alt={`${pet.petName}`} />
                            <p className='font-medium pl-3 pr-7 leading-4'>{pet.petName}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Search;
