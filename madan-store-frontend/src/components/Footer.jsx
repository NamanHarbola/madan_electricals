// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Madan Store</h3>
                        <p>Your trusted partner for electronics and hardware tools.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <Link to="/">Home</Link>
                        <a href="/#products">Products</a>
                        <a href="/#about">About</a>
                        <a href="/#contact">Contact</a>
                    </div>
                    <div className="footer-section">
                        <h4>Categories</h4>
                        <a href="/#products">Electronics</a>
                        <a href="/#products">Hardware Tools</a>
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
    );
};

export default Footer;