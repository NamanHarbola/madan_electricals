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

  // ----- Fetch product + categories -----
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ data: prod }, { data: cats }] = await Promise.all([
          API.get(`/api/v1/products/${id}`),
          API.get('/api/v1/categories'),
        ]);
        setProduct((prev) => ({
          ...prev,
          ...prod,
          images: Array.isArray(prod.images) ? prod.images : (prod.image ? [prod.image] : []),
        }));
        if (Array.isArray(cats)) setCategories(cats);
      } catch (e) {
        toast.error('Failed to load product or categories.');
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) fetchAll();
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

    // small guardrails
    const valid = files.filter((f) => /^image\//.test(f.type));
    if (!valid.length) {
      toast.error('Please choose image files only.');
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls = [];
      // upload sequentially to keep API simple
      for (const file of valid) {
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
    } catch (err) {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
      // clear input so same file can be reselected
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

  // ----- Submit -----
  const onSubmit = async (e) => {
    e.preventDefault();

    // simple validation
    if (!product.name?.trim()) return toast.error('Name is required.');
    const price = Number(product.price);
    const mrp = Number(product.mrp);
    const stock = Number(product.stock);
    if (isNaN(price) || isNaN(mrp) || price <= 0 || mrp <= 0) {
      return toast.error('Enter valid numbers for Price and MRP.');
    }
    if (price > mrp) {
      return toast.error('Selling Price should be less than or equal to MRP.');
    }
    if (isNaN(stock) || stock < 0) {
      return toast.error('Enter a valid stock value (0 or more).');
    }

    setSaving(true);
    try {
      await API.put(`/api/v1/products/${id}`, {
        ...product,
        price,
        mrp,
        stock,
        // keep `images` as array; backend should already support this
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
        <form onSubmit={onSubmit}>
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
              placeholder="e.g., MacBook Pro 14-inch"
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
                value={product.price}
                onChange={onChangeField}
                required
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
                value={product.mrp}
                onChange={onChangeField}
                required
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
                value={product.stock}
                onChange={onChangeField}
                required
                min={0}
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
            <label>Product Images</label>

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
                  >
                    <div className="product-image" style={{ aspectRatio: '1/1' }}>
                      <img src={url} alt={`Product ${i + 1}`} loading="lazy" decoding="async" />
                    </div>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => removeImage(i)}
                      style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.55)', color: '#fff', borderRadius: 8 }}
                      aria-label="Remove image"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="form-control"
              onChange={onSelectFiles}
            />
            {uploading && <p style={{ marginTop: 8 }}>Uploading image(s)…</p>}
            <small style={{ color: 'var(--color-text-secondary)' }}>
              Tip: You can upload multiple images. Drag cards to reorder; first image becomes the main image on the product page.
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
            disabled={saving || uploading}
          >
            {saving ? 'Saving…' : uploading ? 'Waiting for uploads…' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProductPage;
