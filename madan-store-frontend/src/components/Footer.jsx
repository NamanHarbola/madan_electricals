// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content-simple">
                    <div className="footer-section about">
                        <h2 className="logo-text">Madan Store</h2>
                        <p>
                            Your trusted partner for premium electronics and professional-grade hardware.
                        </p>
                        <div className="socials">
                            {/* FIX: Replaced '#' with actual links (placeholders for now) */}
                            <a href="https://www.facebook.com/profile.php?id=61577602794402" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                            <a href="https://www.instagram.com/madan.electricals/?hl=en" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                        </div>
                    </div>
                    <div className="footer-section links">
                        <h3>Quick Links</h3>
                        <ul>
                            {/* FIX: Changed to functional Links */}
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/#categories">Categories</Link></li>
                            <li><Link to="/profile">My Account</Link></li>
                            <li><Link to="/#contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} Madan Store | All Rights Reserved
                    <div className="developer-credit">
                        Website Developed by Naman Harbola
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;