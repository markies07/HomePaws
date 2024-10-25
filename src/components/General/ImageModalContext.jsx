import React ,{ createContext, useContext, useState } from "react";
import ImageModal from "./ImageModal";


const ImageModalContext = createContext();

export const useImageModal = () => {
    return useContext(ImageModalContext);
}

export const ImageModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImagesUrl] = useState(null);

    const showModal = (url) => {
        setImagesUrl(url);
        setIsOpen(true);
    }

    const hideModal = () => {
        setImagesUrl(null);
        setIsOpen(false);
    }

    return (
        <ImageModalContext.Provider value={{ isOpen, imageUrl, showModal, hideModal }}>
            {children}
            {isOpen && <ImageModal imageUrl={imageUrl} onClose={hideModal} />}

        </ImageModalContext.Provider>
    )
}