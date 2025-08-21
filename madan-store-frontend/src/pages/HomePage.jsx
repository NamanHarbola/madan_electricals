// src/pages/HomePage.jsx
import React from 'react';
import HeroSlider from '../components/HeroSlider';
import Categories from '../components/Categories.jsx';
import TrendingProducts from '../components/TrendingProducts.jsx';
import AboutSection from '../components/AboutSection.jsx';
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