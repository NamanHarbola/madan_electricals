// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api'; // <-- 1. Import the central API instance
import formatCurrency from '../utils/formatCurrency.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { userInfo } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [quantity, setQuantity] = useState(1);

    const fetchProduct = async () => {
        try {
            // 2. Use the API instance
            const { data } = await API.get(`/api/v1/products/${id}`);
            setProduct(data);
        } catch (err) {
            setError('Could not load product details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        try {
            // 3. Use the API instance (no manual config needed)
            await API.post(`/api/v1/products/${id}/reviews`, { rating, comment });
            toast.success('Review submitted successfully');
            setRating(0);
            setComment('');
            fetchProduct();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQty = prev + amount;
            if (newQty < 1) return 1;
            if (newQty > product.stock) {
                toast.error(`Only ${product.stock} items in stock.`);
                return product.stock;
            }
            return newQty;
        });
    };

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
                        <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: '12px' }} />
                    </div>
                    <div className="product-detail-info">
                        <h2 style={{ fontSize: '28px', marginBottom: '16px', lineHeight: '1.2' }}>{product.name}</h2>
                        <div className="product-price" style={{ fontSize: '28px', color: 'var(--color-primary)', marginBottom: '16px', fontWeight: 'bold' }}>
                            {formatCurrency(product.price)}
                            <span className="price-mrp" style={{ fontSize: '20px', marginLeft: '16px', textDecoration: 'line-through', color: 'var(--color-text-secondary)' }}>
                                {formatCurrency(product.mrp)}
                            </span>
                        </div>
                        
                        <p style={{ lineHeight: '1.7', color: 'var(--color-text-secondary)' }}>
                            {product.description}
                        </p>
                        
                        <div className="product-actions" style={{ marginTop: '24px', display: 'flex', gap: '20px' }}>
                            <div className="quantity-adjuster">
                                <button onClick={() => handleQuantityChange(-1)}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                            <button className="btn-full" onClick={() => addToCart(product, quantity)} disabled={product.stock === 0} style={{ marginTop: 0 }}>
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="reviews-section" style={{ maxWidth: '1000px', margin: '60px auto 0' }}>
                    <h2>Reviews</h2>
                    {product.reviews.length === 0 && <p>No reviews yet.</p>}
                    <div className="review-list">
                        {product.reviews.map((review) => (
                            <div key={review._id} className="review-item" style={{ background: 'var(--color-surface)', padding: '15px', borderRadius: 'var(--radius-base)', marginBottom: '15px' }}>
                                <strong>{review.name}</strong>
                                <p>Rating: {review.rating} out of 5</p>
                                <p>{review.comment}</p>
                                <p><small>{new Date(review.createdAt).toLocaleDateString()}</small></p>
                            </div>
                        ))}
                    </div>

                    <div className="review-form" style={{ marginTop: '40px' }}>
                        <h3>Write a Customer Review</h3>
                        {userInfo ? (
                            <form onSubmit={submitReviewHandler}>
                                <div className="form-group">
                                    <label htmlFor="rating">Rating</label>
                                    <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} className="form-control">
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
                                    <textarea id="comment" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} className="form-control"></textarea>
                                </div>
                                <button type="submit" className="btn-full">Submit</button>
                            </form>
                        ) : (
                            <p>Please <a href="/login">log in</a> to write a review.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailPage;