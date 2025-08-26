// src/components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaBullhorn,
  FaTags,
  FaInfoCircle
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth.js';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `sidebar-link${isActive ? ' active' : ''}`;

  return (
    <aside className="admin-sidebar" aria-label="Admin sidebar">
      <div className="sidebar-header">
        <h2 id="admin-sidebar-title" style={{ margin: 0 }}>Madan Store</h2>
      </div>

      {/* Primary admin navigation */}
      <nav className="sidebar-nav" aria-labelledby="admin-sidebar-title" role="navigation">
        <NavLink to="/admin/dashboard" className={linkClass} aria-label="Dashboard">
          <FaTachometerAlt aria-hidden="true" focusable="false" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/orders" className={linkClass} aria-label="Orders">
          <FaShoppingCart aria-hidden="true" focusable="false" />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/admin/products" className={linkClass} aria-label="Products">
          <FaBoxOpen aria-hidden="true" focusable="false" />
          <span>Products</span>
        </NavLink>

        <NavLink to="/admin/categories" className={linkClass} aria-label="Categories">
          <FaTags aria-hidden="true" focusable="false" />
          <span>Categories</span>
        </NavLink>

        <NavLink to="/admin/banners" className={linkClass} aria-label="Banners">
          <FaBullhorn aria-hidden="true" focusable="false" />
          <span>Banners</span>
        </NavLink>

        <NavLink to="/admin/customers" className={linkClass} aria-label="Customers">
          <FaUsers aria-hidden="true" focusable="false" />
          <span>Customers</span>
        </NavLink>

        <NavLink to="/admin/about" className={linkClass} aria-label="Manage About Page">
          <FaInfoCircle aria-hidden="true" focusable="false" />
          <span>Manage About Page</span>
        </NavLink>
      </nav>

      {/* Footer actions */}
      <div className="sidebar-footer">
        <button
          type="button"
          onClick={logout}
          className="sidebar-link logout-btn"
          aria-label="Log out"
        >
          <FaSignOutAlt aria-hidden="true" focusable="false" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
