import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import LoadingScreen from './LoadingScreen';

const PrivateRoute = ({allowedRoles}) => {
    const { user, userData, isRoleLoading, isLoading } = useContext(AuthContext);

    if (isLoading || isRoleLoading) {
        return <LoadingScreen />;
    }

    // Redirect to login page if no authenticated user is found
    if (!user || !user.emailVerified) {
        return <Navigate to="/" />;
    }

    // Check if user's role matches allowed roles for the route
    if (allowedRoles && !allowedRoles.includes(userData?.role)) {
        // Redirect unauthorized users based on their role
        return userData?.role === 'user'
            ? <Navigate to="/dashboard/find-pet" />
            : <Navigate to="/admin/pet-management" />;
    }

    // Render the route's children if authentication and role checks pass
    return <Outlet />;
};

export default PrivateRoute;
