// src/pages/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const MainLayout = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    // Passive for smoother scrolling
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial state on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar scrolled={scrolled} />

      {/* Make main programmatically focusable so the skip link moves focus here */}
      <main role="main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />

      {/* Tiny style for skip link (kept here so it works without editing global CSS) */}
      <style>{`
        .skip-link{
          position:fixed;
          top:-40px; left:16px;
          background:#000; color:#fff; padding:8px 12px;
          border-radius:8px; z-index:2001; transition:top .2s ease;
        }
        .skip-link:focus{ top:10px; outline:2px solid var(--color-accent) }
      `}</style>
    </>
  );
};

export default MainLayout;
