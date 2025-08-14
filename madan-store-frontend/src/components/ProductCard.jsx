// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from '../utils/formatCurrency.js';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        // Prevent the Link from navigating when the button is clicked
        e.preventDefault();
        addToCart(product);
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-image">
                <img src={product.image} alt={product.name} loading="lazy" />
            </div>
            <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-price">
                    {formatCurrency(product.price)}
                    <span className="price-mrp">{formatCurrency(product.mrp)}</span>
                </div>
                <button 
                    className="btn-full" 
                    onClick={handleAddToCart} 
                    style={{marginTop: '16px'}}
                    disabled={product.stock === 0}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
