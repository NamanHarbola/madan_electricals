// src/pages/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-content">
                <Outlet /> {/* Child pages like Orders, Products will be rendered here */}
            </main>
        </div>
    );
};

export default AdminLayout;