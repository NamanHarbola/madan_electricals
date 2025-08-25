// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api'; // 1. Import API
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

const SearchPage = () => {
    const { keyword } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // 2. Use API instance
                const { data } = await API.get(`/api/v1/products?keyword=${keyword}`);
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            } catch (error) {
                toast.error('Could not fetch search results.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <h1 style={{ marginBottom: '30px' }}>Search Results for "{keyword}"</h1>
            
            {loading ? (
                <p>Loading...</p>
            ) : products.length === 0 ? (
                <p>No products found matching your search. Try another keyword.</p>
            ) : (
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;