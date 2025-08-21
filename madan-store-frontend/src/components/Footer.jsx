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
                            <a href="#"><FaFacebook /></a>
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaLinkedin /></a>
                        </div>
                    </div>
                    <div className="footer-section links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/categories">Categories</Link></li>
                            <li><Link to="/profile">My Account</Link></li>
                            <li><Link to="/#contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} Madan Store | All Rights Reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;