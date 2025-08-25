// src/pages/HomePage.jsx
import React from 'react';
import HeroSlider from '../components/HeroSlider';
import Categories from '../components/Categories';
import TrendingProducts from '../components/TrendingProducts';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
    return (
        <>
            <HeroSlider />
            <Categories />
            <TrendingProducts />
            <AboutSection />
            <ContactSection />
        </>
    );
};

export default HomePage;