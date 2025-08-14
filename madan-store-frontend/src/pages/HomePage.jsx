// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import ProductList from '../components/ProductList'; // Import the new component

const HomePage = () => {
    return (
        <>
            <HeroSlider />

            {/* This section now dynamically lists products from your database */}
            <section id="products" className="services-section">
                <div className="container">
                    <h2 className="section-heading">Featured Products</h2>
                    <ProductList />
                </div>
            </section>

            <section id="about" className="about-section-light">
                <div className="container about-grid">
                    <div className="about-text-content">
                        <h2 className="section-heading">Your Trusted Tech Partner</h2>
                        <p>At Madan Store, we believe in providing not just products, but solutions. We hand-pick every item to ensure it meets our high standards.</p>
                        <Link to="/about" className="btn-outline-light">Learn More</Link>
                    </div>
                    <div className="about-image-content">
                        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80" alt="Team working"/>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
