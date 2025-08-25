// src/components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaCog, FaSignOutAlt, FaBullhorn, FaTags, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth.js';

const AdminSidebar = () => {
    const { logout } = useAuth();
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2>Madan Store</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" className="sidebar-link">
                    <FaTachometerAlt /><span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/orders" className="sidebar-link">
                    <FaShoppingCart /><span>Orders</span>
                </NavLink>
                <NavLink to="/admin/products" className="sidebar-link">
                    <FaBoxOpen /><span>Products</span>
                </NavLink>
                <NavLink to="/admin/categories" className="sidebar-link">
                    <FaTags /><span>Categories</span>
                </NavLink>
                <NavLink to="/admin/banners" className="sidebar-link">
                    <FaBullhorn /><span>Banners</span>
                </NavLink>
                <NavLink to="/admin/customers" className="sidebar-link">
                    <FaUsers /><span>Customers</span>
                </NavLink>
                <NavLink to="/admin/about" className="sidebar-link">
                    <FaInfoCircle /><span>Manage About Page</span>
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                {/* FIX: Removed the non-functional Settings link */}
                <button onClick={logout} className="sidebar-link logout-btn">
                    <FaSignOutAlt /><span>Log out</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;