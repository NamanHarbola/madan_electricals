// src/pages/HomePage.jsx
import React, { lazy, Suspense } from 'react';
import HeroSlider from '../components/HeroSlider';

// Lazy-load below-the-fold sections
const Categories = lazy(() => import('../components/Categories'));
const TrendingProducts = lazy(() => import('../components/TrendingProducts'));
const AboutSection = lazy(() => import('../components/AboutSection'));
const ContactSection = lazy(() => import('../components/ContactSection'));

// A single, reusable skeleton component to reserve space
const SectionSkeleton = ({ minHeight = '400px', title }) => (
  <section className="section-pad" style={{ minHeight }}>
    <div className="container">
      {title && <h2 className="section-heading">{title}</h2>}
    </div>
  </section>
);


const HomePage = () => {
  return (
    <>
      {/* Above-the-fold: Eagerly loaded for best LCP */}
      <HeroSlider />

      {/* Below-the-fold: Lazy-loaded with Suspense and skeletons */}
      <Suspense fallback={<SectionSkeleton minHeight="450px" title="Categories" />}>
        <Categories />
      </Suspense>

      <Suspense fallback={<SectionSkeleton minHeight="600px" title="Trending Products" />}>
        <TrendingProducts />
      </Suspense>

      <Suspense fallback={<SectionSkeleton minHeight="400px" title="About Us" />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton minHeight="500px" title="Contact Us" />}>
        <ContactSection />
      </Suspense>
    </>
  );
};

export default HomePage;