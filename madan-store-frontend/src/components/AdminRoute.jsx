// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const AdminRoute = () => {
  const { userInfo, loading } = useAuth?.() ?? {}; // in case hook shape changes
  const location = useLocation();

  // Still resolving auth? Avoid redirect flicker.
  if (loading) return null; // or a tiny inline spinner

  // Not logged in → send to login with returnTo
  if (!userInfo) {
    return <Navigate to="/login" replace state={{ returnTo: location.pathname + location.search }} />;
  }

  // Logged in but not admin → optional: send to home or a 403 page
  if (!userInfo.isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
