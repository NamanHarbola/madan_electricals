// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Navbar = ({ toggleCart }) => {
    const { userInfo, logout } = useAuth();
    const { cartItems } = useCart();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="navbar scrolled"> {/* Always have a background for clarity */}
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/"><h1>Madan Store</h1></Link>
                </div>

                <div className="nav-menu">
                    <NavLink to="/" className="nav-link" end>Home</NavLink>
                    <a href="/#about" className="nav-link">About</a>
                    <a href="/#services" className="nav-link">Services</a>
                    <a href="/#contact" className="nav-link">Contact</a>
                </div>

                <div className="nav-actions">
                    {userInfo ? (
                        <div className="nav-user-info" onMouseLeave={() => setDropdownOpen(false)}>
                            <button
                                className="nav-link"
                                onMouseEnter={() => setDropdownOpen(true)}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                <img src={`https://ui-avatars.com/api/?name=${userInfo.name.replace(/\s/g, '+')}&background=random&color=fff`} alt={userInfo.name} style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }} />
                                {userInfo.name}
                            </button>

                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        <i className="fas fa-user"></i> Profile
                                    </Link>
                                    {userInfo.isAdmin && (
                                        <Link to="/admin/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            <i className="fas fa-user-shield"></i> Admin Panel
                                        </Link>
                                    )}
                                    <button onClick={logout} className="dropdown-item">
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="btn-accent" style={{marginLeft: '10px', padding: '8px 20px'}}>Sign Up</Link>
                        </>
                    )}

                    <div className="cart-icon" onClick={toggleCart} style={{cursor: 'pointer', position: 'relative'}}>
                        <i className="fas fa-shopping-cart nav-link"></i>
                        {cartItemCount > 0 && (
                            <span className="cart-count">{cartItemCount}</span>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
