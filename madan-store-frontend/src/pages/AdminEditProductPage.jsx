// src/pages/AdminEditProductPage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    mrp: '',
    category: '',
    images: [],
    description: '',
    stock: '',
    trending: false,
  });

  // ----- Fetch product + categories (abortable) -----
  useEffect(() => {
    if (!userInfo) return;
    const controller = new AbortController();

    (async () => {
      try {
        const [prodRes, catsRes] = await Promise.all([
          API.get(`/api/v1/products/${id}`, { signal: controller.signal }),
          API.get('/api/v1/categories', { signal: controller.signal }),
        ]);

        const prod = prodRes.data || {};
        const cats = Array.isArray(catsRes.data) ? catsRes.data : [];

        setProduct((prev) => ({
          ...prev,
          ...prod,
          images: Array.isArray(prod.images) ? prod.images : (prod.image ? [prod.image] : []),
          // keep current category, otherwise default to first category (by name) if present
          category: prod.category || (cats[0]?.name || ''),
        }));

        setCategories(cats);
      } catch (e) {
        if (e.name !== 'CanceledError' && e.name !== 'AbortError') {
          toast.error('Failed to load product or categories.');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id, userInfo]);

  // ----- Basic handlers -----
  const onChangeField = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ----- Image uploads (multi) -----
  const fileInputRef = useRef(null);

  const onSelectFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const valid = files.filter((f) => /^image\//.test(f.type));
    if (!valid.length) {
      toast.error('Please choose image files only.');
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of valid) {
        // guardrails: size up to ~5MB
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" is larger than 5MB.`);
          continue;
        }
        const fd = new FormData();
        fd.append('image', file);
        const { data } = await API.post('/api/v1/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (data?.imageUrl) uploadedUrls.push(data.imageUrl);
      }
      if (uploadedUrls.length) {
        setProduct((p) => ({ ...p, images: [...(p.images || []), ...uploadedUrls] }));
        toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded`);
      }
    } catch {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx) => {
    setProduct((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  // ----- Drag to reorder images -----
  const dragIndex = useRef(null);
  const onDragStart = (e, i) => { dragIndex.current = i; };
  const onDragOver = (e) => { e.preventDefault(); };
  const onDrop = (e, i) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from == null || from === i) return;
    setProduct((p) => {
      const next = [...(p.images || [])];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return { ...p, images: next };
    });
    dragIndex.current = null;
  };

  // ----- Validation helpers -----
  const priceNum = Number(product.price);
  const mrpNum = Number(product.mrp);
  const stockNum = Number(product.stock);
  const nameValid = product.name?.trim().length >= 2;
  const priceValid = !isNaN(priceNum) && priceNum > 0;
  const mrpValid = !isNaN(mrpNum) && mrpNum > 0 && priceNum <= mrpNum;
  const stockValid = !isNaN(stockNum) && stockNum >= 0;
  const canSubmit = nameValid && priceValid && mrpValid && stockValid && !saving && !uploading;

  // ----- Submit -----
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      if (!nameValid) toast.error('Enter a valid name (min 2 characters).');
      else if (!priceValid) toast.error('Enter a valid Selling Price.');
      else if (!mrpValid) toast.error('MRP must be >= price and > 0.');
      else if (!stockValid) toast.error('Enter a valid stock (0 or more).');
      return;
    }

    setSaving(true);
    try {
      await API.put(`/api/v1/products/${id}`, {
        ...product,
        price: priceNum,
        mrp: mrpNum,
        stock: stockNum,
      });
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const hasImages = useMemo(() => Array.isArray(product.images) && product.images.length > 0, [product.images]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page-container">
      <div className="admin-header" style={{ marginBottom: 0 }}>
        <h1 className="admin-title">Edit Product</h1>
        <div className="admin-actions">
          <button
            type="button"
            className="btn-login desktop-only"
            onClick={() => navigate('/admin/products')}
          >
            Back to Products
          </button>
        </div>
      </div>

      <div className="form-wrapper" style={{ maxWidth: 880, marginInline: 'auto' }}>
        <form onSubmit={onSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              name="name"
              className="form-control"
              type="text"
              value={product.name}
              onChange={onChangeField}
              required
              aria-invalid={!nameValid ? 'true' : 'false'}
              placeholder="e.g., MacBook Pro 14-inch"
              autoComplete="off"
            />
          </div>

          {/* Price & MRP */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group">
              <label htmlFor="price">Selling Price</label>
              <input
                id="price"
                name="price"
                className="form-control"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={product.price}
                onChange={onChangeField}
                required
                aria-invalid={!priceValid ? 'true' : 'false'}
              />
            </div>
            <div className="form-group">
              <label htmlFor="mrp">MRP</label>
              <input
                id="mrp"
                name="mrp"
                className="form-control"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={product.mrp}
                onChange={onChangeField}
                required
                aria-invalid={!mrpValid ? 'true' : 'false'}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={product.description}
              onChange={onChangeField}
              required
              placeholder="Short, scannable product description"
            />
          </div>

          {/* Stock & Category */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                name="stock"
                className="form-control"
                type="number"
                min="0"
                inputMode="numeric"
                value={product.stock}
                onChange={onChangeField}
                required
                aria-invalid={!stockValid ? 'true' : 'false'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={product.category || ''}
                onChange={onChangeField}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Images — multi upload + preview grid */}
          <div className="form-group">
            <label htmlFor="image-files">Product Images</label>

            {hasImages && (
              <div
                className="product-grid"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))',
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {product.images.map((url, i) => (
                  <div
                    key={`${url}-${i}`}
                    className="product-card"
                    style={{
                      maxWidth: '100%',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'move',
                    }}
                    draggable
                    onDragStart={(e) => onDragStart(e, i)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, i)}
                    title="Drag to reorder"
                    aria-label={`Image ${i + 1}. Drag to reorder.`}
                  >
                    <div className="product-image" style={{ aspectRatio: '1/1' }}>
                      <img src={url} alt={`Product image ${i + 1}`} loading="lazy" decoding="async" />
                    </div>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => removeImage(i)}
                      style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.55)', color: '#fff', borderRadius: 8 }}
                      aria-label={`Remove image ${i + 1}`}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              id="image-files"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="form-control"
              onChange={onSelectFiles}
            />
            {uploading && <p style={{ marginTop: 8 }}>Uploading image(s)…</p>}
            <small style={{ color: 'var(--color-text-secondary)' }}>
              You can upload multiple images. Drag cards to reorder; the first image is the main image on the product page.
            </small>
          </div>

          {/* Flags */}
          <div
            className="form-group"
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}
          >
            <input
              id="trending"
              name="trending"
              type="checkbox"
              checked={!!product.trending}
              onChange={onChangeField}
              style={{ width: 'auto', height: 'auto' }}
            />
            <label htmlFor="trending" style={{ marginBottom: 0 }}>
              Mark as Trending
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-full"
            style={{ marginTop: 20 }}
            disabled={!canSubmit}
            aria-disabled={!canSubmit ? 'true' : 'false'}
          >
            {saving ? 'Saving…' : uploading ? 'Waiting for uploads…' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProductPage;
