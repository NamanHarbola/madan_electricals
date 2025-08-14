// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { FaShoppingCart, FaUserCircle, FaSearch } from 'react-icons/fa';

const Navbar = ({ toggleCart }) => {
    const { userInfo, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        const keyword = e.target.elements.q.value;
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        }
    };

    return (
        <>
            <div className="top-bar">
                Sign up and get 20% off to your first order. 
                <NavLink to="/signup" style={{textDecoration: 'underline', marginLeft: '8px'}}>Sign Up Now</NavLink>
            </div>
            <header className="header">
                <div className="nav-container">
                    <div className="nav-logo">
                        <Link to="/"><h1>SHOP.CO</h1></Link>
                    </div>

                    <nav className="nav-menu">
                        <NavLink to="/" className="nav-link">Home</NavLink>
                        <a href="/#products" className="nav-link">Products</a>
                        <a href="/#about" className="nav-link">About</a>
                        <a href="/#contact" className="nav-link">Contact</a>
                        {userInfo && userInfo.isAdmin && (
                            <Link to="/admin/orders" className="nav-link">Admin Panel</Link>
                        )}
                    </nav>

                    <div className="nav-actions">
                        <form onSubmit={handleSearch} className="nav-search">
                            <FaSearch style={{color: 'var(--color-text-secondary)'}} />
                            <input type="text" name="q" placeholder="Search..." />
                        </form>
                        <div className="cart-icon" onClick={toggleCart}>
                            <FaShoppingCart />
                            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                        </div>
                        <div className="nav-dropdown">
                             <Link to={userInfo ? "/profile" : "/login"} className="nav-user-icon">
                                <FaUserCircle />
                            </Link>
                            {userInfo && (
                                <div className="dropdown-menu">
                                    <Link to="/profile">My Profile</Link>
                                    <button onClick={logout}>Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
