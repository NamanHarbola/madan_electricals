// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import formatCurrency from '../utils/formatCurrency.js';
import { useCart } from '../context/CartContext.jsx';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
            } catch (err) {
                setError('Could not load product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
    if (error) return <div className="container" style={{ paddingTop: '100px', textAlign: 'center', color: 'red' }}>{error}</div>;
    if (!product) return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>Product not found.</div>;

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">{product.name}</h1>
            </div>
            <div className="container" style={{ padding: '40px 15px' }}>
                <div className="product-detail-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'flex-start', maxWidth: '1000px', margin: 'auto' }}>
                    <div className="product-detail-image">
                        <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '12px' }} />
                    </div>
                    <div className="product-detail-info">
                        <h2 style={{ fontSize: '28px', marginBottom: '16px', lineHeight: '1.2' }}>{product.name}</h2>
                        <div className="product-price" style={{ fontSize: '28px', color: 'var(--color-primary)', marginBottom: '16px', fontWeight: 'bold' }}>
                            {formatCurrency(product.price)}
                            <span className="price-mrp" style={{ fontSize: '20px', marginLeft: '16px', textDecoration: 'line-through', color: 'var(--color-text-secondary)' }}>
                                {formatCurrency(product.mrp)}
                            </span>
                        </div>
                        {/* ... (Other details like rating, description, etc.) ... */}
                        <div className="product-actions" style={{ marginTop: '24px' }}>
                            <button className="btn-full" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailPage;