// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../context/CartContext.jsx';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ scrolled }) => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const [open, setOpen] = useState(false);
  const location = useLocation();

  const closeDrawer = () => setOpen(false);

  const handleScrollLink = (e, targetId) => {
    if (location.pathname !== '/') return;
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    closeDrawer();
  };

  // Close drawer on route change
  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeDrawer();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      {/* Promo banner */}
      <div className="discount-banner" aria-live="polite">
        <p>Special discount on all products! FESTIVAL DISCOUNT</p>
      </div>

      <div className="nav-container" role="navigation" aria-label="Primary">
        {/* Brand */}
        <div className="nav-logo">
          <Link to="/" className="nav-logo-link" onClick={closeDrawer}>
            <h1 style={{ margin: 0, color: '#fff' }}>Madan Store</h1>
          </Link>
        </div>

        {/* Desktop menu */}
        <nav className="nav-menu" aria-label="Desktop">
          <NavLink to="/" className="nav-link" onClick={closeDrawer}>Home</NavLink>
          <Link to="/#categories" className="nav-link" onClick={(e) => handleScrollLink(e, 'categories')}>Categories</Link>
          <Link to="/#about" className="nav-link" onClick={(e) => handleScrollLink(e, 'about')}>About Us</Link>
          <Link to="/#contact" className="nav-link" onClick={(e) => handleScrollLink(e, 'contact')}>Contact Us</Link>
          {userInfo?.isAdmin && (
            <NavLink to="/admin/dashboard" className="nav-link">Admin Panel</NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="nav-actions">
          <Link to="/checkout" className="cart-icon-wrapper" aria-label={`Cart (${cartItemCount})`} onClick={closeDrawer}>
            <FaShoppingCart />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>

          {userInfo ? (
            <>
              <NavLink to="/profile" className="nav-link icon-link" title={userInfo.name} onClick={closeDrawer}>
                <FaUserCircle />
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="btn-logout desktop-only"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn-login desktop-only" onClick={closeDrawer}>
              Login
            </NavLink>
          )}

          {/* Hamburger (animated) */}
          <button
            type="button"
            className={`nav-toggle ${open ? 'open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => setOpen(v => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Backdrop (click to close) */}
      {open && <div className="drawer-backdrop" onClick={closeDrawer} />}

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${open ? 'open' : ''}`} role="menu" aria-label="Mobile">
        <NavLink to="/" className="nav-link" onClick={closeDrawer}>Home</NavLink>
        <Link to="/#categories" className="nav-link" onClick={(e) => handleScrollLink(e, 'categories')}>Categories</Link>
        <Link to="/#about" className="nav-link" onClick={(e) => handleScrollLink(e, 'about')}>About Us</Link>
        <Link to="/#contact" className="nav-link" onClick={(e) => handleScrollLink(e, 'contact')}>Contact Us</Link>
        {userInfo?.isAdmin && (
          <NavLink to="/admin/dashboard" className="nav-link" onClick={closeDrawer}>Admin Panel</NavLink>
        )}
        <div className="drawer-footer">
          {userInfo ? (
            <button
              type="button"
              onClick={() => { logout(); closeDrawer(); }}
              className="btn-logout"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="btn-login" onClick={closeDrawer}>
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
