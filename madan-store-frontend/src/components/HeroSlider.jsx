// src/components/HeroSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AUTO_INTERVAL = 5000;

// --- OPTIMIZATION 1: Use a static, hardcoded banner for the initial load ---
const staticBanners = [
  {
    _id: 'static-1',
    // Replace with your best, high-quality banner image URL from Cloudinary
    image: 'https://res.cloudinary.com/namanharbola/image/upload/v1726922434/madan-store/banner-1_pmicsm.webp',
    title: 'High-Quality Electricals and Hardware',
    link: '/#categories'
  }
];

// Helper functions (no changes needed)
const buildSrcSet = (url) => {
  if (!url) return undefined;
  const sep = url.includes('?') ? '&' : '?';
  return [
    `${url}${sep}w=800 800w`,
    `${url}${sep}w=1200 1200w`,
    `${url}${sep}w=1600 1600w`,
  ].join(', ');
};
const HERO_SIZES = '(max-width: 767px) 100vw, 80vw';

const HeroSlider = () => {
  // --- OPTIMIZATION 2: Start with the static banner immediately ---
  const [banners, setBanners] = useState(staticBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const touchStartX = useRef(null);

  // Auto-advance logic (no changes needed)
  useEffect(() => {
    if (banners.length > 1 && !isHovering) {
      const t = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, AUTO_INTERVAL);
      return () => clearTimeout(t);
    }
  }, [currentIndex, banners.length, isHovering]);

  // All other functions (nextSlide, prevSlide, submitHandler, etc.) remain the same.
  const nextSlide = () => {
    if (banners.length > 1) setCurrentIndex((prev) => (prev + 1) % banners.length);
  };
  const prevSlide = () => {
    if (banners.length > 1) setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };
  const goToSlide = (i) => setCurrentIndex(i);
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/search/${keyword}`);
    else navigate('/');
  };
  const handleBannerClick = (link) => link && navigate(link);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) nextSlide(); else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        const imageUrl = banner.image;
        return (
          <div
            key={banner._id}
            className={`slide ${isActive ? 'active' : ''}`}
            onClick={() => handleBannerClick(banner.link)}
            aria-hidden={!isActive}
          >
            <img
              src={imageUrl}
              srcSet={buildSrcSet(imageUrl)}
              sizes={HERO_SIZES}
              alt={banner.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: banner.link ? 'pointer' : 'default',
              }}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding={index === 0 ? 'sync' : 'async'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </div>
        );
      })}

      <div className="hero-content">
        <form onSubmit={submitHandler} className="hero-search-form" role="search" aria-label="Site search">
          <input
            type="text"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products..."
            className="hero-search-input"
            inputMode="search"
            autoComplete="off"
          />
          <button type="submit" className="hero-search-button">Search</button>
        </form>
      </div>

      {banners.length > 1 && (
        <>
          <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous slide">
            <FaChevronLeft />
          </button>
          <button className="slider-arrow next" onClick={nextSlide} aria-label="Next slide">
            <FaChevronRight />
          </button>
          <div className="slider-dots" role="tablist" aria-label="Hero slide navigation">
            {banners.map((_, index) => (
              <span
                key={index}
                role="tab"
                aria-selected={index === currentIndex}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;