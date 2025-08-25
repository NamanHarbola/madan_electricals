// src/components/TrendingProducts.jsx
import React, { useState, useEffect } from 'react';
import API from '../api'; // Corrected import
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';

const TrendingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const { data } = await API.get('/api/v1/products'); // Use API instance
                setProducts(data.filter(p => p.trending));
            } catch (error) {
                toast.error('Could not load trending products.');
            } finally {
                setLoading(false);
            }
        };
        fetchTrendingProducts();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section id="trending" className="products-section">
            <div className="container">
                <h2 className="section-heading">Trending Products</h2>
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;