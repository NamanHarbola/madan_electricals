// src/components/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=70&auto=format&fit=crop';

// Small, safe slug helper
const slugify = (str = '') =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const CategorySkeleton = () => (
  <div className="category-card" aria-hidden="true">
    <div
      className="category-image"
      style={{
        background:
          'linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03), rgba(0,0,0,0.06))',
        backgroundSize: '200% 100%',
        animation: 'skeleton 1.2s ease-in-out infinite',
      }}
    />
    <h3 style={{ height: 18, margin: '16px', background: '#eee', borderRadius: 6 }} />
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await API.get('/api/v1/categories');
        if (!mounted) return;
        if (Array.isArray(data)) {
          setCategories(data.slice(0, 6));
        } else {
          console.error('API did not return an array for categories:', data);
          setErr('Unexpected response');
        }
      } catch (e) {
        console.error('Failed to fetch categories', e);
        setErr('Failed to load categories');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="categories" className="categories-section">
      <div className="container">
        <h2 className="section-heading">Categories</h2>

        {/* Loading skeletons */}
        {loading && (
          <div className="category-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error / Empty state */}
        {!loading && (err || categories.length === 0) && (
          <div className="category-grid">
            <div className="category-card" style={{ padding: 16, textAlign: 'center' }}>
              <h3 style={{ margin: 0 }}>
                {err ? 'Could not load categories.' : 'No categories found.'}
              </h3>
            </div>
          </div>
        )}

        {/* Categories */}
        {!loading && !err && categories.length > 0 && (
          <div className="category-grid">
            {categories.map((category) => {
              const name = category?.name || 'Category';
              const img = category?.image || FALLBACK_IMG;
              const to = `/category/${slugify(name)}`;

              return (
                <Link
                  to={to}
                  key={category?._id || name}
                  className="category-card"
                  aria-label={`${name} category`}
                >
                  <div className="category-image" style={{ position: 'relative' }}>
                    {/* CLS-safe, lazy, responsive */}
                    <img
                      src={img}
                      alt={name}
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="400"
                      sizes="(min-width:992px) 25vw, (min-width:600px) 33vw, 50vw"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        if (e?.currentTarget?.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  </div>
                  <h3>{name}</h3>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Skeleton keyframes (used inline in CategorySkeleton) */}
      <style>{`
        @keyframes skeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
};

export default Categories;
