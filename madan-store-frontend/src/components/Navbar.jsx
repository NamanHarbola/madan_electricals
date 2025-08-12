// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = ({ onAdminClick }) => {
    const { userInfo, logout } = useAuth();
    // 1. Add state to manage the dropdown's visibility
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false); // Close dropdown on logout
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/"><h1>Madan Store</h1></Link>
                </div>
                <div className="nav-menu">
                    <Link to="/" className="nav-link">Home</Link>
                    {userInfo && userInfo.isAdmin && (
                        <button className="nav-link admin-btn" onClick={onAdminClick}>
                            Admin
                        </button>
                    )}
                </div>
                <div className="nav-actions">
                    {/* ... (search-box) ... */}

                    {userInfo ? (
                        // 2. This container is now a button to toggle the dropdown
                        <div className="nav-user-info">
                            <button 
                                className="nav-link" 
                                onClick={() => setDropdownOpen(!isDropdownOpen)}
                                style={{ background: 'none', border: 'none', color: 'var(--color-primary)' }}
                            >
                                Hi, {userInfo.name} <i className="fas fa-chevron-down" style={{ fontSize: '12px', marginLeft: '4px' }}></i>
                            </button>
                            
                            {/* 3. Conditionally render the dropdown menu */}
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <button onClick={handleLogout} className="dropdown-item">
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">Login</Link>
                    )}
                    {/* ... (cart-icon) ... */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;