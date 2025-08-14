// src/pages/AdminProductsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import formatCurrency from '../utils/formatCurrency.js';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get('http://localhost:5000/api/products');
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                setProducts(products.filter((p) => p._id !== id));
                alert('Product deleted successfully');
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    return (
        <div className="admin-page-container">
            <h1 className="page-title">Products</h1>
            <Link to="/admin/products/add" className="btn-accent" style={{ marginBottom: '20px' }}>
                + Add Product
            </Link>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>...{product._id.substring(18)}</td>
                                <td>{product.name}</td>
                                <td>{formatCurrency(product.price)}</td>
                                <td>{product.stock}</td>
                                <td>{product.category}</td>
                                <td>
                                    <Link to={`/admin/product/${product._id}/edit`}>
                                        <button className="btn-icon">✏️</button>
                                    </Link>
                                    <button onClick={() => deleteHandler(product._id)} className="btn-icon">
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductsPage;