// src/components/AboutSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
    return (
        <section id="about" style={{ padding: '80px 0', backgroundColor: 'var(--color-surface)' }}>
            <div className="container">
                <h2 className="section-heading">About Us</h2>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                        Welcome to Colorful Creations, where we provide a comprehensive range of high-quality paints, supplies, and expert advice. Our dedicated team is here to help you bring your space to life with the perfect colors and finishes. Whether you're a professional or a DIY enthusiast, we have everything you need to achieve stunning results.
                    </p>
                    <Link to="/about" className="btn-full" style={{ marginTop: '20px', width: 'auto', display: 'inline-block', padding: '14px 30px' }}>
                        Read More
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;