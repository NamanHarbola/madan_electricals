// src/pages/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CartSidebar from '../components/CartSidebar.jsx';
import RunningBanner from '../components/RunningBanner.jsx'; // Import banner

const MainLayout = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const toggleCart = () => setCartOpen(!isCartOpen);

    return (
        <>
            <RunningBanner /> {/* Use the dynamic banner */}
            <Navbar toggleCart={toggleCart} />
            <main>
                <Outlet />
            </main>
            <Footer />
            <CartSidebar isCartOpen={isCartOpen} toggleCart={toggleCart} />
        </>
    );
};

export default MainLayout;