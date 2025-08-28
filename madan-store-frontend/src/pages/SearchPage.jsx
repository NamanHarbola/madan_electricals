// src/pages/SearchPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { toast } from 'react-toastify';

const SearchPage = () => {
  const { keyword: rawKeyword = '' } = useParams();
  const keyword = useMemo(() => String(rawKeyword || '').trim(), [rawKeyword]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update page title for SEO
    document.title = keyword
      ? `Search: ${keyword} | Madan Store`
      : 'Search | Madan Store';
  }, [keyword]);

  useEffect(() => {
    const fetchProducts = async () => {
      // guard: if keyword is empty, just show nothing with a hint
      if (!keyword) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await API.get(
          `/api/v1/products?keyword=${encodeURIComponent(keyword)}`
        );

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          // Unexpected shape from API
          setProducts([]);
          console.error('Search API returned non-array:', data);
        }
      } catch (error) {
        toast.error('Could not fetch search results.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <h1 className="page-title" style={{ paddingTop: 0, marginBottom: 12 }}>
        {keyword ? `Search Results for “${keyword}”` : 'Search'}
      </h1>

      {!keyword ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Try searching for a product name or brand from the homepage search bar.
        </p>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <LoadingSpinner />
        </div>
      ) : products.length === 0 ? (
        <p style={{ marginTop: 16 }}>
          No products found matching “{keyword}”. Try a different keyword.
        </p>
      ) : (
        <div className="product-grid" style={{ marginTop: 24 }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
