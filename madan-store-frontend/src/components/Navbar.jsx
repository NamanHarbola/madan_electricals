// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; 
import { useCart } from '../context/CartContext.jsx';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ scrolled }) => {
    const { userInfo, logout } = useAuth();
    const { cartItems } = useCart();

    const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleScrollLink = (e, targetId) => {
        if (window.location.pathname !== '/') {
            return;
        }
        
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="discount-banner">
                <p>Special discount on all products! FESTIVAL OFFER DISCOUNT</p>
            </div>
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/" className="nav-logo-link">
                        <h1>Madan Store</h1>
                    </Link>
                </div>

                <nav className="nav-menu">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <Link to="/#categories" className="nav-link" onClick={(e) => handleScrollLink(e, 'categories')}>Categories</Link>
                    <Link to="/#about" className="nav-link" onClick={(e) => handleScrollLink(e, 'about')}>About Us</Link>
                    <Link to="/#contact" className="nav-link" onClick={(e) => handleScrollLink(e, 'contact')}>Contact Us</Link>
                </nav>

                <div className="nav-actions">
                    {userInfo?.isAdmin && (
                        <NavLink to="/admin/dashboard" className="nav-link">Admin Panel</NavLink>
                    )}

                    <Link to="/checkout" className="cart-icon-wrapper">
                        <FaShoppingCart />
                        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                    </Link>

                    {userInfo ? (
                        <>
                             <NavLink to="/profile" className="nav-link icon-link">
                                <FaUserCircle title={userInfo.name} />
                            </NavLink>
                            <button onClick={logout} className="nav-link">Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="nav-link">Login</NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;