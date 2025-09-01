// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        {/* Footer nav landmark for quick links */}
        <nav className="footer-content-simple" aria-label="Footer">
          {/* Brand & about */}
          <section className="footer-section about" aria-labelledby="footer-brand-heading">
            <h2 id="footer-brand-heading" className="logo-text">Madan Store</h2>
            <p>Your trusted partner for premium electronics and professional-grade hardware.</p>

            {/* Social links with accessible names */}
            <ul className="socials" aria-label="Social media" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 12 }}>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61577602794402"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Madan Store on Facebook (opens in a new tab)"
                  title="Facebook"
                >
                  <FaFacebook aria-hidden="true" focusable="false" />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Madan Store on X (opens in a new tab)"
                  title="X (Twitter)"
                >
                  <FaTwitter aria-hidden="true" focusable="false" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/madan.electricals/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Madan Store on Instagram (opens in a new tab)"
                  title="Instagram"
                >
                  <FaInstagram aria-hidden="true" focusable="false" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Madan Store on LinkedIn (opens in a new tab)"
                  title="LinkedIn"
                >
                  <FaLinkedin aria-hidden="true" focusable="false" />
                </a>
              </li>
            </ul>
          </section>

          {/* Quick links */}
          <section className="footer-section links" aria-labelledby="footer-quick-links">
            <h3 id="footer-quick-links">Quick Links</h3>
            <ul>
              <li><Link to="/" aria-label="Go to Home page">Home</Link></li>
              <li><Link to="/#categories" aria-label="Jump to Categories section">Categories</Link></li>
              <li><Link to="/profile" aria-label="Go to My Account">My Account</Link></li>
              <li><Link to="/#contact" aria-label="Jump to Contact section">Contact</Link></li>
            </ul>
          </section>
        </nav>

        {/* Legal strip */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Madan Store | All Rights Reserved</span>
          <div className="developer-credit">Website Developed by Naman Harbola</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
