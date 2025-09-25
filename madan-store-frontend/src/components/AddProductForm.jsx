// src/components/AddProductForm.jsx
import React, { useState, useEffect, useId } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

const MAX_IMAGE_MB = 4; // reject huge images to keep uploads fast
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const AddProductForm = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mrp: '',
    category: '',
    description: '',
    stock: '',
    trending: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const nameId = useId();
  const priceId = useId();
  const mrpId = useId();
  const stockId = useId();
  const catId = useId();
  const descId = useId();
  const imgId = useId();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/api/v1/categories');
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setFormData(prev => ({ ...prev, category: data[0].name }));
        }
      } catch {
        toast.error('Could not fetch categories.');
      }
    };
    fetchCategories();
  }, []);

  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined })); // clear field error on edit
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setField(name, type === 'checkbox' ? checked : value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) {
      setImageFiles([]);
      setImagePreviews([]);
      return;
    }
    const validFiles = files.filter(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error('Please choose a JPG, PNG, or WebP image.');
        return false;
      }
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        toast.error(`Image must be ≤ ${MAX_IMAGE_MB}MB.`);
        return false;
      }
      return true;
    });

    setImageFiles(validFiles);
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(urls);
  };

  // simple client validation
  const validate = () => {
    const next = {};
    const price = Number(formData.price);
    const mrp = Number(formData.mrp);
    const stock = Number(formData.stock);

    if (!formData.name.trim()) next.name = 'Product name is required.';
    if (!formData.description.trim()) next.description = 'Description is required.';
    if (!formData.category) next.category = 'Please choose a category.';

    if (!formData.price) next.price = 'Price is required.';
    else if (price <= 0) next.price = 'Price must be greater than 0.';

    if (!formData.mrp) next.mrp = 'MRP is required.';
    else if (mrp <= 0) next.mrp = 'MRP must be greater than 0.';
    else if (price > mrp) next.mrp = 'MRP should be ≥ price.';

    if (formData.stock === '') next.stock = 'Stock is required.';
    else if (!Number.isFinite(stock) || stock < 0) next.stock = 'Stock cannot be negative.';

    if (imageFiles.length === 0) next.image = 'Please select at least one image.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // move focus to first error
      const firstKey = Object.keys(errors)[0];
      if (firstKey) document.getElementById(firstKey)?.focus();
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);

      // Step 1: upload images
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const fd = new FormData();
          fd.append('image', file);
          const { data: uploadData } = await API.post('/api/v1/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return uploadData.imageUrl;
        })
      );

      // Step 2: create product with the uploaded image URLs
      const payload = {
        ...formData,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        stock: Number(formData.stock),
        images: imageUrls, // Use the URLs from the upload response
      };

      await API.post('/api/v1/products', payload);

      toast.success(`Product added: ${payload.name}`);
      navigate('/admin/products');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add product.');
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  const disabled = uploading || submitting;

  return (
    <div className="form-wrapper" role="region" aria-labelledby="add-product-heading">
      <h1 id="add-product-heading" className="page-title" style={{ paddingTop: 0, marginBottom: 16 }}>
        Add Product
      </h1>

      <form onSubmit={handleSubmit} noValidate aria-describedby="form-errors" >
        <div className="form-group">
          <label htmlFor={nameId}>Product Name</label>
          <input
            id={nameId}
            name="name"
            type="text"
            className="form-control"
            placeholder="e.g., Schneider MCB 32A"
            value={formData.name}
            onChange={handleChange}
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${nameId}-err` : undefined}
            disabled={disabled}
          />
          {errors.name && <div id={`${nameId}-err`} className="field-error" role="alert">{errors.name}</div>}
        </div>

        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="form-group">
            <label htmlFor={priceId}>Selling Price</label>
            <input
              id={priceId}
              name="price"
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? `${priceId}-err` : undefined}
              disabled={disabled}
            />
            {errors.price && <div id={`${priceId}-err`} className="field-error" role="alert">{errors.price}</div>}
          </div>

          <div className="form-group">
            <label htmlFor={mrpId}>MRP</label>
            <input
              id={mrpId}
              name="mrp"
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={formData.mrp}
              onChange={handleChange}
              required
              aria-invalid={!!errors.mrp}
              aria-describedby={errors.mrp ? `${mrpId}-err` : undefined}
              disabled={disabled}
            />
            {errors.mrp && <div id={`${mrpId}-err`} className="field-error" role="alert">{errors.mrp}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor={descId}>Description</label>
          <textarea
            id={descId}
            name="description"
            rows={4}
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? `${descId}-err` : undefined}
            disabled={disabled}
          />
          {errors.description && <div id={`${descId}-err`} className="field-error" role="alert">{errors.description}</div>}
        </div>

        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="form-group">
            <label htmlFor={stockId}>Stock</label>
            <input
              id={stockId}
              name="stock"
              type="number"
              min="0"
              className="form-control"
              value={formData.stock}
              onChange={handleChange}
              required
              aria-invalid={!!errors.stock}
              aria-describedby={errors.stock ? `${stockId}-err` : undefined}
              disabled={disabled}
            />
            {errors.stock && <div id={`${stockId}-err`} className="field-error" role="alert">{errors.stock}</div>}
          </div>

          <div className="form-group">
            <label htmlFor={catId}>Category</label>
            <select
              id={catId}
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? `${catId}-err` : undefined}
              disabled={disabled || categories.length === 0}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <div id={`${catId}-err`} className="field-error" role="alert">{errors.category}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor={imgId}>Product Images</label>
          <input
            id={imgId}
            type="file"
            className="form-control"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            aria-invalid={!!errors.image}
            aria-describedby={errors.image ? `${imgId}-err` : `${imgId}-hint`}
            disabled={disabled}
            required
            multiple
          />
          {errors.image ? (
            <div id={`${imgId}-err`} className="field-error" role="alert">{errors.image}</div>
          ) : (
            <small id={`${imgId}-hint`} className="hint">JPG/PNG/WebP, up to {MAX_IMAGE_MB}MB.</small>
          )}
          {imagePreviews.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Selected product preview ${index + 1}`}
                  style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--color-border)' }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <input
            id="trending"
            name="trending"
            type="checkbox"
            checked={formData.trending}
            onChange={handleChange}
            style={{ width: 'auto', height: 'auto' }}
            disabled={disabled}
          />
          <label htmlFor="trending" style={{ marginBottom: 0 }}>Mark as Trending</label>
        </div>

        <div id="form-errors" aria-live="polite" style={{ minHeight: 1 }} />
        <button
          type="submit"
          className="btn-full"
          style={{ marginTop: 20 }}
          disabled={disabled}
          aria-busy={submitting || uploading}
        >
          {submitting || uploading ? 'Saving…' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;