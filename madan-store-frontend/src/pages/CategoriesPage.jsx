// src/pages/CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/v1/categories');
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (error) {
                toast.error("Failed to fetch categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '50px' }}>
            <h1 className="page-title">All Categories</h1>
            <div className="category-grid">
                {categories.map((category) => (
                    <Link to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} key={category._id} className="category-card">
                        <img src={category.image} alt={category.name} className="category-image" />
                        <h3>{category.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;