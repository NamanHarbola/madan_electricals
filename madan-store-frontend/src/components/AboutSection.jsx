// src/components/AboutSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AboutSection = () => {
    const [content, setContent] = useState(null);

    useEffect(() => {
        const fetchAboutContent = async () => {
            try {
                const { data } = await axios.get('/api/v1/about');
                setContent(data);
            } catch (error) {
                console.error("Could not fetch about content for homepage", error);
            }
        };
        fetchAboutContent();
    }, []);

    if (!content) {
        return null; // Don't render the section if there's no content
    }

    return (
        <section id="about" className="about-section">
            <div className="container">
                <div className="about-grid">
                    <div className="about-image-container">
                        <img src={content.image} alt="About Madan Store" />
                    </div>
                    <div className="about-content">
                        <h2 className="section-heading" style={{ textAlign: 'left', marginBottom: 'var(--space-24)' }}>
                            {content.title}
                        </h2>
                        <p>{content.description}</p>
                        <Link to="/about" className="btn-full" style={{ marginTop: '20px', width: 'auto', display: 'inline-block', padding: '14px 30px' }}>
                            Learn More About Us
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;