// src/components/AboutSection.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

const buildSrcSet = (url) => {
  if (!url) return undefined;
  const sep = url.includes('?') ? '&' : '?';
  return [
    `${url}${sep}w=480 480w`,
    `${url}${sep}w=768 768w`,
    `${url}${sep}w=1024 1024w`,
    `${url}${sep}w=1440 1440w`,
  ].join(', ');
};

// Matches your about grid max width behavior
const IMG_SIZES = '(max-width: 991px) 92vw, 520px';

const AboutSection = () => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await API.get('/api/v1/about', { timeout: 12000 });
        if (isMounted) setContent(data);
      } catch (err) {
        if (isMounted) setError('Failed to load About section.');
        console.error('Could not fetch about content for homepage', err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  if (error) return null;         // keep home clean if it fails
  if (!content) return null;      // render nothing until loaded

  const imgUrl = content.image;

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-container" style={{ overflow: 'hidden', borderRadius: 'var(--r-md)' }}>
            {/* Real <img> for proper decoding + responsive selection */}
            <img
              src={imgUrl}
              srcSet={buildSrcSet(imgUrl)}
              sizes={IMG_SIZES}
              alt={content.title || 'About Madan Store'}
              loading="lazy"
              decoding="async"
              fetchPriority="auto"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
                aspectRatio: '4 / 3',
              }}
            />
          </div>

          <div className="about-content">
            <h2
              className="section-heading"
              style={{ textAlign: 'left', marginBottom: 'var(--s-24)' }} // FIX: --s-24 (not --space-24)
            >
              {content.title}
            </h2>

            <p style={{
              margin: 0,
              color: 'var(--color-text)',
              lineHeight: 1.8,
            }}>
              {content.description}
            </p>

            <Link
              to="/about"
              className="btn-full"
              style={{
                marginTop: '20px',
                width: 'auto',
                display: 'inline-block',
                padding: '14px 30px',
              }}
              // Hint the browser to prefetch target doc when idle
              rel="prefetch"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
