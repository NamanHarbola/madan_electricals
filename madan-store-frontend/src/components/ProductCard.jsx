// src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import formatCurrency from '../utils/formatCurrency';

const ProductCard = ({ product }) => {
  // Helper function to generate star ratings from your original code
  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    return stars;
  };

  return (
    // 2. Wrap the entire card in a Link component.
    // The `to` prop constructs the URL using the product's unique _id from MongoDB.
    // The className is moved from the div to the Link component.
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.trending ? <span className="trending-badge">TRENDING</span> : null}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">{formatCurrency(product.price)}
          <span className="price-mrp">{formatCurrency(product.mrp)}</span>
        </div>
        <div className="product-rating">
          <div className="stars" dangerouslySetInnerHTML={{ __html: generateStars(product.rating) }} />
          <span className="rating-text">({product.rating})</span>
        </div>
        <div className="product-actions">
          <button className="btn-icon btn-primary">
            <i className="fas fa-cart-plus"></i>
            Add to Cart
          </button>
          <button className="btn-icon btn-secondary">
            <i className="fas fa-eye"></i>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;