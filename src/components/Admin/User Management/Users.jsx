import React from 'react'
import { useNavigate } from 'react-router-dom'

function Users({filteredUsers}) {
    const navigate = useNavigate();


    return (
        <div className='flex flex-col gap-3 w-full h-full py-4 px-5 xl:px-7 overflow-y-auto'>
            {filteredUsers.length === 0 ? (
                <div className='bg-[#E9E9E9] relative w-full py-5 rounded-lg flex items-center justify-center'>
                    <p className='font-medium text-center leading-4 w-52'>No Users Found</p>
                </div>
            ) : 
            filteredUsers.map(user => (
                <div key={user.id} className='bg-[#E9E9E9] relative w-full p-3 sm:px-4 items-center rounded-lg flex justify-between'>
                    <div className='flex items-center'>
                        <img className='w-10 h-10 bg-text shrink-0 rounded-full object-cover' src={user.profilePictureURL} alt="" />
                        <p className='font-medium pl-3 leading-4 w-52 sm:w-full pr-3'>{user.fullName}</p>
                    </div>
                    <button onClick={() => navigate(`profile/${user.id}`)} className='sm:px-4 px-2 py-2 bg-primary leading-4 hover:bg-primaryHover duration-150 text-white text-sm rounded-lg'>View Profile</button>
                </div>
            ))}
        </div>
    )
}

export default Users