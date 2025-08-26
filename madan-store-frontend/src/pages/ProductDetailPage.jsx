// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../api';
import formatCurrency from '../utils/formatCurrency.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // review form
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/api/v1/products/${id}`);
      setProduct(data);
      setActiveIndex(0);
      setQuantity(1);
      setErr('');
    } catch (e) {
      setErr('Could not load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleQuantityChange = (delta) => {
    if (!product) return;
    setQuantity((q) => {
      const next = q + delta;
      if (next < 1) return 1;
      if (product.stock && next > product.stock) {
        toast.error(`Only ${product.stock} in stock.`);
        return product.stock;
      }
      return next;
    });
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/api/v1/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted');
      setRating('');
      setComment('');
      fetchProduct();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-error)' }}>
        {err}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        Product not found.
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image].filter(Boolean);
  const activeSrc = images?.[activeIndex];

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        {product.category ? (
          <>
            <Link to={`/category/${String(product.category).toLowerCase()}`}>{product.category}</Link>
            <span className="sep">/</span>
          </>
        ) : null}
        <span aria-current="page">{product.name}</span>
      </nav>

      {/* Title */}
      <div className="page-header">
        <h1 className="page-title">{product.name}</h1>
      </div>

      {/* Product detail */}
      <section className="product-detail">
        <div className="product-detail-content">
          {/* Gallery */}
          <div className="product-detail-gallery">
            <div className="pd-main">
              {/* Use eager on first image for LCP; others lazy */}
              <img
                src={activeSrc}
                alt={product.name}
                loading="eager"
                decoding="sync"
              />
            </div>

            {images.length > 1 && (
              <div className="pd-thumbs" aria-label="Product images">
                {images.map((src, i) => (
                  <button
                    type="button"
                    key={`${src}-${i}`}
                    className={`pd-thumb ${i === activeIndex ? 'is-active' : ''}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={src} alt={`${product.name} thumbnail ${i + 1}`} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <aside className="pd-card">
            <h2 className="pd-title">{product.name}</h2>
            {product.shortDescription ? (
              <p className="pd-sub">{product.shortDescription}</p>
            ) : null}

            <div className="pd-meta">
              <div className="stars" aria-label={`${product.rating || 4.8} out of 5`}>★★★★★</div>
              {typeof product.numReviews === 'number' && (
                <>
                  <span className="meta-dot" />
                  <span>{product.numReviews} reviews</span>
                </>
              )}
              {product.stock > 0 && (
                <>
                  <span className="meta-dot" />
                  <span>In stock</span>
                </>
              )}
            </div>

            <div className="pd-price-row">
              <div className="pd-price">{formatCurrency(product.price)}</div>
              {product.mrp ? <div className="pd-mrp">{formatCurrency(product.mrp)}</div> : null}
              {product.discount ? <span className="pd-badge">{product.discount}% OFF</span> : null}
            </div>

            {/* Quick bullets (fallbacks shown if no keyFeatures) */}
            <ul className="pd-bullets">
              {(product.keyFeatures && product.keyFeatures.length
                ? product.keyFeatures.slice(0, 3)
                : ['1-year warranty', 'Free & fast delivery', '7-day easy returns']
              ).map((f, idx) => <li key={idx}>{f}</li>)}
            </ul>

            {/* Quantity + CTA */}
            <div className="pd-cta-row">
              <div className="quantity-adjuster">
                <button type="button" onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">+</button>
              </div>

              <button
                className="pd-cta"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              <div className="badge-tile">🚚 Free Shipping</div>
              <div className="badge-tile">🔄 7-Day Returns</div>
              <div className="badge-tile">🛡️ Secure Payments</div>
            </div>
          </aside>
        </div>
      </section>

      {/* Description */}
      {product.description ? (
        <div className="container" style={{ maxWidth: 1120, margin: '12px auto 0' }}>
          <div className="chart-container">
            <h3>Product Description</h3>
            <p style={{ margin: 0, color: 'var(--color-text)' }}>{product.description}</p>
          </div>
        </div>
      ) : null}

      {/* Reviews */}
      <section className="reviews-section">
        <h2 className="section-heading" style={{ marginBottom: 20 }}>Reviews</h2>

        {(!product.reviews || product.reviews.length === 0) && (
          <p>No reviews yet.</p>
        )}

        {product.reviews?.map((r) => (
          <div key={r._id} className="review-item">
            <strong>{r.name}</strong>
            <p>Rating: {r.rating} / 5</p>
            <p>{r.comment}</p>
            <p><small>{new Date(r.createdAt).toLocaleDateString()}</small></p>
          </div>
        ))}

        <div className="review-form" style={{ marginTop: 24 }}>
          <h3>Write a Customer Review</h3>
          {userInfo ? (
            <form onSubmit={submitReviewHandler}>
              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  className="form-control"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  rows="3"
                  className="form-control"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-full">Submit</button>
            </form>
          ) : (
            <p>
              Please <Link to="/login">log in</Link> to write a review.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;
