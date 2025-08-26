// src/pages/CategoryPage.jsx
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const GridSkeleton = ({ items = 8 }) => (
  <div className="product-grid" aria-hidden="true" style={{ marginTop: 24 }}>
    {Array.from({ length: items }).map((_, i) => (
      <article key={i} className="product-card">
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
);

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'ready' | 'error' | 'empty'
  const [errorMsg, setErrorMsg] = useState(null);
  const abortRef = useRef(null);

  const title = useMemo(
    () => `${categoryName?.charAt(0).toUpperCase()}${categoryName?.slice(1)}`,
    [categoryName]
  );

  const fetchProductsByCategory = async () => {
    // cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setPhase('loading');
      setErrorMsg(null);

      const { data } = await API.get(`/api/v1/products?category=${categoryName}`, {
        signal: controller.signal,
      });

      if (Array.isArray(data)) {
        setProducts(data);
        setPhase(data.length ? 'ready' : 'empty');
      } else {
        setPhase('error');
        setErrorMsg('Unexpected API response format.');
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setPhase('error');
      const msg = `Could not fetch products for ${categoryName}.`;
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  useEffect(() => {
    // SEO/title + scroll restore
    document.title = `${title} | Madan Store`;
    window.scrollTo(0, 0);

    fetchProductsByCategory();

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName]);

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
      {/* Breadcrumbs */}
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
        <Link to="/" className="breadcrumb-link">Home</Link> &gt;
        <span className="breadcrumb-current" style={{ textTransform: 'capitalize', marginLeft: 8 }}>
          {categoryName}
        </span>
      </nav>

      <header>
        <h1 className="page-title" style={{ textTransform: 'capitalize', marginBottom: 8 }}>
          {title}
        </h1>
        <p
          style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 0 }}
          aria-live="polite"
        >
          {phase === 'ready' && `${products.length} product${products.length > 1 ? 's' : ''} found`}
          {phase === 'empty' && 'No products in this category'}
        </p>
      </header>

      {phase === 'loading' && (
        <>
          {/* small spinner for SR users; skeleton for visual users */}
          <div className="sr-only" role="status" aria-live="polite">Loading products…</div>
          <GridSkeleton items={8} />
        </>
      )}

      {phase === 'error' && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ color: 'red', marginBottom: 12 }}>{errorMsg}</p>
          <button className="btn-full" style={{ width: 'auto' }} onClick={fetchProductsByCategory}>
            Try Again
          </button>
        </div>
      )}

      {phase === 'empty' && (
        <p style={{ textAlign: 'center', marginTop: 40 }}>
          No products found in this category.
        </p>
      )}

      {phase === 'ready' && (
        <div className="product-grid" style={{ marginTop: 24 }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Inline keyframes for the skeleton shimmer (kept local) */}
      <style>{`
        @keyframes skeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0);
          white-space: nowrap; border: 0;
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
