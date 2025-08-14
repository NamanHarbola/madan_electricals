// src/pages/AdminEditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminEditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '', price: '', mrp: '', category: '', image: '',
        description: '', stock: '', rating: '', trending: false,
    });

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct(data);
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, product);
            alert('Product updated successfully!');
            navigate('/admin/products');
        } catch (error) {
            alert('Failed to update product');
        }
    };

    return (
        <div className="form-container" style={{paddingTop: '30px'}}>
            <div className="form-wrapper">
                <h1>Edit Product</h1>
                <form onSubmit={handleSubmit}>
                    {/* Form fields will be similar to AddProductForm */}
                    {/* Example for one field: */}
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" id="name" name="name" value={product.name} onChange={handleChange} className="form-control" required />
                    </div>
                    {/* ... Add all other form fields here (price, mrp, stock, etc.) ... */}
                    <button type="submit" className="btn-full">Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditProductPage;