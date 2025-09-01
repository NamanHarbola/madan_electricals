// src/pages/AdminAboutPage.jsx
import React, { useEffect, useId, useState } from 'react';
import API from '../api';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const MAX_TITLE = 100;
const MAX_DESC = 5000;

// Optional: help the browser pick the right preview size (works w/ most CDNs, harmless otherwise)
const buildSrcSet = (url) => {
  if (!url) return undefined;
  const sep = url.includes('?') ? '&' : '?';
  return [
    `${url}${sep}w=320 320w`,
    `${url}${sep}w=640 640w`,
    `${url}${sep}w=960 960w`,
  ].join(', ');
};
const PREVIEW_SIZES = '(max-width: 599px) 40vw, 300px';

const AdminAboutPage = () => {
  const { userInfo } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const titleId = useId();
  const descId = useId();
  const imgHelpId = useId();
  const statusId = useId();

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const { data } = await API.get('/api/v1/about');
        setTitle(data?.title || '');
        setDescription(data?.description || '');
        setImage(data?.image || '');
      } catch (error) {
        toast.error('Could not fetch about page content.');
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) fetchAboutContent();
  }, [userInfo]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    // Optional lightweight size guard (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large. Please upload up to 5MB.');
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
      toast.success('Image uploaded successfully!');
    } catch {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
      // reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (uploading || saving) return;

    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }
    if (!description.trim()) {
      toast.error('Description is required.');
      return;
    }

    setSaving(true);
    try {
      await API.put('/api/v1/about', { title: title.trim(), description: description.trim(), image });
      toast.success('About page updated successfully!');
    } catch {
      toast.error('Failed to update about page.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page-container">
      <h1 className="page-title" style={{ paddingTop: 0 }}>Manage About Us Page</h1>

      <div className="form-wrapper" role="region" aria-labelledby={`${titleId}-heading`}>
        <h2 id={`${titleId}-heading`} style={{ marginTop: 0, marginBottom: 16, fontSize: '1.25rem' }}>
          About Content
        </h2>

        <form onSubmit={submitHandler} noValidate>
          <div className="form-group">
            <label htmlFor={titleId}>Title</label>
            <input
              id={titleId}
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
              placeholder="e.g., About Madan Electricals"
              required
              aria-describedby={`${titleId}-help ${titleId}-count`}
              maxLength={MAX_TITLE}
            />
            <div id={`${titleId}-help`} style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 6 }}>
              Keep it short and descriptive (max {MAX_TITLE} characters).
            </div>
            <div id={`${titleId}-count`} style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              {title.length}/{MAX_TITLE}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={descId}>Description</label>
            <textarea
              id={descId}
              className="form-control"
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
              placeholder="Tell customers about your store, values, and services..."
              required
              aria-describedby={`${descId}-help ${descId}-count`}
              maxLength={MAX_DESC}
            />
            <div id={`${descId}-help`} style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 6 }}>
              You can include your history, expertise, and what makes your store special (up to {MAX_DESC} characters).
            </div>
            <div id={`${descId}-count`} style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              {description.length}/{MAX_DESC}
            </div>
          </div>

          <div className="form-group">
            <label>Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {image && (
                <img
                  src={image}
                  srcSet={buildSrcSet(image)}
                  sizes={PREVIEW_SIZES}
                  alt="About page preview"
                  loading="lazy"
                  decoding="async"
                  style={{ width: 150, height: 'auto', borderRadius: 'var(--r-sm)', border: '1px solid var(--color-border)' }}
                />
              )}
              <div style={{ minWidth: 220 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-control"
                  aria-describedby={imgHelpId}
                />
                <div id={imgHelpId} style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 6 }}>
                  JPG/PNG/WebP up to 5MB. Recommended: 1600×900 for desktop, 800×1000 for mobile.
                </div>
                <div
                  id={statusId}
                  role="status"
                  aria-live="polite"
                  style={{ fontSize: 12, color: uploading ? 'var(--color-secondary)' : 'var(--color-text-secondary)', marginTop: 6 }}
                >
                  {uploading ? 'Uploading image…' : ' '}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-full"
            disabled={uploading || saving}
            aria-busy={uploading || saving}
            style={{ marginTop: 20 }}
          >
            {uploading ? 'Waiting for Image…' : saving ? 'Saving…' : 'Update About Page'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAboutPage;
