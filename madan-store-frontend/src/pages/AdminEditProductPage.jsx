// src/pages/AdminEditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';

const AdminEditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [product, setProduct] = useState({
        name: '', price: '', mrp: '', category: 'electronics', image: '',
        description: '', stock: '', rating: '', trending: false,
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                toast.error('Could not fetch product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
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
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
            setProduct(prevState => ({ ...prevState, image: data.imageUrl }));
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
            await axios.put(`http://localhost:5000/api/products/${id}`, product, config);
            toast.success('Product updated successfully!');
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '50px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="admin-page-container">
            <h1 className="page-title">Edit Product</h1>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    {/* ... other form fields (name, price, etc.) ... */}
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" id="name" name="name" value={product.name} onChange={handleChange} className="form-control" required />
                    </div>
                    
                    {/* Image Upload Field */}
                    <div className="form-group">
                        <label>Product Image</label>
                        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                            <img src={product.image} alt="Product Preview" style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-base)'}}/>
                            <input type="file" id="image-file-input" onChange={handleImageUpload} className="form-control" />
                        </div>
                        {uploading && <p>Uploading image...</p>}
                    </div>

                    {/* ... other form fields (description, stock, etc.) ... */}

                    <button type="submit" className="btn-full" style={{marginTop: '20px'}} disabled={uploading}>
                        {uploading ? 'Waiting for Image...' : 'Update Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditProductPage;