// src/pages/AdminEditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AdminEditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        price: '',
        mrp: '',
        category: '',
        images: [],
        description: '',
        stock: '',
        trending: false,
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/v1/products/${id}`);
                setProduct(data);
            } catch (error) {
                toast.error('Could not fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/v1/categories');
                setCategories(data);
            } catch (error) {
                toast.error('Could not fetch categories.');
            }
        };

        fetchProduct();
        fetchCategories();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('/api/v1/upload', formData, config);
            setProduct(prevState => ({ ...prevState, images: [data.imageUrl] }));
            toast.success('Image uploaded successfully!');
        } catch (error) {
            toast.error('Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.put(`/api/v1/products/${id}`, product, config);
            toast.success('Product updated successfully!');
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-page-container">
            <h1 className="page-title" style={{paddingTop: 0}}>Edit Product</h1>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    {/* --- ALL PRODUCT FIELDS --- */}
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" id="name" name="name" value={product.name} onChange={handleChange} className="form-control" required />
                    </div>

                    <div className="form-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                        <div className="form-group">
                            <label htmlFor="price">Selling Price</label>
                            <input type="number" id="price" name="price" value={product.price} onChange={handleChange} className="form-control" required step="0.01" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mrp">MRP</label>
                            <input type="number" id="mrp" name="mrp" value={product.mrp} onChange={handleChange} className="form-control" required step="0.01" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" value={product.description} onChange={handleChange} className="form-control" rows="4" required></textarea>
                    </div>

                    <div className="form-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                        <div className="form-group">
                            <label htmlFor="stock">Stock</label>
                            <input type="number" id="stock" name="stock" value={product.stock} onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select id="category" name="category" value={product.category} onChange={handleChange} className="form-control">
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Product Image</label>
                        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                            {product.images && product.images.length > 0 && (
                                <img src={product.images[0]} alt="Product Preview" style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-base)'}}/>
                            )}
                            <input type="file" id="image-file-input" onChange={handleImageUpload} className="form-control" />
                        </div>
                        {uploading && <p>Uploading image...</p>}
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                        <input type="checkbox" id="trending" name="trending" checked={product.trending} onChange={handleChange} style={{ width: 'auto', height: 'auto' }} />
                        <label htmlFor="trending" style={{marginBottom: 0}}>Mark as Trending</label>
                    </div>

                    <button type="submit" className="btn-full" style={{marginTop: '20px'}} disabled={uploading}>
                        {uploading ? 'Waiting for Image...' : 'Update Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditProductPage;