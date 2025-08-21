// src/components/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Using relative path, which will be handled by the Vite proxy
                const { data } = await axios.get('/api/v1/categories');
                // Ensure data is an array before setting state
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    // Add a check to ensure categories is an array before mapping
    if (!Array.isArray(categories)) {
        return null; // or a loading/error state
    }

    return (
        <section id="categories" className="categories-section">
            <div className="container">
                <h2 className="section-heading">Categories</h2>
                <div className="category-grid">
                    {categories.map((category) => (
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
