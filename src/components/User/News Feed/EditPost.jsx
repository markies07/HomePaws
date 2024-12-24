import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import close from './assets/close-dark.svg';
import closewhite from '../assets/close.svg';
import { notifyErrorOrange, notifySuccessOrange } from "../../General/CustomToast";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function EditPost({ postId, closeEdit }) {
    const [caption, setCaption] = useState("");
    const [postType, setPostType] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch post data
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                if (postId) {
                    const postRef = doc(db, "userPosts", postId);
                    const postSnap = await getDoc(postRef);

                    if (postSnap.exists()) {
                        const data = postSnap.data();
                        setPostType(data.typeOfPost || '');
                        setCaption(data.caption || "");
                        if (data.images && Array.isArray(data.images)) {
                            setImages(data.images);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                notifyErrorOrange('Error fetching post data');
            }
        };

        fetchPostData();
    }, [postId]);

    
    // Remove image
    const handleRemoveImage = (index) => {
        console.log("Removing image at index:", index);
        setImages(prevImages => {
            const newImages = prevImages.filter((_, i) => i !== index);
            console.log("Images after removal:", newImages);
            return newImages;
        });
    };

    // Submit updated post
    const handleSubmitPost = async () => {
        setIsLoading(true);

        if(images.length === 0){
            notifyErrorOrange('You need to have at least one image in it');
            setIsLoading(false);
            return;
        } 
    
        try {
            // Access the latest state inside a callback
            setImages((currentImages) => {
                console.log("Images inside submit callback:", currentImages); // Log latest state
                return currentImages; // Use this callback to ensure up-to-date data
            });
    
            const postRef = doc(db, "userPosts", postId);
    
            await updateDoc(postRef, {
                caption,
                images, // This will now reliably use the latest state
            });
    
            notifySuccessOrange('Post edited successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error updating post:", error);
            notifyErrorOrange('There was an error editing this post!');
        } finally {
            setIsLoading(false);
        }
    };
    
    
    

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-20">
            <div className="relative bg-secondary w-[90%] sm:w-[30rem] h-[65%] rounded-lg p-3 sm:px-5 flex flex-col">
                <img onClick={closeEdit} className='w-9 p-1 border-2 border-secondary hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />

                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5'>Edit Post</h1>

                <div className='flex items-center mt-4 mb-1'>
                    <p className='font-medium shrink-0'>Type of post:
                        <span className='font-light px-3 text-sm text-white ml-2 rounded-full' 
                              style={{ backgroundColor: postType === 'story' ? '#C18DEC' : postType === 'announcement' ? '#ED5050' : '#85B728' }}>
                            {postType}
                        </span>
                    </p>
                </div>

                <div className='flex-grow flex flex-col min-h-0 mt-1 gap-2'>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className='bg-secondary leading-5 border-[1px] px-2 pt-3 pb-1 h-12 border-[#d6d6d6] rounded-md w-full outline-none'
                        placeholder="Edit your caption..."
                    />

                    <div className='rounded-md relative flex-grow flex justify-center flex-col items-center bg-[#D9D9D9] overflow-hidden'>
                        {/* Image preview area */}
                        <div className='flex gap-2 w-full h-[70%] items-center justify-center object-cover px-2'>
                            {images && images.map((url, index) => (
                                <div key={`image-${index}-${url}`} className='relative flex items-center w-full h-full'>
                                    <img 
                                        src={url}
                                        alt={`post-${index}`}
                                        className='object-cover w-full h-full rounded-md'
                                    />
                                    <button 
                                        onClick={() => handleRemoveImage(index)}
                                        className='absolute top-1 right-1 bg-primary text-white text-xs rounded-full p-2'
                                    >
                                        <img className='w-5 h-5' src={closewhite} alt="remove" />
                                    </button>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmitPost}
                    disabled={isLoading}
                    className='bg-primary mt-3 mb-1 font-medium rounded-md hover:bg-primaryHover duration-150 py-1 px-4 text-white w-28 mx-auto'
                >
                    {isLoading ? 'EDITING...' : 'EDIT'}
                </button>
            </div>
        </div>
    );
}

export default EditPost;