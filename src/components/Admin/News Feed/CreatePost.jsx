import React, { useContext, useEffect, useRef, useState } from 'react'
import close from './assets/close-dark.svg'
import addImages from './assets/add-images.svg'
import { AuthContext } from '../../General/AuthProvider';
import { notifySuccessOrange, notifyWarningOrange } from '../../General/CustomToast';
import { db, storage } from '../../../firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'

const MAX_IMAGES = 3;

function CreatePost({closeWindow, postType}) {
    const { user, userData } = useContext(AuthContext);
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e) => {
        if(e.target.files.length + images.length > MAX_IMAGES) {
            notifyWarningOrange(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            return
        }

        const selectedFiles = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...selectedFiles]);
    }

    const handleSubmitPost = async () => {
        if(isLoading) return;
        if (!caption.trim()) {
            notifyWarningOrange('Please enter a caption.');
            return;
        }
        if (!images || images.length === 0) {
            notifyWarningOrange('Please upload image.');
            return;
        }
        
        setIsLoading(true);

        try{
            const uploadedImageUrls = [];

            // UPLOADING IMAGES IN FIRESTORE
            for (const image of images) {
                const uniqueImageName = `${uuidv4()}-${image.name}`;
                const imageRef = ref(storage, `userPosts/${user.uid}/${uniqueImageName}`);
                await uploadBytes(imageRef, image);
                const imageUrl = await getDownloadURL(imageRef);
                uploadedImageUrls.push(imageUrl);
            }

            // ADD POST TO FIRESTORE
            const postRef = await addDoc(collection(db, 'userPosts'), {
                typeOfPost: postType,
                caption: caption,
                images: uploadedImageUrls,
                isBanned: false,
                userID: user.uid,
                createdAt: serverTimestamp(),
                userName:  userData?.fullName,
                likeCount: 0,
                commentCount: 0,
            })

            const postID = postRef.id;

            // NOTIFY ALL USERS IF ITS ANNOUNCEMENT
            if(postType === 'announcement'){
                const userQuery = query(collection(db, 'users'), where('role', '==', 'user'));
                const userSnapshot = await getDocs(userQuery);

                const notificationData = {
                    postID: postID,
                    content: 'posted an announcement.',
                    image: userData.profilePictureURL,
                    isRead: false,
                    senderID: user.uid,
                    senderName: userData.fullName,
                    timestamp: serverTimestamp(),
                    type: 'announcement'
                }

                for(const doc of userSnapshot.docs){
                    const userId = doc.id;
                    await addDoc(collection(db, 'notifications'), {
                        ...notificationData,
                        userId: userId,
                    })
                }
            }

            notifySuccessOrange('Post created successfully.');
            setCaption('');
            setImages([]);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        catch(error){
            console.error('Error creating post: ', error);
            notifyWarningOrange('Failed to create post. Please try again.')
        }
        setIsLoading(false);
    }

    


    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-70">
            <div className="relative bg-secondary w-[90%] sm:w-[30rem] h-[65%] rounded-lg p-3 sm:px-5 flex flex-col">
                <img onClick={closeWindow} className='w-9 p-1 border-2 border-secondary hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5'>Create Post</h1>
                <div className='flex items-center mt-4 mb-1'>
                    <p className='font-medium shrink-0'>Type of post:<span className='font-light px-3 text-sm text-white ml-2 rounded-full' style={{backgroundColor:postType === 'story' ? '#C18DEC' : postType === 'announcement' ? '#ED5050' : '#85B728'}}>{postType}</span></p>
                </div>
                <div className='flex-grow flex flex-col min-h-0 mt-1 gap-2'>
                    <textarea spellCheck="false" value={caption} onChange={(e) => setCaption(e.target.value)} className='bg-secondary leading-5 border-[1px] px-2 pt-3 pb-1 h-12 border-[#d6d6d6] rounded-md w-full outline-none' rows="1" placeholder='Enter your caption ...' />
                    {/* IMAGE THAT WILL UPLOAD */}
                    <div className='rounded-md relative flex-grow flex justify-center flex-col items-center bg-[#D9D9D9] overflow-hidden'>
                        <input id='images' className='hidden' type="file" accept='image/*' multiple onChange={handleImageChange} />
                        <p onClick={() => document.getElementById('images').click()} className='absolute bottom-4 bg-[#7E7E7E] text-sm rounded-md cursor-pointer hover:bg-[#6e6e6e] duration-150 right-4 text-white px-3 py-1'>Upload Images</p>
                        {images.length > 0 ? (
                            <div className='flex gap-2 w-full h-full items-center object-cover px-2'>
                                {images.map((image, index) => (
                                    <div className='' key={index}>
                                        <img className='object-cover rounded-md' alt={`preview-${index}`} src={URL.createObjectURL(image)} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <img className='w-20' src={addImages} alt="" />
                        )}
                    </div>
                    <button onClick={handleSubmitPost} disabled={isLoading} className='bg-primary mt-3 mb-1 font-medium rounded-md hover:bg-primaryHover duration-150 py-1 px-4 text-white w-28 mx-auto'>{isLoading ? 'POSTING...' : 'POST'}</button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost