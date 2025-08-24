// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; // <-- CORRECTED IMPORT PATH

const ProtectedRoute = () => {
    const { userInfo } = useAuth();

    // If user is logged in, show the child route's content.
    // Otherwise, redirect them to the login page.
    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;