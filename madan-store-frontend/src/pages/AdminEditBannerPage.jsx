// src/pages/AdminEditBannerPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AdminEditBannerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [banner, setBanner] = useState({
        title: '',
        link: '',
        image: '',
        isActive: true,
    });

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`/api/v1/banners/${id}`, config);
                setBanner(data);
            } catch (error) {
                toast.error('Could not fetch banner details.');
            } finally {
                setLoading(false);
            }
        };
        fetchBanner();
    }, [id, userInfo.token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBanner(prevState => ({
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
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('/api/v1/upload', formData, config);
            setBanner(prevState => ({ ...prevState, image: data.imageUrl }));
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
            await axios.put(`/api/v1/banners/${id}`, banner, config);
            toast.success('Banner updated successfully!');
            navigate('/admin/banners');
        } catch (error) {
            toast.error('Failed to update banner.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-page-container">
            <h1 className="page-title" style={{paddingTop: 0}}>Edit Banner</h1>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Banner Title</label>
                        <input type="text" id="title" name="title" value={banner.title} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="link">Link</label>
                        <input type="text" id="link" name="link" value={banner.link} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Banner Image</label>
                        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                            {banner.image && <img src={banner.image} alt="Preview" style={{width: '150px', height: 'auto', borderRadius: 'var(--radius-base)'}}/>}
                            <input type="file" id="image-file-input" onChange={handleImageUpload} className="form-control" />
                        </div>
                        {uploading && <p>Uploading...</p>}
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" id="isActive" name="isActive" checked={banner.isActive} onChange={handleChange} style={{ width: 'auto', height: 'auto' }} />
                        <label htmlFor="isActive" style={{marginBottom: 0}}>Is Active?</label>
                    </div>
                    <button type="submit" className="btn-full" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Update Banner'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditBannerPage;