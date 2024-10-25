import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import LoadingScreen from './LoadingScreen';

const PrivateRoute = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return user && user.emailVerified ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
