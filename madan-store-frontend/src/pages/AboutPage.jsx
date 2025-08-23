// src/pages/AboutPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const AboutPage = () => {
    const [aboutContent, setAboutContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutContent = async () => {
            try {
                const { data } = await axios.get('/api/v1/about');
                setAboutContent(data);
            } catch (error) {
                console.error('Failed to fetch about content', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutContent();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            {aboutContent ? (
                <>
                    <h1 className="page-title">{aboutContent.title}</h1>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <img src={aboutContent.image} alt="About Us" style={{ width: '100%', borderRadius: 'var(--radius-base)', marginBottom: 'var(--space-32)' }} />
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                            {aboutContent.description}
                        </p>
                    </div>
                </>
            ) : (
                <h1 className="page-title">About Us information is not available.</h1>
            )}
        </div>
    );
};

export default AboutPage;