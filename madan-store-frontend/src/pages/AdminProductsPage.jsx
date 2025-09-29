// src/pages/AdminProductsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import formatCurrency from '../utils/formatCurrency.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const IMG_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
      <rect width="100%" height="100%" fill="#eee"/>
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#999">No Image</text>
    </svg>`
  );

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/api/v1/products');
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('API did not return an array for products:', data);
        setProducts([]);
      }
    } catch (err) {
      setError('Could not fetch products. Please try again later.');
      toast.error(err?.response?.data?.message || 'Could not fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const groupedAndFilteredProducts = useMemo(() => {
    const filtered = searchTerm
      ? products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : products;

    return filtered.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [products, searchTerm]);

  const deleteHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/api/v1/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error deleting product');
    }
  };

  const duplicateHandler = async (id) => {
    if (!window.confirm('Are you sure you want to duplicate this product?')) return;
    try {
      const { data: newProduct } = await API.post(`/api/v1/products/${id}/duplicate`);
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product duplicated successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error duplicating product');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="container" style={{ paddingTop: 50, textAlign: 'center', color: 'red' }}>
        {error}
      </div>
    );

  return (
    <div className="admin-page-container">
      <div
        className="admin-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
      >
        <h1 className="page-title" style={{ marginBottom: 0, paddingTop: 0 }}>
          Products
        </h1>
        <div className="admin-actions" style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search products..."
            className="form-control"
            style={{ width: '250px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/admin/products/add" className="btn-full" style={{ marginTop: 0, width: 'auto' }}>
            + Add Product
          </Link>
        </div>
      </div>

      <div className="admin-table-container" role="region" aria-label="Products table">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Stock</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          {Object.keys(groupedAndFilteredProducts).sort().map(category => (
            <tbody key={category}>
              <tr>
                <th colSpan="5" style={{ background: '#f0f0f0', textAlign: 'center', fontWeight: 'bold' }}>
                  {category}
                </th>
              </tr>
              {groupedAndFilteredProducts[category].map((product) => {
                const img =
                  (Array.isArray(product.images) && product.images[0]) ||
                  product.image ||
                  IMG_FALLBACK;
                const price = formatCurrency(product?.price || 0);
                const stock =
                  product?.stock > 0 ? (
                    product.stock
                  ) : (
                    <span style={{ color: 'var(--color-error)' }}>Out of Stock</span>
                  );

                return (
                  <tr key={product._id}>
                    <td data-label="Image">
                      <img
                        src={img}
                        alt={product?.name ? `${product.name} preview` : 'Product image'}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        loading="lazy"
                        decoding="async"
                      />
                    </td>
                    <td data-label="Name" style={{ fontWeight: 500 }}>
                      {product?.name || '—'}
                    </td>
                    <td data-label="Price">{price}</td>
                    <td data-label="Stock">{stock}</td>
                    <td data-label="Actions" style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/admin/product/${product._id}/edit`} aria-label={`Edit ${product?.name || 'product'}`}>
                        <button className="btn-icon" title="Edit">✏️</button>
                      </Link>
                      <button
                        onClick={() => duplicateHandler(product._id)}
                        className="btn-icon"
                        title="Duplicate"
                        aria-label={`Duplicate ${product?.name || 'product'}`}
                      >
                        📋
                      </button>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="btn-icon"
                        title="Delete"
                        aria-label={`Delete ${product?.name || 'product'}`}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;