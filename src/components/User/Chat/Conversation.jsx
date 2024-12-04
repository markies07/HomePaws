import React, { useContext, useEffect, useRef, useState } from 'react'
import back from './assets/back.svg'
import deleteMessage from './assets/delete.svg'
import image from './assets/image.svg'
import send from './assets/send.svg'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { AuthContext } from '../../General/AuthProvider'
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../../firebase/firebase'
import { notifyErrorOrange } from '../../General/CustomToast'
import { confirm } from '../../General/CustomAlert'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useImageModal } from '../../General/ImageModalContext'
import emailjs from '@emailjs/browser';

function Conversation() {
    const navigate = useNavigate();
    const [setChats, isnewMessage, setIsNewMessage] = useOutletContext();
    const { user, userData } = useContext(AuthContext);
    const { chatID } = useParams();
    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState([]); 
    const [newMessage, setNewMessage] = useState('');
    const imageInputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showModal } = useImageModal();

    // FETCHING MESSAGES
    useEffect(() => {
        setLoading(true);
        if (!chatID) return;

        try{
            const fetchOtherUser = async () => {
                const chatRef = doc(db, 'chats', chatID);
                const chatDoc = await getDoc(chatRef);
        
                if (chatDoc.exists()) {
                    const chatData = chatDoc.data();
                    const otherUserID = chatData.participants.find(uid => uid !== user.uid);
        
                    if (otherUserID) {
                        const otherUserRef = doc(db, 'users', otherUserID);
                        const otherUserDoc = await getDoc(otherUserRef);
        
                        if (otherUserDoc.exists()) {
                            setOtherUser(otherUserDoc.data());
                        }
                    }
                }
            };
        
            fetchOtherUser();
    
        
            const q = query(
                collection(db, 'chats', chatID, `messages_${user.uid}`),
                orderBy('sentAt')
            );
        
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(fetchedMessages);
            });
            return () => unsubscribe();
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
        
    }, [chatID]);

    // Function to send email notifications using EmailJS
    const sendEmailNotification = async (recipientEmail, senderName) => {
        try {
            const templateParams = {
                subject: `You have a new message in HomePaws`,
                message: `${senderName} sent you a message. \n click here: https://paws-ae1eb.web.app/`,
                email: recipientEmail
            };

            // Replace these with your EmailJS credentials
            const SERVICE_ID = 'service_yii1sji';
            const TEMPLATE_ID = 'template_eti1vex';
            const USER_ID = 'JT0EGxZqCSR3-9IIa';

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
            console.log(`Email notification sent to ${recipientEmail}`);
        } catch (error) {
            console.error('Failed to send email notification: ', error);
        }
    };
    
    // For sending messages
    const handleSendMessage = async (imageUrl = null) => {
        // Prevent page reload is handled in form submission
        const chatRef = doc(db, 'chats', chatID);
        const chatDoc = await getDoc(chatRef);
        const chatData = chatDoc.data();
        const otherUserID = chatData.participants.find(uid => uid !== user.uid);
        
        try {
            const message1 = {
                sender: user.uid,
                text: newMessage || '', // Use text if available
                sentAt: serverTimestamp(),
                read: true,
                image: imageUrl || null // Add the image URL if provided
            };

            const message2 = {
                sender: user.uid,
                text: newMessage || '', // Use text if available
                sentAt: serverTimestamp(),
                read: false,
                image: imageUrl || null // Add the image URL if provided
            };
    
            const messagesRefUser1 = collection(db, 'chats', chatID, `messages_${user.uid}`);
            const messagesRefUser2 = collection(db, 'chats', chatID, `messages_${otherUserID}`);
    
            await addDoc(messagesRefUser1, message1);
            await addDoc(messagesRefUser2, message2);
    
            await updateDoc(chatRef, {
                latestMessage: {
                    text: newMessage || imageUrl,  // Update latestMessage to reflect either text or image
                    sentAt: serverTimestamp()
                }
            });


            if (otherUser && otherUser.lastActive) {
                const now = Timestamp.now();
                const lastActive = otherUser.lastActive;
                const differenceInMinutes = (now.toMillis() - lastActive.toMillis()) / (1000 * 60);

                if (differenceInMinutes >= 3) {
                    // User has been inactive for 3 minutes or more
                    await sendEmailNotification(otherUser.email, user.displayName || 'Someone');
                }
            }
    
            // Clear message input and imageUrl state
            setNewMessage('');
            setImageUrl(null); // Reset the image URL state after sending
        } catch (error) {
            console.error('Error sending message: ', error);
            notifyErrorOrange('Error sending message. Please try again.');
        }
    };

    const now = Timestamp.now();
    const lastActive = otherUser?.lastActive;
    const differenceInMinutes = (now.toMillis() - lastActive?.toMillis()) / (1000 * 60);

    console.log(differenceInMinutes)



    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const storageRef = ref(storage, `images/${file.name}`);
        
        try {
            // Upload the image to Firebase Storage
            await uploadBytes(storageRef, file);
            const uploadedImageUrl = await getDownloadURL(storageRef);
            
            // Call the handleSendMessage to send the image
            await handleSendMessage(uploadedImageUrl); // Automatically send the image message
    
            // Optionally, reset the image input after sending
            e.target.value = null; // Reset file input
        } catch (error) {
            console.error('Error uploading image: ', error);
            notifyErrorOrange('Error uploading image. Please try again.');
        }
    };
    
    // Deleting conversation
    const deleteConversation = async () => {
        confirm(`Deleting Conversation`, `Are you sure you want to delete this conversation?`).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Get references to message collections
                    const currentUserMessagesRef = collection(db, 'chats', chatID, `messages_${user.uid}`);
                    const chatDoc = await getDoc(doc(db, 'chats', chatID));
                    const chatData = chatDoc.data();
                    const otherUserID = chatData.participants.find(uid => uid !== user.uid);
                    const otherUserMessagesRef = collection(db, 'chats', chatID, `messages_${otherUserID}`);
                
                    // Delete current user's messages
                    const currentUserMessagesSnapshot = await getDocs(currentUserMessagesRef);
                    const deletePromises = currentUserMessagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
                    await Promise.all(deletePromises);
                
                    // Check if both message collections are now empty
                    const updatedCurrentUserMessagesSnapshot = await getDocs(currentUserMessagesRef);
                    const otherUserMessagesSnapshot = await getDocs(otherUserMessagesRef);
                
                    if (updatedCurrentUserMessagesSnapshot.empty && otherUserMessagesSnapshot.empty) {
                        await deleteDoc(doc(db, 'chats', chatID));
                    }
                
                    // Update UI
                    setChats(prevChats => prevChats.filter(chat => chat.id !== chatID));
                    navigate('/dashboard/chat');
                } catch (error) {
                    console.error('Error deleting conversation: ', error);
                    notifyErrorOrange('There was an issue deleting this conversation. Please try again');
                }
            }
        });
    };

    // CANCELING NEW CONVERSATION
    const handleCancelChat = async () => {
        const messagesRefUser = collection(db, 'chats', chatID, `messages_${user.uid}`);
        const messagesSnapshotUser = await getDocs(messagesRefUser);

        // Get the chat document to find the other user's UID
        const chatRef = doc(db, 'chats', chatID);
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) return;

        const chatData = chatDoc.data();
        const otherUserID = chatData.participants.find(uid => uid !== user.uid);

        // Check the other user's messages
        const messagesRefOtherUser = collection(db, 'chats', chatID, `messages_${otherUserID}`);
        const messagesSnapshotOtherUser = await getDocs(messagesRefOtherUser);

        // If both the current user's and the other user's message collections are empty
        if (messagesSnapshotUser.empty && messagesSnapshotOtherUser.empty) {
            await deleteDoc(chatRef); // Delete the chatID only if both are empty
        }
        setIsNewMessage(false);
        navigate('/dashboard/chat');
    }


    // SCROLL DOWN TO THE LATEST MESSAGE
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    

    return (
        <div className='w-full h-full flex flex-col font-poppins'>

            {/* CONVERSATION */}
            <div className='bg-[#E9E9E9] w-full h-full flex flex-col flex-grow sm:rounded-lg'>
                <div className='flex justify-center items-center relative px-5 py-4 border-b-[1px] border-text'>
                    <img onClick={!isnewMessage ? () => navigate('/dashboard/chat') : handleCancelChat} className='absolute left-4 border-2 border-transparent hover:border-text duration-150 cursor-pointer p-1 w-10' src={back} alt="" />
                    <p className='font-medium text-xl px-10 text-center leading-5'>{otherUser.fullName}</p>
                    <img onClick={deleteConversation} className='absolute right-5 cursor-pointer' src={deleteMessage} alt="" />
                </div>

                {/* MESSAGES */}
                <div className='p-4 flex flex-col overflow-y-auto max-h-[calc(100dvh-295px)] md:max-h-[calc(100dvh-327px)] lg:max-h-[calc(100dvh-265px)] gap-3 flex-grow h-full'>

                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">Loading messages...</p>
                    </div>
                ) :
                messages.map((message) => (
                    message.sender === user.uid ? (
                        // RECIEVER
                        <div key={message.id} className='flex w-full justify-end'>
                            {/* MESSAGE */}
                            <div className='w-[60%] flex justify-end'>
                                {message.image ? ( // Check if there's an image
                                    <img src={message.image} onClick={() => showModal(message.image)} alt="sent" className='max-w-full cursor-pointer rounded-lg mb-2' />
                                ) : (
                                    <p className='bg-primary w-fit py-2 px-3 object-cover rounded-2xl rounded-br-none text-white'>{message.text}</p>
                                )}
                            </div>
                            {/* PROFILE */}
                            <img className='w-10 h-10 self-end shrink-0 rounded-full bg-text ml-3' src={userData.profilePictureURL} alt="" />
                        </div>
                    ) : (
                        // SENDER
                        <div key={message.id} className='flex w-full justify-start'>
                            {/* PROFILE */}
                            <img className='w-10 h-10 self-end object-cover shrink-0 rounded-full bg-text mr-3' src={otherUser.profilePictureURL} alt="" />
                            {/* MESSAGE */}
                            <div className='w-[60%]'>
                                {message.image ? ( // Check if there's an image
                                    <img src={message.image} onClick={() => showModal(message.image)} alt="received" className='max-w-full cursor-pointer rounded-lg mb-2' />
                                ) : (
                                    <p className='bg-text w-fit py-2 px-3 rounded-2xl rounded-bl-none text-white'>{message.text}</p>
                                )}
                            </div>
                        </div>
                    )
                ))}

                    <div ref={messagesEndRef} />

                </div>

                {/* ACTIONS */}
                <form onSubmit={(e) => {e.preventDefault(); handleSendMessage();}} className='flex px-4 py-4 border-t-[1px] border-text'>
                    <input type="file" accept='image/*' onChange={handleImageUpload} className='hidden' ref={imageInputRef} />
                    <img onClick={() => imageInputRef.current.click()} className='w-10 overflow-visible p-[9px] bg-[#BCBCBC] hover:bg-[#adadad] cursor-pointer duration-150 rounded-full' src={image} alt="" />
                    <input required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className='w-full mx-4 rounded-full px-3 outline-none' placeholder='Aa' type="text" />
                    <button type='submit' className='w-10 shrink-0 h-10 flex justify-center items-center overflow-visible bg-[#BCBCBC] hover:bg-[#adadad] cursor-pointer duration-150 rounded-full'>
                        <img className='w-6 h-6 ml-1' src={send} alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Conversation