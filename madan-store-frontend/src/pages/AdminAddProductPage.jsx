// src/pages/AdminAddProductPage.jsx
import React from 'react';
import AddProductForm from '../components/AddProductForm.jsx';

const AdminAddProductPage = () => {
  const headingId = 'add-product-heading';

  return (
    <div className="admin-page-container">
      {/* Optional breadcrumb (uses your existing .breadcrumbs styles) */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/admin/dashboard">Dashboard</a>
        <span className="sep">/</span>
        <a href="/admin/products">Products</a>
        <span className="sep">/</span>
        <span aria-current="page">Add</span>
      </nav>

      <h1 id={headingId} className="page-title" style={{ paddingTop: 0 }}>
        Add a New Product
      </h1>

      {/* Landmark region improves screen-reader navigation */}
      <section
        role="region"
        aria-labelledby={headingId}
        className="admin-content"
        style={{ padding: 0 }}
      >
        <AddProductForm />
      </section>
    </div>
  );
};

export default AdminAddProductPage;
