// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <>
            {/* New Hero Section */}
            <section className="hero-light">
                <div className="hero-light-content">
                    <h1 className="hero-light-title">Madan Store</h1>
                    <p className="hero-light-subtitle">Premium electronics and professional hardware, curated for excellence.</p>
                    <a href="#services" className="btn-accent">View Our Products</a>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="services-section">
                <div className="container">
                    <h2 className="section-heading">Our Products</h2>
                    <div className="services-grid">
                        <div className="service-card">
                            <img src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80" alt="Electronics"/>
                            <h3>Latest Electronics</h3>
                            <p>Cutting-edge gadgets and devices to power your life.</p>
                        </div>
                        <div className="service-card">
                            <img src="https://images.unsplash.com/photo-1598369683238-7c25a4186549?w=500&q=80" alt="Hardware Tools"/>
                            <h3>Professional Hardware</h3>
                            <p>Durable and reliable tools for any project, big or small.</p>
                        </div>
                        <div className="service-card">
                            <img src="https://images.unsplash.com/photo-1550009158-94ae76552485?w=500&q=80" alt="Accessories"/>
                            <h3>Premium Accessories</h3>
                            <p>High-quality accessories to complement your devices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
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