// src/components/AddProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth.js'; // <-- CORRECTED IMPORT PATH
import { useNavigate } from 'react-router-dom';

const AddProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        mrp: '',
        category: '',
        description: '',
        stock: '',
        trending: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/v1/categories');
                if (data && data.length > 0) {
                    setCategories(data);
                    setFormData(prevState => ({ ...prevState, category: data[0].name }));
                }
            } catch (error) {
                toast.error('Could not fetch categories.');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error('Please select an image to upload.');
            return;
        }
        setUploading(true);

        const fileUploadData = new FormData();
        fileUploadData.append('image', imageFile);

        try {
            // Step 1: Upload the image and get the URL
            const uploadConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data: uploadData } = await axios.post('/api/v1/upload', fileUploadData, uploadConfig);

            // Step 2: Create the product data payload, including the new image URL
            const newProduct = {
                ...formData,
                images: [uploadData.imageUrl], // Ensure this is an array as per the model
            };

            // Step 3: Submit the product data as JSON
            const productConfig = {
                headers: {
                    'Content-Type': 'application/json', // Important: This must be application/json
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.post('/api/v1/products', newProduct, productConfig);
            
            toast.success(`Successfully added product: ${newProduct.name}`);
            navigate('/admin/products'); // Redirect to the product list on success
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                </div>

                <div className="form-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    <div className="form-group">
                        <label htmlFor="price">Selling Price</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="form-control" required step="0.01" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mrp">MRP</label>
                        <input type="number" id="mrp" name="mrp" value={formData.mrp} onChange={handleChange} className="form-control" required step="0.01" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-control" rows="4" required></textarea>
                </div>

                 <div className="form-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    <div className="form-group">
                        <label htmlFor="stock">Stock</label>
                        <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} className="form-control">
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Product Image</label>
                    <input type="file" id="image-file-input" onChange={handleFileChange} className="form-control" required />
                    {uploading && <p>Uploading image...</p>}
                </div>

                 <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                    <input type="checkbox" id="trending" name="trending" checked={formData.trending} onChange={handleChange} style={{ width: 'auto', height: 'auto' }} />
                    <label htmlFor="trending" style={{marginBottom: 0}}>Mark as Trending</label>
                </div>

                <button type="submit" className="btn-full" style={{marginTop: '20px'}} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;
