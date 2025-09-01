// src/pages/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';

const skipStyle = {
  position: 'absolute',
  left: '-9999px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
};

const skipStyleFocus = {
  position: 'fixed',
  left: '12px',
  top: '12px',
  width: 'auto',
  height: 'auto',
  padding: '10px 14px',
  background: '#08747c',
  color: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,.15)',
  zIndex: 3000,
};

export default function AdminLayout() {
  // we toggle styles based on :focus via a tiny React trick
  const [skipFocused, setSkipFocused] = React.useState(false);

  return (
    <div className="admin-layout">
      {/* Skip to content link for keyboard users */}
      <a
        href="#admin-main"
        onFocus={() => setSkipFocused(true)}
        onBlur={() => setSkipFocused(false)}
        style={skipFocused ? skipStyleFocus : skipStyle}
      >
        Skip to main content
      </a>

      {/* Sidebar is already an <aside> in AdminSidebar */}
      <AdminSidebar />

      {/* Main content area with landmark + focus target */}
      <main
        id="admin-main"
        className="admin-content"
        role="main"
        tabIndex={-1}
        aria-live="polite"
      >
        <Outlet />
      </main>
    </div>
  );
}
