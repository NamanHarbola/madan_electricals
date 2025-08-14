// src/components/HeroSlider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HeroSlider = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

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

    useEffect(() => {
        if (banners.length > 1 && !isHovering) {
            const timer = setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
            }, 5000); // Change slide every 5 seconds
            return () => clearTimeout(timer);
        }
    }, [currentIndex, banners.length, isHovering]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (banners.length === 0) {
        // You can return a default static hero section here if you want
        return (
             <div className="hero-slider">
                <div className="slide active" style={{backgroundImage: `url(https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80)`}}>
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
