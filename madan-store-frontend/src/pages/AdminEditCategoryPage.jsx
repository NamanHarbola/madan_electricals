// src/pages/AdminEditCategoryPage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
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
  const [image, setImage] = useState('');           // persisted image URL (server)
  const [tempPreview, setTempPreview] = useState(''); // local preview while choosing a new file
  const fileInputRef = useRef(null);

  // Fetch existing category
  useEffect(() => {
    if (!userInfo) return;

    const controller = new AbortController();

    (async () => {
      try {
        const { data } = await API.get(`/api/v1/categories/${id}`, {
          signal: controller.signal,
        });
        setName(data?.name || '');
        setImage(data?.image || '');
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          toast.error(error.response?.data?.message || 'Could not fetch category details.');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id, userInfo]);

  // Derived validation state
  const isNameValid = useMemo(() => name.trim().length >= 2, [name]);
  const isSubmitDisabled = uploading || !isNameValid;

  // Image handlers
  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // quick client-side guardrails
    const tooLarge = file.size > 3 * 1024 * 1024; // 3MB
    if (tooLarge) {
      toast.error('Please choose an image up to 3MB.');
      e.target.value = null;
      return;
    }
    if (!/^image\//.test(file.type)) {
      toast.error('Please choose a valid image file.');
      e.target.value = null;
      return;
    }

    // local preview
    const reader = new FileReader();
    reader.onload = () => setTempPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please choose an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await API.post('/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data.imageUrl);
      setTempPreview(''); // clear temp preview once we have a server URL
      fileInputRef.current.value = null;
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImage('');
    setTempPreview('');
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNameValid) {
      toast.error('Please enter a category name (min 2 characters).');
      return;
    }

    try {
      await API.put(`/api/v1/categories/${id}`, {
        name: name.trim(),
        image, // may be empty; backend should handle default if you prefer
      });
      toast.success('Category updated successfully!');
      navigate('/admin/categories');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page-container">
      <h1 className="page-title" style={{ paddingTop: 0 }}>Edit Category</h1>

      <div className="form-wrapper" role="region" aria-labelledby="edit-category-heading">
        <h2 id="edit-category-heading" style={{ marginTop: 0, fontSize: '1.15rem' }}>
          Category Details
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              aria-invalid={!isNameValid ? 'true' : 'false'}
              aria-describedby={!isNameValid ? 'name-error' : undefined}
              placeholder="e.g., Switches"
              autoComplete="off"
            />
            {!isNameValid && (
              <div id="name-error" style={{ color: 'var(--color-error)', marginTop: 6, fontSize: '.9rem' }}>
                Name must be at least 2 characters long.
              </div>
            )}
          </div>

          {/* Image */}
          <div className="form-group">
            <label htmlFor="image-file-input">Category Image</label>

            <div style={{ display: 'grid', gap: 12 }}>
              <input
                id="image-file-input"
                ref={fileInputRef}
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFilePick}
                aria-describedby="image-help"
              />
              <small id="image-help" style={{ color: 'var(--color-text-secondary)' }}>
                JPG/PNG recommended, up to 3MB.
              </small>

              {/* Preview Row */}
              {(tempPreview || image) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <img
                    src={tempPreview || image}
                    alt={name ? `${name} preview` : 'Category image preview'}
                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--color-border)' }}
                  />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-full"
                      style={{ width: 'auto', padding: '10px 14px' }}
                      onClick={handleImageUpload}
                      disabled={uploading || !fileInputRef.current?.files?.length}
                      aria-busy={uploading ? 'true' : 'false'}
                    >
                      {uploading ? 'Uploading…' : (image ? 'Replace Image' : 'Upload Image')}
                    </button>
                    {(image || tempPreview) && (
                      <button
                        type="button"
                        className="btn-full"
                        style={{
                          width: 'auto',
                          padding: '10px 14px',
                          background: '#e74c3c',
                          boxShadow: 'none',
                        }}
                        onClick={removeImage}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-full"
            style={{ marginTop: 20 }}
            disabled={isSubmitDisabled}
            aria-disabled={isSubmitDisabled ? 'true' : 'false'}
          >
            {uploading ? 'Uploading…' : 'Update Category'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditCategoryPage;
