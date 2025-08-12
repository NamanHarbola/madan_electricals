// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (err) {
        setError('Failed to load products from the server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '50px', textAlign: 'center' }}>Loading Products...</div>;
  }

  if (error) {
    return <div className="container" style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  const trendingProducts = products.filter(p => p.trending);

  // This is the JSX that was missing. It tells React how to display the page.
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Welcome to Madan Store</h1>
            <p className="hero-subtitle">Your one-stop shop for premium electronics and professional hardware tools</p>
            <button className="btn btn--primary btn--lg cta-btn">Shop Now</button>
          </div>
          <div className="hero-image">
            <div className="floating-card electronics-card">
              <img src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&h=200&fit=crop" alt="Electronics" />
              <h3>Electronics</h3>
            </div>
            <div className="floating-card hardware-card">
              <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop" alt="Hardware" />
              <h3>Hardware Tools</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="trending-section">
        <div className="container">
          <h2 className="section-title">Trending Products</h2>
          <div className="trending-products">
            {trendingProducts.map(product => (
              <ProductCard key={product._id} product={product} /> // <-- ADD KEY HERE
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop" alt="Electronics" />
              <div className="category-overlay">
                <h3>Electronics</h3>
                <p>Latest smartphones, laptops, and gadgets</p>
              </div>
            </div>
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop" alt="Hardware Tools" />
              <div className="category-overlay">
                <h3>Hardware Tools</h3>
                <p>Professional tools for construction and repair</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section id="products" className="products-section">
        <div className="container">
          {/* ... (products-header) ... */}
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} /> // <-- AND ADD KEY HERE
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;