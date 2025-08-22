// src/components/HeroSlider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

const HeroSlider = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // FIX: Using the correct, versioned API endpoint
                const { data } = await axios.get('/api/v1/banners');
                if (Array.isArray(data)) {
                    setBanners(data);
                }
            } catch (error) {
                console.error('Failed to fetch banners', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length > 1 && !isHovering) {
            const timer = setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, banners.length, isHovering]);

    const nextSlide = () => {
        if (banners.length > 1) setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const prevSlide = () => {
        if (banners.length > 1) setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <div className="hero-slider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (banners.length === 0) {
        // A more prominent fallback for when no banners are in the database
        return (
             <div className="hero-slider">
                <div className="slide active" style={{backgroundImage: `url(https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80)`}}>
                </div>
             </div>
        );
    }

    return (
        <div
            className="hero-slider"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {banners.map((banner, index) => (
                <div
                    key={banner._id}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${banner.image})` }}
                />
            ))}

<div className="hero-content">
                <form onSubmit={submitHandler} className="hero-search-form">
                    <input
                        type="text"
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Enter your query..."
                        className="hero-search-input"
                    />
                    <button type="submit" className="hero-search-button">Search</button>
                </form>
            </div>


            {banners.length > 1 && (
                <>
                    <button className="slider-arrow prev" onClick={prevSlide}><FaChevronLeft /></button>
                    <button className="slider-arrow next" onClick={nextSlide}><FaChevronRight /></button>
                    <div className="slider-dots">
                        {banners.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroSlider;
