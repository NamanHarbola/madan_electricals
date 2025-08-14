// src/pages/AdminAddProductPage.jsx
import React from 'react';
import AddProductForm from '../components/AddProductForm.jsx';

const AdminAddProductPage = () => {
    return (
        <div className="admin-page-container">
            <h1 className="page-title">Add a New Product</h1>
            <AddProductForm />
        </div>
    );
};

export default AdminAddProductPage;