// src/pages/AdminBannerPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api'; // <-- 1. Import the central API instance
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminBannerPage = () => {
    const [banners, setBanners] = useState([]);
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('/');
    const [uploading, setUploading] = useState(false);
    const { userInfo } = useAuth();

    const fetchBanners = async () => {
        try {
            // 2. Use the API instance
            const { data } = await API.get('/api/v1/banners');
            if (Array.isArray(data)) {
                setBanners(data);
            }
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
            // 3. Use the API instance
            const { data } = await API.post('/api/v1/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
        if (!image || !title) {
            toast.error('Please provide a title and upload an image.');
            return;
        }
        try {
            // 4. Use the API instance
            await API.post('/api/v1/banners', { image, title, link });
            toast.success('Banner added successfully!');
            setImage('');
            setTitle('');
            setLink('/');
            document.getElementById('image-file-input').value = null;
            fetchBanners();
        } catch (error) {
            toast.error('Failed to add banner.');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                // 5. Use the API instance
                await API.delete(`/api/v1/banners/${id}`);
                toast.success('Banner deleted.');
                fetchBanners();
            } catch (error) {
                toast.error('Failed to delete banner.');
            }
        }
    };

    return (
        <div className="admin-page-container">
            <h1 className="page-title" style={{ paddingTop: 0 }}>Manage Homepage Banners</h1>
            <div className="form-wrapper" style={{ maxWidth: '100%', padding: '30px', margin: '0 0 40px 0' }}>
                <h3>Add New Banner</h3>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="title">Banner Title (for accessibility)</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required placeholder="e.g., Summer Sale" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="link">Link (what page it goes to)</label>
                        <input type="text" id="link" value={link} onChange={(e) => setLink(e.target.value)} className="form-control" placeholder="e.g., /category/electronics" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image-file-input">Banner Image</label>
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
                            <th>Title</th>
                            <th>Link</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map((banner) => (
                            <tr key={banner._id}>
                                <td><img src={banner.image} alt={banner.title} style={{ width: '200px', height: 'auto', borderRadius: '4px' }} /></td>
                                <td>{banner.title}</td>
                                <td>{banner.link}</td>
                                <td>
                                    <Link to={`/admin/banner/${banner._id}/edit`}>
                                        <button className="btn-icon" title="Edit Banner">✏️</button>
                                    </Link>
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