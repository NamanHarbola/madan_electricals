// src/pages/AdminEditBannerPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AdminEditBannerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [banner, setBanner] = useState({
    title: '',
    link: '',
    image: '',
    isActive: true,
  });

  // Derive whether submit is allowed
  const canSubmit = useMemo(
    () => !uploading && !saving && banner.title.trim().length > 0 && !!banner.image,
    [uploading, saving, banner.title, banner.image]
  );

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data } = await API.get(`/api/v1/banners/${id}`);
        // Defensive: ensure keys exist
        setBanner({
          title: data?.title || '',
          link: data?.link || '',
          image: data?.image || '',
          isActive: typeof data?.isActive === 'boolean' ? data.isActive : true,
        });
      } catch (error) {
        toast.error('Could not fetch banner details.');
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) fetchBanner();
  }, [id, userInfo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBanner((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/^image\//i.test(file.type)) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image too large. Please upload a file under 4MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await API.post('/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!data?.imageUrl) throw new Error('No imageUrl returned');
      setBanner((prev) => ({ ...prev, image: data.imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    try {
      const payload = {
        title: banner.title.trim(),
        link: banner.link?.trim() || '/',
        image: banner.image,
        isActive: !!banner.isActive,
      };
      await API.put(`/api/v1/banners/${id}`, payload);
      toast.success('Banner updated successfully!');
      navigate('/admin/banners');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update banner.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page-container">
      <h1 className="page-title" style={{ paddingTop: 0 }}>Edit Banner</h1>

      <div className="form-wrapper" role="form" aria-labelledby="edit-banner-title">
        <form onSubmit={handleSubmit} noValidate>
          <fieldset disabled={saving} style={{ border: 0, padding: 0, margin: 0 }}>
            <legend id="edit-banner-title" className="sr-only">Edit banner</legend>

            <div className="form-group">
              <label htmlFor="title">Banner Title <span aria-hidden="true">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={banner.title}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="e.g., Summer Sale – Up to 50% Off"
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="link">Link (destination URL or route)</label>
              <input
                type="text"
                id="link"
                name="link"
                value={banner.link}
                onChange={handleChange}
                className="form-control"
                placeholder="/category/electronics or https://example.com/promo"
                inputMode="url"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image-file-input">Banner Image <span aria-hidden="true">*</span></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {banner.image && (
                  <img
                    src={banner.image}
                    alt={banner.title || 'Banner preview'}
                    style={{ width: '180px', height: 'auto', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                )}
                <input
                  type="file"
                  id="image-file-input"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-control"
                  aria-describedby="image-help"
                />
              </div>
              <small id="image-help" style={{ color: 'var(--color-text-secondary)' }}>
                Recommended: wide image (e.g., 1600×600). Max 4MB.
              </small>
              <div aria-live="polite" style={{ marginTop: 6 }}>
                {uploading && <span>Uploading image…</span>}
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={banner.isActive}
                onChange={handleChange}
                style={{ width: 'auto', height: 'auto' }}
              />
              <label htmlFor="isActive" style={{ marginBottom: 0 }}>Active (show on homepage)</label>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
              <button
                type="submit"
                className="btn-full"
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
              >
                {saving ? 'Saving…' : uploading ? 'Waiting for Image…' : 'Update Banner'}
              </button>
              <Link to="/admin/banners" className="btn-full" style={{ width: 'auto', background: 'var(--color-secondary)' }}>
                Cancel
              </Link>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AdminEditBannerPage;
