// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Using relative path
                const { data } = await axios.get('/api/v1/products');
                setProducts(data);
            } catch (error) {
                toast.error('Could not load products.');
                console.error('Fetch Products Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="container"><p>Loading Products...</p></div>;
    }

    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
    