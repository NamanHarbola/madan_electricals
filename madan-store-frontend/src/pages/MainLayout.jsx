// src/pages/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const MainLayout = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // ✅ Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Run once on mount to set initial state (in case user reloads mid-page)
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar scrolled={scrolled} />
      <main role="main" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
