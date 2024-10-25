import React, { useState } from 'react';

const PostOptions = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative" onBlur={closeDropdown} tabIndex="0">
            {/* Button to open/close the dropdown */}
            <button onClick={toggleDropdown}>
                ⋮
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                    <button className="w-full text-left p-2 hover:bg-gray-100">Report Post</button>
                    <button className="w-full text-left p-2 hover:bg-gray-100">Delete Post</button>
                </div>
            )}
        </div>
    );
};

export default PostOptions;
