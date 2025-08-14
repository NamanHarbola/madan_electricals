// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`http://localhost:5000/api/products?category=${categoryName}`);
                setProducts(data);
            } catch (error) {
                toast.error(`Could not fetch products for ${categoryName}.`);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByCategory();
    }, [categoryName]); // Re-fetch when the category name in the URL changes

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <h1 className="page-title" style={{ textTransform: 'capitalize' }}>
                {categoryName}
            </h1>
            
            {loading ? (
                <p>Loading...</p>
            ) : products.length === 0 ? (
                <p>No products found in this category.</p>
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
