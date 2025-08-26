// src/pages/HomePage.jsx
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import HeroSlider from '../components/HeroSlider';

// Lazy-load below-the-fold sections (code-split)
const Categories = lazy(() => import('../components/Categories'));
const TrendingProducts = lazy(() => import('../components/TrendingProducts'));
const AboutSection = lazy(() => import('../components/AboutSection'));
const ContactSection = lazy(() => import('../components/ContactSection'));

/** Simple skeletons (very light on CSS/JS) */
const CategoriesSkeleton = () => (
  <section className="categories-section">
    <div className="container">
      <h2 className="section-heading">Categories</h2>
      <div className="category-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="category-card" aria-hidden="true">
            <div
              className="category-image"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03), rgba(0,0,0,0.06))',
                backgroundSize: '200% 100%',
                animation: 'skeleton 1.2s ease-in-out infinite',
              }}
            />
            <h3 style={{ height: 18, margin: 16, background: '#eee', borderRadius: 6 }} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProductsSkeleton = () => (
  <section className="products-section">
    <div className="container">
      <h2 className="section-heading">Trending Products</h2>
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <article key={i} className="product-card" aria-hidden="true">
            <div
              className="product-image"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03), rgba(0,0,0,0.06))',
                backgroundSize: '200% 100%',
                animation: 'skeleton 1.2s ease-in-out infinite',
              }}
            />
            <div className="product-info">
              <h3 style={{ height: 18, background: '#eee', borderRadius: 6 }} />
              <div style={{ height: 16, marginTop: 8, background: '#eee', borderRadius: 6 }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const SectionSkeleton = ({ title }) => (
  <section className="section-pad">
    <div className="container">
      <h2 className="section-heading">{title}</h2>
      <div
        style={{
          height: 160,
          borderRadius: 12,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03), rgba(0,0,0,0.06))',
          backgroundSize: '200% 100%',
          animation: 'skeleton 1.2s ease-in-out infinite',
        }}
      />
    </div>
  </section>
);

/**
 * LazyVisible mounts children only after the wrapper is intersecting the viewport.
 * If IntersectionObserver is unavailable, it mounts immediately.
 */
const LazyVisible = ({ children, rootMargin = '200px', minHeight = 200 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (visible) return;

    // Fallback for older browsers / SSR
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  );
};

const HomePage = () => {
  return (
    <>
      {/* Above-the-fold: keep eager for best LCP */}
      <HeroSlider />

      {/* Categories (loads when close to viewport) */}
      <LazyVisible rootMargin="200px" minHeight={420}>
        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories />
        </Suspense>
      </LazyVisible>

      {/* Trending Products */}
      <LazyVisible rootMargin="200px" minHeight={560}>
        <Suspense fallback={<ProductsSkeleton />}>
          <TrendingProducts />
        </Suspense>
      </LazyVisible>

      {/* About */}
      <LazyVisible rootMargin="200px" minHeight={260}>
        <Suspense fallback={<SectionSkeleton title="About Us" />}>
          <AboutSection />
        </Suspense>
      </LazyVisible>

      {/* Contact */}
      <LazyVisible rootMargin="200px" minHeight={260}>
        <Suspense fallback={<SectionSkeleton title="Contact Us" />}>
          <ContactSection />
        </Suspense>
      </LazyVisible>

      {/* Inline keyframes for skeleton + reduced-motion support */}
      <style>{`
        @keyframes skeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation: skeleton"] {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;
