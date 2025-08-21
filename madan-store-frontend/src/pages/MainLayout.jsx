// src/pages/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CartSidebar from '../components/CartSidebar.jsx';

const MainLayout = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const toggleCart = () => setCartOpen(!isCartOpen);

    return (
        <>
            {/* The RunningBanner is now removed from here */}
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