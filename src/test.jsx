const handleSubmitPost = async () => {
    if (isLoading) return;
    if (!caption.trim()) {
        notifyWarningOrange('Please enter a caption.');
        return;
    }
    if (!images || images.length === 0) {
        notifyWarningOrange('Please upload an image.');
        return;
    }

    setIsLoading(true);

    try {
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
            userName: userData?.fullName,
            likeCount: 0,
            commentCount: 0,
        });

        const postID = postRef.id; // Get the document ID of the newly created post

        // Send notifications to all users only if typeOfPost is "announcement"
        if (postType === "announcement") {
            // Step 1: Get all users with role "user"
            const usersQuery = query(collection(db, 'users'), where('role', '==', 'user'));
            const usersSnapshot = await getDocs(usersQuery);

            // Step 2: Prepare notification data with the document ID as postID
            const notificationData = {
                content: "A new announcement has been posted!",
                isRead: false,
                senderID: user.uid,
                senderName: userData?.fullName,
                timestamp: serverTimestamp(),
                type: "announcement",
                postID: postID, // Include the postID (document ID) in the notification
            };

            // Step 3: Add notification for each user
            for (const doc of usersSnapshot.docs) {
                const userId = doc.id;
                await addDoc(collection(db, 'notifications'), {
                    ...notificationData,
                    userId: userId, // Attach notification to the specific user
                });
            }
        }

        notifySuccessOrange('Post created successfully.');
        setCaption('');
        setImages([]);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error('Error creating post: ', error);
        notifyWarningOrange('Failed to create post. Please try again.');
    }
    setIsLoading(false);
};
