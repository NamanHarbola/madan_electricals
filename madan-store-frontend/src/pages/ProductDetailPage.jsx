// src/pages/ProductDetailPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../api';
import formatCurrency from '../utils/formatCurrency.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

// SEO Helper to add/update meta tags
const updateMetaDescription = (content) => {
  let descriptionTag = document.querySelector('meta[name="description"]');
  if (!descriptionTag) {
    descriptionTag = document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    document.head.appendChild(descriptionTag);
  }
  descriptionTag.setAttribute('content', content);
};

// SEO Helper for structured data
const updateProductSchema = (product) => {
  // Remove any existing product schema
  const existingScript = document.getElementById('product-schema');
  if (existingScript) {
    existingScript.remove();
  }
  if (!product) return;

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images?.[0] || product.image,
    description: product.description,
    sku: product.sku || product._id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Madan Store',
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating:
      product.numReviews > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.numReviews,
          }
        : undefined,
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'product-schema';
  script.innerHTML = JSON.stringify(schema);
  document.head.appendChild(script);
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

  const [product, setProduct] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // review form
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/api/v1/products/${id}`);
      // normalize images to array
      const images =
        Array.isArray(data.images) && data.images.length
          ? data.images
          : data.image
          ? [data.image]
          : [];
      const normalized = { ...data, images };
      setProduct(normalized);
      setActiveIdx(0);
      setQty(1);
      setErr('');
      // --- SEO Updates ---
      document.title = `${normalized.name} | Madan Store`;
      updateMetaDescription(`Buy ${normalized.name} at Madan Store. ${normalized.description.substring(0, 120)}...`);
      updateProductSchema(normalized);
    } catch (e) {
      setErr('Could not load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // Cleanup schema when component unmounts
    return () => updateProductSchema(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const images = useMemo(
    () => (product?.images && product.images.length ? product.images : []),
    [product]
  );
  const mainImage = useMemo(() => images[activeIdx], [images, activeIdx]);

  const handleQuantityChange = (delta) => {
    if (!product) return;
    setQty((q) => {
      const next = q + delta;
      if (next < 1) return 1;
      const cap = typeof product.stock === 'number' ? product.stock : 99;
      if (cap > 0 && next > cap) {
        toast.error(`Only ${cap} in stock.`);
        return cap;
      }
      return next;
    });
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select a rating.');
      return;
    }
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

  if (loading) return <LoadingSpinner />;

  if (err) {
    return (
      <div
        className="container"
        style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-error)' }}
      >
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

  const categoryName = product.category ? String(product.category) : '';
  const categoryHref = categoryName ? `/category/${encodeURIComponent(categoryName)}` : '/';

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        {categoryName && (
          <>
            <span className="sep">›</span>
            <Link to={categoryHref} className="breadcrumb-link">
              {categoryName}
            </Link>
          </>
        )}
        <span className="sep">›</span>
        <span className="breadcrumb-current" aria-current="page">
          {product.name}
        </span>
      </nav>

      {/* Product detail */}
      <section className="product-detail">
        <div className="product-detail-content">
          {/* Gallery */}
          <section className="product-detail-gallery" aria-label="Product gallery">
            <div className="pd-main">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  sizes="(max-width: 992px) 100vw, 50vw"
                />
              ) : (
                <div
                  aria-hidden="true"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    height: '100%',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  No image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="pd-thumbs" role="tablist" aria-label="Thumbnails">
                {images.map((src, i) => (
                  <button
                    type="button"
                    key={`${src}-${i}`}
                    role="tab"
                    aria-selected={i === activeIdx ? 'true' : 'false'}
                    className={`pd-thumb ${i === activeIdx ? 'is-active' : ''}`}
                    onClick={() => setActiveIdx(i)}
                    title={`Image ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} – thumbnail ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Buy box */}
          <aside className="pd-card" aria-label="Purchase options">
            <h1 className="pd-title">{product.name}</h1>
            {categoryName && <p className="pd-sub">{categoryName}</p>}

            <div className="pd-meta" aria-live="polite">
              <div
                className="stars"
                aria-label={`${product.rating ?? 4.8} out of 5`}
                title={`${product.rating ?? 4.8} out of 5`}
              >
                ★★★★★
              </div>
              {typeof product.numReviews === 'number' && (
                <>
                  <span className="meta-dot" />
                  <span>{product.numReviews} reviews</span>
                </>
              )}
              {product.stock > 0 ? (
                <>
                  <span className="meta-dot" />
                  <span>In stock</span>
                </>
              ) : (
                <>
                  <span className="meta-dot" />
                  <span>Out of stock</span>
                </>
              )}
            </div>

            <div className="pd-price-row">
              <div className="pd-price">{formatCurrency(product.price)}</div>
              {product.mrp ? <div className="pd-mrp">{formatCurrency(product.mrp)}</div> : null}
              {product.mrp && product.mrp > product.price && (
                <span className="pd-badge">Save {formatCurrency(product.mrp - product.price)}</span>
              )}
            </div>

            {/* Quick bullets */}
            <ul className="pd-bullets">
              {(Array.isArray(product.keyFeatures) && product.keyFeatures.length
                ? product.keyFeatures.slice(0, 5)
                : product.description
                ? product.description.split('\n').filter(Boolean).slice(0, 3)
                : []
              )
                .concat(
                  (!product.keyFeatures || product.keyFeatures.length === 0) && !product.description
                    ? ['1-year warranty', 'Fast delivery', '7-day easy returns']
                    : []
                )
                .map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
            </ul>

            {/* Quantity + CTA */}
            <div className="pd-cta-row">
              <div className="quantity-adjuster" aria-label="Quantity selector">
                <button type="button" onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">
                  −
                </button>
                <span aria-live="polite">{qty}</span>
                <button type="button" onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">
                  +
                </button>
              </div>

              <button className="pd-cta" onClick={() => addToCart(product, qty)} disabled={product.stock === 0}>
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              <div className="badge-tile">Secure Checkout</div>
              <div className="badge-tile">Easy Returns</div>
              <div className="badge-tile">Fast Delivery</div>
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
        <h2 className="section-heading" style={{ marginBottom: 20 }}>
          Reviews
        </h2>

        {(!product.reviews || product.reviews.length === 0) && <p>No reviews yet.</p>}

        {product.reviews?.map((r) => (
          <div key={r._id} className="review-item">
            <strong>{r.name}</strong>
            <p>Rating: {r.rating} / 5</p>
            <p>{r.comment}</p>
            <p>
              <small>{new Date(r.createdAt).toLocaleDateString()}</small>
            </p>
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
                  required
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
                  placeholder="Share details about quality, delivery, etc."
                />
              </div>

              <button type="submit" className="btn-full">
                Submit
              </button>
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
