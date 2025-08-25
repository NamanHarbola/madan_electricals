// src/components/TrendingProducts.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';

const TrendingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const { data } = await API.get('/api/v1/products');
                // THE FIX: Check if the API response is an array before setting state
                if (Array.isArray(data)) {
                    setProducts(data.filter(p => p.trending));
                } else {
                    // Log an error if the data is not an array
                    console.error("API did not return an array for products:", data);
                }
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
    
    // No need to check for length here, .map on an empty array works fine
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