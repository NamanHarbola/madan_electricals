// src/pages/AdminAboutPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.js'; // <-- CORRECTED IMPORT PATH
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminAboutPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchAboutContent = async () => {
            try {
                const { data } = await axios.get('/api/v1/about');
                setTitle(data.title);
                setDescription(data.description);
                setImage(data.image);
            } catch (error) {
                toast.error('Could not fetch about page content.');
            } finally {
                setLoading(false);
            }
        };
        fetchAboutContent();
    }, []);

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
            setImage(data.imageUrl);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            toast.error('Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.put('/api/v1/about', { title, description, image }, config);
            toast.success('About page updated successfully!');
        } catch (error) {
            toast.error('Failed to update about page.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-page-container">
            <h1 className="page-title" style={{ paddingTop: 0 }}>Manage About Us Page</h1>
            <div className="form-wrapper">
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            rows="10"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control"
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Image</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {image && (
                                <img
                                    src={image}
                                    alt="About Us Preview"
                                    style={{ width: '150px', height: 'auto', borderRadius: 'var(--radius-base)' }}
                                />
                            )}
                            <input type="file" onChange={handleImageUpload} className="form-control" />
                        </div>
                        {uploading && <p>Uploading image...</p>}
                    </div>
                    <button type="submit" className="btn-full" disabled={uploading}>
                        {uploading ? 'Waiting for Image...' : 'Update About Page'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAboutPage;