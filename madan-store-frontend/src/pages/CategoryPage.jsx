// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner'; // Import spinner

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                setLoading(true);
                // FIX: Added /v1 to the API endpoint
                const { data } = await axios.get(`/api/v1/products?category=${categoryName}`);
                setProducts(data);
            } catch (error) {
                toast.error(`Could not fetch products for ${categoryName}.`);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByCategory();
    }, [categoryName]);

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <h1 className="page-title" style={{ textTransform: 'capitalize' }}>
                {categoryName}
            </h1>
            
            {loading ? (
                <LoadingSpinner />
            ) : products.length === 0 ? (
                <p style={{textAlign: 'center'}}>No products found in this category.</p>
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

export default CategoryPage;
