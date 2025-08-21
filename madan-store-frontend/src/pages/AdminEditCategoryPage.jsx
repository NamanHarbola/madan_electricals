// src/pages/AdminEditCategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AdminEditCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`/api/v1/categories/${id}`, config);
                setName(data.name);
                setImage(data.image);
            } catch (error) {
                toast.error('Could not fetch category details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id, userInfo.token]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('/api/v1/upload', formData, config);
            setImage(data.imageUrl);
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
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`/api/v1/categories/${id}`, { name, image }, config);
            toast.success('Category updated successfully!');
            navigate('/admin/categories');
        } catch (error) {
            toast.error('Failed to update category.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-page-container">
            <h1 className="page-title" style={{paddingTop: 0}}>Edit Category</h1>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Category Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Category Image</label>
                        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                            {image && <img src={image} alt="Preview" style={{width: '150px', height: 'auto', borderRadius: 'var(--radius-base)'}}/>}
                            <input type="file" id="image-file-input" onChange={handleImageUpload} className="form-control" />
                        </div>
                        {uploading && <p>Uploading...</p>}
                    </div>
                    <button type="submit" className="btn-full" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Update Category'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditCategoryPage;