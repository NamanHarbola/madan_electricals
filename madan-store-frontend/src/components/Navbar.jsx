// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ toggleCart }) => {
    const { userInfo, logout } = useAuth();
    const { cartItems } = useCart();
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const searchHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
        setKeyword('');
        if (isMobileMenuOpen) setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) setMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="header">
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/"><h1>Madan Store</h1></Link>
                </div>

                <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <NavLink to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                    
                    {/* Category Dropdown */}
                    <div className="nav-dropdown" onMouseLeave={() => setCategoryDropdownOpen(false)}>
                        <button className="nav-link" onMouseEnter={() => setCategoryDropdownOpen(true)}>
                            Categories
                        </button>
                        {categoryDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/category/electronics" onClick={() => setCategoryDropdownOpen(false)}>Electronics</Link>
                                <Link to="/category/hardware" onClick={() => setCategoryDropdownOpen(false)}>Hardware</Link>
                            </div>
                        )}
                    </div>
                    
                    <a href="/#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
                </nav>

                <div className="nav-actions">
                     <form onSubmit={searchHandler} className="nav-search desktop-only">
                        <input type="text" onChange={(e) => setKeyword(e.target.value)} value={keyword} placeholder="Search..." />
                        <button type="submit">Go</button>
                    </form>

                    {userInfo ? (
                        <div className="nav-dropdown" onMouseLeave={() => setUserDropdownOpen(false)}>
                            <button className="nav-user-btn" onMouseEnter={() => setUserDropdownOpen(true)}>
                                <img src={`https://ui-avatars.com/api/?name=${userInfo.name.replace(/\s/g, '+')}&background=4a5568&color=fff`} alt={userInfo.name} />
                            </button>
                            {userDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" onClick={() => setUserDropdownOpen(false)}>Profile</Link>
                                    {userInfo.isAdmin && <Link to="/admin/orders" onClick={() => setUserDropdownOpen(false)}>Admin Panel</Link>}
                                    <button onClick={logout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="desktop-only">
                            <Link to="/login" className="nav-link">Login</Link>
                        </div>
                    )}

                    <div className="cart-icon" onClick={toggleCart}>
                        <FaShoppingCart />
                        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                    </div>
                    
                    <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
