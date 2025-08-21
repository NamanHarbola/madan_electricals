// src/pages/AdminBannerPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const AdminBannerPage = () => {
    const [banners, setBanners] = useState([]);
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const { userInfo } = useAuth();

    const fetchBanners = async () => {
        try {
            // FIX: Using relative path with API version
            const { data } = await axios.get('/api/v1/banners');
            setBanners(data);
        } catch (err) {
            toast.error('Failed to fetch banners.');
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
            // FIX: Using relative path with API version
            const { data } = await axios.post('/api/v1/upload', formData, config);
            setImage(data.imageUrl);
            toast.success('Image ready to be saved.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.error('Please upload an image first.');
            return;
        }
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            // FIX: Using relative path with API version
            await axios.post('/api/v1/banners', { image }, config);
            toast.success('Banner added successfully!');
            setImage('');
            document.getElementById('image-file-input').value = null;
            fetchBanners();
        } catch (error) {
            toast.error('Failed to add banner.');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // FIX: Using relative path with API version
                await axios.delete(`/api/v1/banners/${id}`, config);
                toast.success('Banner deleted.');
                fetchBanners();
            } catch (error) {
                toast.error('Failed to delete banner.');
            }
        }
    };

    return (
        <div className="admin-page-container">
            <h1 className="page-title">Manage Homepage Banners</h1>
            <div className="form-wrapper" style={{ maxWidth: '100%', padding: '30px', margin: '0 0 40px 0' }}>
                <h3>Add New Banner Image</h3>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="image-file-input">Select a bright, clear image (e.g., 1920x1080px)</label>
                        <input type="file" id="image-file-input" onChange={handleImageUpload} className="form-control" required />
                        {uploading && <p>Uploading...</p>}
                    </div>
                    <button type="submit" className="btn-full" disabled={uploading || !image}>
                        {uploading ? 'Uploading...' : 'Add Banner'}
                    </button>
                </form>
            </div>

            <h3>Current Banners</h3>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image Preview</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map((banner) => (
                            <tr key={banner._id}>
                                <td><img src={banner.image} alt="Banner" style={{ width: '200px', height: 'auto', borderRadius: '4px' }} /></td>
                                <td>
                                    <button onClick={() => deleteHandler(banner._id)} className="btn-icon" title="Delete Banner">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBannerPage;
