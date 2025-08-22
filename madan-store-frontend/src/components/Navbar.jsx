// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 
import { useCart } from '../context/CartContext.jsx';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { userInfo, logout } = useAuth();
    const { cartItems } = useCart();

    const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <header className="header">
            <div className="nav-container">
                <div className="nav-logo">
                    {/* Added a class to remove the underline */}
                    <Link to="/" className="nav-logo-link">
                        <h1>Madan Store</h1>
                    </Link>
                </div>

                <nav className="nav-menu">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <a href="/#categories" className="nav-link">Categories</a>
                    <a href="/#about" className="nav-link">About Us</a>
                    <a href="/#contact" className="nav-link">Contact Us</a>
                </nav>

                <div className="nav-actions">
                    {userInfo?.isAdmin && (
                        <NavLink to="/admin/orders" className="nav-link">Admin Panel</NavLink>
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
