// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import formatCurrency from '../utils/formatCurrency.js';

const ProductDetailPage = () => {
  const { id } = useParams(); // Gets the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Could not load product details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- Conditional Rendering ---
  if (loading) {
    return <div className="container" style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  }
  
  if (error) {
    return <div className="container" style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }
  
  if (!product) {
    return <div className="container" style={{ padding: '50px', textAlign: 'center' }}>Product not found.</div>;
  }

  // --- Main JSX for the Page ---
  return (
    <div className="container" style={{ padding: '40px 15px' }}>
      <div className="product-detail-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'flex-start', maxWidth: '1000px', margin: 'auto' }}>
        
        {/* Product Image */}
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--color-border)' }} />
        </div>

        <div className="product-detail-info">
          {/* Product Name */}
          <h1 style={{ fontSize: '32px', marginBottom: '16px', lineHeight: '1.2' }}>{product.name}</h1>
          
          {/* Price and MRP */}
          <div className="product-price" style={{ fontSize: '28px', color: 'var(--color-primary)', marginBottom: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '16px' }}>
            {formatCurrency(product.price)}
            <span className="price-mrp" style={{ fontSize: '20px' }}>
              {formatCurrency(product.mrp)}
            </span>
          </div>

          {/* Rating */}
          <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: '#ffd700' }}>★★★★☆</span>
            <span className="rating-text">({product.rating} stars)</span>
          </div>
          
          {/* Description */}
          <p className="product-description" style={{ marginBottom: '24px', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
            {product.description}
          </p>

          {/* Category and Stock */}
          <div className="product-meta" style={{ marginBottom: '24px' }}>
            <p style={{ marginBottom: '8px' }}><strong>Category:</strong> <span style={{ textTransform: 'capitalize' }}>{product.category}</span></p>
            <p className={`status status--${product.stock > 0 ? 'success' : 'error'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
            </p>
          </div>

          {/* Action Button */}
          <div className="product-actions">
            <button className="btn btn--primary btn--lg" style={{ width: '100%' }} disabled={product.stock === 0}>
              <i className="fas fa-cart-plus" style={{marginRight: '8px'}}></i>
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;