// src/components/TrendingProducts.jsx
import React, { useEffect, useRef, useState } from 'react';
import API from '../api';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';

/** Tiny skeleton to avoid layout shift while we fetch */
const GridSkeleton = ({ cards = 6 }) => (
  <section className="products-section" aria-hidden="true">
    <div className="container">
      <h2 className="section-heading">Trending Products</h2>
      <div className="product-grid">
        {Array.from({ length: cards }).map((_, i) => (
          <article key={i} className="product-card">
            <div
              className="product-image"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03), rgba(0,0,0,0.06))',
                backgroundSize: '200% 100%',
                animation: 'skeleton 1.1s ease-in-out infinite',
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

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); // render a small batch first
  const [loading, setLoading] = useState(true);
  const [readyToFetch, setReadyToFetch] = useState(false);
  const [error, setError] = useState('');
  const mountRef = useRef(true);
  const sentinelRef = useRef(null);

  // Only fetch when section is near viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReadyToFetch(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Fetch trending when close to viewport
  useEffect(() => {
    if (!readyToFetch) return;
    mountRef.current = true;

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/api/v1/products', {
          signal: controller.signal,
          timeout: 15000,
        });
        if (!Array.isArray(data)) {
          console.error('API did not return an array for products:', data);
          if (mountRef.current) {
            setProducts([]);
            setError('Unexpected response.');
          }
          return;
        }
        const trending = data.filter((p) => p?.trending);
        if (mountRef.current) {
          setProducts(trending);
          setError('');
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('Could not load trending products.', err);
        if (mountRef.current) {
          setError('Could not load trending products.');
          toast.error('Could not load trending products.');
        }
      } finally {
        if (mountRef.current) setLoading(false);
      }
    })();

    return () => {
      mountRef.current = false;
      controller.abort();
    };
  }, [readyToFetch]);

  // If nothing to show
  if (!readyToFetch) {
    // Reserve space + skeleton until intersection happens
    return (
      <>
        <div ref={sentinelRef} />
        <GridSkeleton cards={6} />
        {/* keyframes for skeleton shimmer */}
        <style>{`
          @keyframes skeleton {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || products.length === 0) {
    // Silent return keeps homepage clean when there are no trending items
    return null;
  }

  const canShowMore = visibleCount < products.length;
  const handleShowMore = () => setVisibleCount((v) => Math.min(v + 8, products.length));

  return (
    <section id="trending" className="products-section">
      <div className="container">
        <h2 className="section-heading">Trending Products</h2>

        <div className="product-grid">
          {products.slice(0, visibleCount).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {canShowMore && (
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn-full"
              style={{ width: 'auto', padding: '12px 20px' }}
              onClick={handleShowMore}
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
