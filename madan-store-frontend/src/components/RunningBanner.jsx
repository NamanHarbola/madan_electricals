// src/components/RunningBanner.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RunningBanner = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/banners');
                setBanners(data);
            } catch (error) {
                console.error('Failed to fetch banners', error);
            }
        };
        fetchBanners();
    }, []);

    if (banners.length === 0) {
        return null; // Don't render if no banners
    }

    // Duplicate content to ensure smooth looping animation
    const bannerContent = banners.map(b => b.text);
    const repeatedContent = [...bannerContent, ...bannerContent, ...bannerContent];

    return (
        <div className="running-banner">
            <div className="banner-content">
                {repeatedContent.map((text, index) => (
                    <span key={index} className="banner-text">
                        {text}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default RunningBanner;