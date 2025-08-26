// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await API.get(`/api/v1/products?category=${categoryName}`);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Unexpected API response format.');
        }
      } catch (err) {
        setError(`Could not fetch products for ${categoryName}.`);
        toast.error(`Could not fetch products for ${categoryName}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();

    // update page title for SEO
    document.title = `${categoryName} | Madan Store`;
  }, [categoryName]);

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
      {/* Breadcrumbs */}
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '20px' }}>
        <Link to="/" className="breadcrumb-link">Home</Link> &gt; 
        <span className="breadcrumb-current" style={{ textTransform: 'capitalize', marginLeft: '8px' }}>
          {categoryName}
        </span>
      </nav>

      <h1 className="page-title" style={{ textTransform: 'capitalize' }}>
        {categoryName}
      </h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red', marginTop: '40px' }}>{error}</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>
          No products found in this category.
        </p>
      ) : (
        <div className="product-grid" style={{ marginTop: '40px' }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
