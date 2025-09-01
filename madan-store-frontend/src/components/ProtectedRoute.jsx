// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

/**
 * Usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/profile" element={<ProfilePage />} />
 * </Route>
 *
 * For admin-only:
 * <Route element={<ProtectedRoute requireAdmin />}>
 *   <Route path="/admin/dashboard" element={<AdminDashboard />} />
 * </Route>
 */
const ProtectedRoute = ({ requireAdmin = false }) => {
  const { userInfo, loading } = useAuth(); // make sure your hook exposes `loading` while restoring session
  const location = useLocation();

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '50vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!userInfo) {
    // preserve where the user was trying to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !userInfo.isAdmin) {
    // non-admins go home (or a 403 page if you have one)
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
