// src/components/AddProductForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = () => {
  // State for the form fields
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mrp: '',
    category: 'electronics',
    description: '',
    stock: '',
    rating: '',
    trending: false,
  });

  // State to hold the selected image file
  const [imageFile, setImageFile] = useState(null);
  // State to track upload progress for better UX
  const [uploading, setUploading] = useState(false);

  // A single handler to update the state for any form field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handler for the file input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Get the first file selected
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image to upload.');
      return;
    }
    setUploading(true);

    const fileUploadData = new FormData();
    fileUploadData.append('image', imageFile);

    try {
      // First, upload the image to the /api/upload endpoint
      const { data: uploadData } = await axios.post(
        'http://localhost:5000/api/upload',
        fileUploadData
      );

      // After getting the imageUrl, create the new product
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp),
        stock: parseInt(formData.stock, 10),
        rating: parseFloat(formData.rating),
        image: uploadData.imageUrl, // Use the URL from Cloudinary
      };

      // Second, send the complete product data to the /api/products endpoint
      const { data: createdProduct } = await axios.post(
        'http://localhost:5000/api/products',
        newProduct
      );

      alert(`Successfully added product: ${createdProduct.name}`);
      // Reset form and file input after successful submission
      setFormData({ name: '', price: '', mrp: '', category: 'electronics', description: '', stock: '', rating: '', trending: false });
      setImageFile(null);
      document.getElementById('image-file-input').value = null;

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Check the console for the reason.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="product-form">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Selling Price</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="form-control" required step="0.01" />
          </div>
          <div className="form-group">
            <label htmlFor="mrp">MRP (Maximum Retail Price)</label>
            <input type="number" id="mrp" name="mrp" value={formData.mrp} onChange={handleChange} className="form-control" required step="0.01" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image-file-input">Product Image</label>
          <input type="file" id="image-file-input" name="image" onChange={handleFileChange} className="form-control" required />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="form-control">
            <option value="electronics">Electronics</option>
            <option value="hardware">Hardware</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-control" rows="4" required></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating (0-5)</label>
            <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} step="0.1" min="0" max="5" className="form-control" required />
          </div>
        </div>
        
        <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="trending" name="trending" checked={formData.trending} onChange={handleChange} style={{ width: 'auto', marginRight: '8px' }} />
          <label htmlFor="trending">Trending Product</label>
        </div>

        <button type="submit" className="btn btn--primary" disabled={uploading}>
          {uploading ? 'Uploading Image...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;