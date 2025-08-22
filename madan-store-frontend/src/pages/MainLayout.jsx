// src/pages/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const MainLayout = () => {
    

    return (
        <>
            {/* The RunningBanner is now removed from here */}
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
            
        </>
    );
};

export default MainLayout;