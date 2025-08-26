// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from '../utils/formatCurrency.js';
import { useCart } from '../context/CartContext.jsx';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=70&auto=format&fit=crop';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState(
    product?.images?.[0] || FALLBACK_IMG
  );

  const handleAddToCart = (e) => {
    // prevent Link navigation when clicking button
    e.preventDefault();
    addToCart(product);
  };

  // Pick an accessible name & sane defaults
  const title = product?.name || 'Product';
  const price = product?.price ?? 0;
  const mrp = product?.mrp ?? price;
  const inStock = (product?.stock ?? 0) > 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className="product-card"
      aria-label={`${title} – ${formatCurrency(price)}`}
    >
      <div className="product-image">
        {/* 
          CLS-safe:
          - width/height gives the browser a stable box
          - CSS enforces square aspect (aspect-ratio: 1/1), so any size works
          Perf:
          - lazy + async
          - sizes hints match your responsive grid (1/2/3/4 columns)
        */}
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          decoding="async"
          width="400"
          height="400"
          sizes="(min-width:1200px) 25vw, (min-width:768px) 33vw, (min-width:480px) 50vw, 100vw"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImgSrc(FALLBACK_IMG)}
        />
      </div>

      <div className="product-info">
        <h3>{title}</h3>

        <div className="product-price" aria-label={`Price ${formatCurrency(price)}`}>
          {formatCurrency(price)}
          {mrp > price && (
            <span className="price-mrp">{formatCurrency(mrp)}</span>
          )}
        </div>

        <button
          className="btn-full"
          onClick={handleAddToCart}
          style={{ marginTop: '16px' }}
          disabled={!inStock}
          aria-disabled={!inStock}
          aria-label={inStock ? 'Add to cart' : 'Out of stock'}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
