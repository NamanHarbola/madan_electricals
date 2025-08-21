// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ toggleCart }) => {
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
                    <NavLink to="/category/air-conditioner" className="nav-link">Air Conditioner</NavLink>
                    <NavLink to="/category/electricals" className="nav-link">Electricals</NavLink>
                    <NavLink to="/category/heater-blower" className="nav-link">Heater & Blower</NavLink>
                    <NavLink to="/category/chimney" className="nav-link">Chimney</NavLink>
                    <NavLink to="/category/accessories" className="nav-link">Accessories</NavLink>
                    <NavLink to="/about" className="nav-link">About</NavLink>
                </nav>

                <div className="nav-actions">
                    {userInfo?.isAdmin && (
                        <NavLink to="/admin/orders" className="nav-link">Admin Panel</NavLink>
                    )}

                    <div className="cart-icon-wrapper" onClick={toggleCart}>
                        <FaShoppingCart />
                        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                    </div>

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
