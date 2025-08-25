// src/pages/AdminEditCategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api'; // <-- 1. Import the central API instance
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth.js';
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
                // 2. Use the API instance (no manual config needed)
                const { data } = await API.get(`/api/v1/categories/${id}`);
                setName(data.name);
                setImage(data.image);
            } catch (error) {
                toast.error('Could not fetch category details.');
            } finally {
                setLoading(false);
            }
        };
        if (userInfo) {
            fetchCategory();
        }
    }, [id, userInfo]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            // 3. Use the API instance
            const { data } = await API.post('/api/v1/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
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
            // 4. Use the API instance
            await API.put(`/api/v1/categories/${id}`, { name, image });
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