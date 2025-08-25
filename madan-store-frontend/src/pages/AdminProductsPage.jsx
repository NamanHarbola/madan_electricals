import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import formatCurrency from '../utils/formatCurrency.js';
import { useAuth } from '../hooks/useAuth.js'; // <-- CORRECTED IMPORT PATH
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useAuth();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // FIX: Using relative path with API version
            const { data } = await axios.get('/api/v1/products');
            setProducts(data);
        } catch (err) {
            setError('Could not fetch products. Please try again later.');
            toast.error('Could not fetch products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                // FIX: Using relative path with API version
                await axios.delete(`/api/v1/products/${id}`, config);
                setProducts(products.filter((p) => p._id !== id));
                toast.success('Product deleted successfully');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting product');
            }
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="container" style={{ paddingTop: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;

    return (
        <div className="admin-page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 className="page-title" style={{ marginBottom: 0, paddingTop: 0 }}>Products</h1>
                <Link to="/admin/products/add" className="btn-full" style={{ marginTop: 0, width: 'auto' }}>
                    + Add Product
                </Link>
            </div>
            
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
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
                                <td><img src={product.images[0]} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}/></td>
                                <td style={{ fontWeight: '500' }}>{product.name}</td>
                                <td>{formatCurrency(product.price)}</td>
                                <td>{product.stock > 0 ? product.stock : <span style={{color: 'var(--color-error)'}}>Out of Stock</span>}</td>
                                <td>{product.category}</td>
                                <td>
                                    <Link to={`/admin/product/${product._id}/edit`}>
                                        <button className="btn-icon" title="Edit">✏️</button>
                                    </Link>
                                    <button onClick={() => deleteHandler(product._id)} className="btn-icon" title="Delete">
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