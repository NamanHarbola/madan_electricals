// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        // Add the id="contact" here
        <footer className="footer" id="contact">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section about">
                        <h2 className="logo-text">SHOP.CO</h2>
                        <p>
                            Your trusted partner for premium electronics and professional-grade
                            hardware. Quality and customer satisfaction are our top priorities.
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
                            <li><a href="/#products">Products</a></li>
                            <li><a href="/#about">About Us</a></li>
                            <li><Link to="/profile">My Account</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section contact-form">
                        <h3>Contact Us</h3>
                        <form action="#">
                            <input type="email" name="email" className="text-input contact-input" placeholder="Your email address..." />
                            <textarea rows="3" name="message" className="text-input contact-input" placeholder="Your message..."></textarea>
                            <button type="submit" className="btn-primary">
                                Send
                            </button>
                        </form>
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
