import React from 'react';
import logo from '../../assets/images/white-paws.png'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-secondary z-50">
      <img
        src={logo}
        alt="Paws Logo"
        className="w-24 h-24 object-contain animate-bounce"
      />
    </div>
  );
};

export default LoadingScreen;
