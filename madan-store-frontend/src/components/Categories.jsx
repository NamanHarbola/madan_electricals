// src/components/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api'; // <-- 1. Import the API instance

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // 2. Use the central API instance
                const { data } = await API.get('/api/v1/categories');
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    if (!Array.isArray(categories)) {
        return null;
    }

    return (
        <section id="categories" className="categories-section">
            <div className="container">
                <h2 className="section-heading">Categories</h2>
                <div className="category-grid">
                     {categories.slice(0, 6).map((category) => (
                        <Link to={`/category/${category.name.toLowerCase()}`} key={category._id} className="category-card">
                            <img src={category.image} alt={category.name} className="category-image" />
                            <h3>{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;