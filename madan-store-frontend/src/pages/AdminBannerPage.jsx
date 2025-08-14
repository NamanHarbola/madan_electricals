// src/pages/AdminBannerPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const AdminBannerPage = () => {
    const [banners, setBanners] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useAuth();

    const fetchBanners = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/banners');
            setBanners(data);
        } catch (err) {
            setError('Failed to fetch banners.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    // This assumes your createBanner route will be protected
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.post('http://localhost:5000/api/banners', { text }, config);
            setText('');
            alert('Banner added successfully!');
            fetchBanners(); // Refresh the list
        } catch (error) {
            alert('Failed to add banner.');
            console.error(error);
        }
    };

    return (
        <div className="admin-page-container">
            <h1 className="page-title">Manage Banners</h1>

            <div className="form-container" style={{ maxWidth: '100%', padding: 0, margin: '0 0 40px 0' }}>
                <div className="form-wrapper">
                    <h3>Add New Banner</h3>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor="bannerText">Banner Text</label>
                            <input
                                id="bannerText"
                                type="text"
                                className="form-control"
                                placeholder="e.g., Free shipping on orders over ₹5000!"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-full">Add Banner</button>
                    </form>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Banner Text</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3">Loading...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="3" style={{ color: 'red' }}>{error}</td></tr>
                        ) : (
                            banners.map((banner) => (
                                <tr key={banner._id}>
                                    <td>{banner.text}</td>
                                    <td>{banner.isActive ? 'Active' : 'Inactive'}</td>
                                    <td>
                                        <button className="btn-icon">✏️</button>
                                        <button className="btn-icon">🗑️</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBannerPage;