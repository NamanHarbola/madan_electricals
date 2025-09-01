// src/components/HeroSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

const AUTO_INTERVAL = 5000;

/** Build a srcset using ?w= (many CDNs support; harmless if ignored) */
const buildSrcSet = (url) => {
  if (!url) return undefined;
  const sep = url.includes('?') ? '&' : '?';
  return [
    `${url}${sep}w=800 800w`,
    `${url}${sep}w=1200 1200w`,
    `${url}${sep}w=1600 1600w`,
  ].join(', ');
};

/** Match actual visual width of hero on common breakpoints */
const HERO_SIZES = '(max-width: 767px) 100vw, 80vw';

const HeroSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const touchStartX = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await API.get('/api/v1/banners');
        if (Array.isArray(data)) setBanners(data);
      } catch (error) {
        console.error('Failed to fetch banners', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-advance
  useEffect(() => {
    if (banners.length > 1 && !isHovering) {
      const t = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, AUTO_INTERVAL);
      return () => clearTimeout(t);
    }
  }, [currentIndex, banners.length, isHovering]);

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

  // Touch swipe (mobile)
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div className="hero-slider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="hero-slider">
        <div className="slide active">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80"
            alt="Hero banner"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        const imageUrl = banner.image;

        return (
          <div
            key={banner._id || index}
            className={`slide ${isActive ? 'active' : ''}`}
            onClick={() => handleBannerClick(banner.link)}
            aria-hidden={!isActive}
          >
            {/* Use a real <img> for srcset/sizes; fade handled by .slide opacity */}
            <img
              src={imageUrl}
              srcSet={buildSrcSet(imageUrl)}
              sizes={HERO_SIZES}
              alt={banner.title || 'Promotional banner'}
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

      {/* Overlay content: search */}
      <div className="hero-content">
        <form onSubmit={submitHandler} className="hero-search-form" role="search" aria-label="Site search">
          <input
            type="text"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter your query..."
            className="hero-search-input"
            inputMode="search"
            autoComplete="off"
          />
          <button type="submit" className="hero-search-button">Search</button>
        </form>
      </div>

      {/* Controls */}
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
                aria-selected={index === currentIndex ? 'true' : 'false'}
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
