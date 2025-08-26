// src/pages/AdminBannerPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminBannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('/');
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    try {
      const { data } = await API.get('/api/v1/banners');
      if (Array.isArray(data)) setBanners(data);
    } catch {
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
    if (!image || !title) {
      toast.error('Please provide a title and upload an image.');
      return;
    }
    try {
      await API.post('/api/v1/banners', { image, title, link });
      toast.success('Banner added successfully!');
      setImage('');
      setTitle('');
      setLink('/');
      document.getElementById('image-file-input').value = null;
      fetchBanners();
    } catch {
      toast.error('Failed to add banner.');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await API.delete(`/api/v1/banners/${id}`);
        toast.success('Banner deleted.');
        fetchBanners();
      } catch {
        toast.error('Failed to delete banner.');
      }
    }
  };

  return (
    <div className="admin-page-container">
      <h1 className="page-title" style={{ paddingTop: 0 }}>Manage Homepage Banners</h1>

      {/* Add New Banner Form */}
      <div className="form-wrapper" style={{ maxWidth: '100%', padding: '30px', margin: '0 0 40px 0' }}>
        <h2 style={{ marginBottom: '20px' }}>Add New Banner</h2>
        <form onSubmit={submitHandler} aria-label="Add New Banner">
          <div className="form-group">
            <label htmlFor="title">Banner Title <span aria-hidden="true">*</span></label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
              placeholder="e.g., Summer Sale"
            />
          </div>
          <div className="form-group">
            <label htmlFor="link">Link (destination page)</label>
            <input
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="form-control"
              placeholder="e.g., /category/electronics"
            />
          </div>
          <div className="form-group">
            <label htmlFor="image-file-input">Banner Image <span aria-hidden="true">*</span></label>
            <input
              type="file"
              id="image-file-input"
              onChange={handleImageUpload}
              className="form-control"
              accept="image/*"
              required
            />
            {uploading && <p role="status">Uploading...</p>}
          </div>
          <button type="submit" className="btn-full" disabled={uploading || !image}>
            {uploading ? 'Uploading...' : 'Add Banner'}
          </button>
        </form>
      </div>

      {/* Current Banners Table */}
      <h2 style={{ marginBottom: '16px' }}>Current Banners</h2>
      <div className="admin-table-container">
        <table className="admin-table" role="table" aria-label="Current Banners">
          <thead>
            <tr>
              <th scope="col">Image Preview</th>
              <th scope="col">Title</th>
              <th scope="col">Link</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td>
                  <img
                    src={banner.image}
                    alt={banner.title || 'Banner image'}
                    style={{ width: '200px', height: 'auto', borderRadius: '4px' }}
                  />
                </td>
                <td>{banner.title}</td>
                <td>{banner.link}</td>
                <td>
                  <Link to={`/admin/banner/${banner._id}/edit`}>
                    <button className="btn-icon" aria-label={`Edit banner ${banner.title || banner._id}`}>✏️</button>
                  </Link>
                  <button
                    onClick={() => deleteHandler(banner._id)}
                    className="btn-icon"
                    aria-label={`Delete banner ${banner.title || banner._id}`}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  No banners available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBannerPage;
