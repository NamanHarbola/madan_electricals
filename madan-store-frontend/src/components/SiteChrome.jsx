// src/components/SiteChrome.jsx

import React from 'react';
import AddProductForm from './AddProductForm'; // 1. The new component is imported

const SiteChrome = ({
  showAdminLogin,
  setShowAdminLogin,
  showAdminPanel,
  setShowAdminPanel,
}) => {
  return (
    <>
      {/* Admin Login Modal */}
      {!showAdminLogin ? null : (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Admin Login</h3>
              <button /* ... */ onClick={(e) => {
                e.preventDefault();
                onAdminLoginSuccess(); // Use the function passed from App.jsx
              }}>
                Login as Admin
              </button>
            </div>
            <form id="adminLoginForm">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Admin Username" id="adminUsername" required />
              </div>
              <div className="form-group">
                <input type="password" className="form-control" placeholder="Admin Password" id="adminPassword" required />
              </div>
              <button type="submit" className="btn btn--primary btn--full-width" onClick={(e) => {
                e.preventDefault();
                setShowAdminLogin(false);
                setShowAdminPanel(true);
              }}>
                Login as Admin
              </button>
            </form>
            <p className="admin-creds">Demo credentials: admin / password123</p>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {!showAdminPanel ? null : (
        <div className="admin-panel">
          <div className="admin-header">
            <h2>Admin Panel - Madan Store</h2>
            <button className="btn btn--secondary" onClick={() => setShowAdminPanel(false)}>Close</button>
          </div>
          <div className="admin-content">
            <div className="admin-tabs">
              <button className="tab-btn active">Products</button>
              <button className="tab-btn">Orders</button>
              <button className="tab-btn">Analytics</button>
            </div>
            <div className="admin-tab-content">
              {/* 2. The AddProductForm component is now rendered here */}
              <AddProductForm />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Madan Store</h3>
              <p>Your trusted partner for electronics and hardware tools.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#home">Home</a>
              <a href="#products">Products</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Categories</h4>
              <a href="#products">Electronics</a>
              <a href="#products">Hardware Tools</a>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Madan Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default SiteChrome;