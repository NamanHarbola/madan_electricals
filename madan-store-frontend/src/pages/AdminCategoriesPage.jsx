// src/pages/AdminCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api'; // <-- 1. Import the central API instance
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const { userInfo } = useAuth();

    const fetchCategories = async () => {
        try {
            // 2. Use the API instance
            const { data } = await API.get('/api/v1/categories');
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (err) {
            toast.error('Failed to fetch categories.');
        }
    };

    useEffect(() => {
        fetchCategories();
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
                headers: { 'Content-Type': 'multipart/form-data' },
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
        if (!name || !image) {
            toast.error('Please enter a name and upload an image.');
            return;
        }
        try {
            // 4. Use the API instance
            await API.post('/api/v1/categories', { name, image });
            toast.success('Category added successfully!');
            setName('');
            setImage('');
            document.getElementById('image-file-input').value = null;
            fetchCategories();
        } catch (error) {
            toast.error('Failed to add category.');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure? This cannot be undone.')) {
            try {
                // 5. Use the API instance
                await API.delete(`/api/v1/categories/${id}`);
                toast.success('Category deleted.');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category.');
            }
        }
    };

    return (
        <div className="admin-page-container">
            <h1 className="page-title">Manage Categories</h1>
            <div className="form-wrapper" style={{ maxWidth: '100%', padding: '30px', margin: '0 0 40px 0' }}>
                <h3>Add New Category</h3>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="name">Category Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image-file-input">Category Image</label>
                        <input type="file" id="image-file-input" onChange={handleImageUpload} className="form-control" required />
                        {uploading && <p>Uploading...</p>}
                    </div>
                    <button type="submit" className="btn-full" disabled={uploading || !image}>
                        {uploading ? 'Uploading...' : 'Add Category'}
                    </button>
                </form>
            </div>

            <h3>Current Categories</h3>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td><img src={category.image} alt={category.name} style={{ width: '100px', height: 'auto', borderRadius: '4px' }} /></td>
                                <td>{category.name}</td>
                                <td>
                                    <Link to={`/admin/category/${category._id}/edit`}>
                                        <button className="btn-icon" title="Edit Category">✏️</button>
                                    </Link>
                                    <button onClick={() => deleteHandler(category._id)} className="btn-icon" title="Delete Category">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategoriesPage;