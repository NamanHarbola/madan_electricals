// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; // <-- CORRECTED IMPORT PATH

const AdminRoute = () => {
    const { userInfo } = useAuth();

    // Check if user is logged in AND is an admin.
    // If so, allow access to the nested routes (the admin panel).
    // Otherwise, redirect them to the login page.
    return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;