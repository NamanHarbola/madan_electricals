// src/pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <h1 className="page-title">About Us</h1>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                    Welcome to Madan Electricals, your one-stop destination for a comprehensive range of high-quality electronics, hardware, and home appliances.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                    Our dedicated team is here to help you bring your space to life with the perfect products and expert advice. Whether you're a professional contractor, a DIY enthusiast, or someone looking to upgrade their home, we have everything you need to achieve stunning results.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                    We pride ourselves on offering a wide selection of products from trusted brands, ensuring that you'll find exactly what you're looking for. From air conditioners and heaters to chimneys and electrical accessories, we've got you covered.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;