import React from "react";
import close from '../../assets/icons/close.svg'

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-80">
        <div className="relative">
            {/* Enlarged Image */}
            <img src={imageUrl} alt="Enlarged Pet" className="max-w-full max-h-screen" />
        </div>
        {/* Close Button */}
        <button className="absolute top-5 right-5 text-gray-900 p-2 border-2 border-secondary rounded-md" onClick={onClose}>
            <img src={close} alt="" />
        </button>
    </div>
  );
};

export default ImageModal;
