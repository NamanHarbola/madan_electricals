// src/pages/AboutPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const buildSrcSet = (url) => {
  if (!url) return undefined;
  const sep = url.includes('?') ? '&' : '?';
  return [
    `${url}${sep}w=480 480w`,
    `${url}${sep}w=768 768w`,
    `${url}${sep}w=1024 1024w`,
    `${url}${sep}w=1400 1400w`,
  ].join(', ');
};

// Match your layout: centered image up to ~500px, full-bleed on small screens
const ABOUT_IMG_SIZES = '(max-width: 600px) 92vw, (max-width: 992px) 80vw, 500px';

const AboutPage = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAboutContent = async () => {
      try {
        const { data } = await API.get('/api/v1/about');
        if (isMounted) setAboutContent(data);
      } catch (error) {
        console.error('Failed to fetch about content', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAboutContent();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!aboutContent) {
    return (
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        <h1 className="page-title">About Us information is not available.</h1>
      </div>
    );
  }

  const { title, image, description } = aboutContent;

  return (
    <section id="about" className="about-section">
      <div className="container">
        <h1 className="page-title">{title}</h1>

        <div className="about-grid">
          {/* Image */}
          <div className="about-image-container" style={{ display: 'flex', justifyContent: 'center' }}>
            {image ? (
              <img
                src={image}
                srcSet={buildSrcSet(image)}
                sizes={ABOUT_IMG_SIZES}
                alt="About Madan Store"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', maxWidth: 520, height: 'auto' }}
              />
            ) : (
              <div
                aria-hidden="true"
                style={{
                  width: '100%',
                  maxWidth: 520,
                  aspectRatio: '4 / 3',
                  borderRadius: '12px',
                  background: 'var(--color-border)',
                }}
              />
            )}
          </div>

          {/* Content */}
          <div className="about-content">
            <p style={{ fontSize: '1.1rem' }}>
              {description}
            </p>

            {/* Optional: quick highlights (feel free to remove if not needed) */}
            <ul className="pd-bullets" style={{ paddingLeft: 18 }}>
              <li>Trusted local electricals & appliances store</li>
              <li>Genuine products • Transparent pricing</li>
              <li>Fast shipping • Easy returns • Secure checkout</li>
            </ul>

            {/* Optional CTA back to categories */}
            <a className="btn-full" href="/#categories" style={{ maxWidth: 320, marginInline: 0 }}>
              Shop Categories
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
