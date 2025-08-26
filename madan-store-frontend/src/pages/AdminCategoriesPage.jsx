// src/pages/AdminCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/api/v1/categories');
      if (Array.isArray(data)) setCategories(data);
    } catch {
      toast.error('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
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
    if (!name.trim() || !image) {
      toast.error('Please enter a name and upload an image.');
      return;
    }
    try {
      await API.post('/api/v1/categories', { name: name.trim(), image });
      toast.success('Category added successfully!');
      setName('');
      setImage('');
      const input = document.getElementById('image-file-input');
      if (input) input.value = null;
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category.');
    }
  };

  const deleteHandler = async (id, catName) => {
    if (!window.confirm(`Delete "${catName}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/api/v1/categories/${id}`);
      toast.success('Category deleted.');
      fetchCategories();
    } catch {
      toast.error('Failed to delete category.');
    }
  };

  return (
    <div className="admin-page-container">
      <h1 className="page-title">Manage Categories</h1>

      {/* Add New Category */}
      <div className="form-wrapper" style={{ maxWidth: '100%', padding: '30px', margin: '0 0 40px 0' }}>
        <h2 style={{ marginBottom: 16 }}>Add New Category</h2>
        <form onSubmit={submitHandler} aria-label="Add New Category">
          <div className="form-group">
            <label htmlFor="name">
              Category Name <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
              placeholder="e.g., Switches"
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image-file-input">
              Category Image <span aria-hidden="true">*</span>
            </label>
            <input
              type="file"
              id="image-file-input"
              onChange={handleImageUpload}
              className="form-control"
              required
              accept="image/*"
              aria-required="true"
            />
            {uploading && <p role="status">Uploading image…</p>}
          </div>

          <button type="submit" className="btn-full" disabled={uploading || !image}>
            {uploading ? 'Uploading…' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* Current Categories */}
      <h2 style={{ marginBottom: 16 }}>Current Categories</h2>

      <div className="admin-table-container">
        <table className="admin-table" role="table" aria-label="Current Categories">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col" style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" style={{ padding: 20, textAlign: 'center' }} role="status">
                  Loading…
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ padding: 20, textAlign: 'center' }}>
                  No categories yet. Add your first category above.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id}>
                  <td>
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{ width: 100, height: 'auto', borderRadius: 4 }}
                    />
                  </td>
                  <td>{category.name}</td>
                  <td>
                    <Link to={`/admin/category/${category._id}/edit`} aria-label={`Edit category ${category.name}`}>
                      <button className="btn-icon" title="Edit Category">✏️</button>
                    </Link>
                    <button
                      onClick={() => deleteHandler(category._id, category.name)}
                      className="btn-icon"
                      title="Delete Category"
                      aria-label={`Delete category ${category.name}`}
                    >
                      🗑️
                    </button>
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

export default AdminCategoriesPage;
