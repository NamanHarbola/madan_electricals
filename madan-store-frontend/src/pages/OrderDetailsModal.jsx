// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import formatCurrency from '../utils/formatCurrency.js';
import { toast } from 'react-toastify';
import OrderDetailsModal from '../components/OrderDetailsModal.jsx';

const ProfilePage = () => {
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/api/v1/profile');
        setProfile(data || {});
      } catch {
        toast.error('Could not fetch profile.');
      }
    };

    const fetchMyOrders = async () => {
      try {
        const { data } = await API.get('/api/v1/orders/myorders');
        if (Array.isArray(data)) setOrders(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchProfile();
      fetchMyOrders();
    }
  }, [userInfo]);

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <h1 className="page-title">My Profile</h1>

      <div
        className="profile-layout"
        style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}
      >
        {/* Profile card */}
        <section
          className="profile-details"
          aria-labelledby="profile-details-title"
          style={{
            background: 'var(--color-surface)',
            padding: '24px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h3 id="profile-details-title" style={{ marginTop: 0, marginBottom: '16px', color: 'var(--color-primary)' }}>
            User Details
          </h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>

          <h4 style={{ marginTop: '24px', color: 'var(--color-primary)' }}>Shipping Address</h4>
          {profile.shippingAddress ? (
            <p style={{ lineHeight: 1.6 }}>
              {profile.shippingAddress.address}, {profile.shippingAddress.city} – {profile.shippingAddress.postalCode}
            </p>
          ) : (
            <p>No shipping address set.</p>
          )}

          <Link to="/profile/edit" className="btn-full" style={{ marginTop: '24px' }}>
            Edit Profile
          </Link>
        </section>

        {/* Orders */}
        <section className="order-history" aria-labelledby="order-history-title">
          <h3 id="order-history-title" style={{ marginTop: 0, marginBottom: '16px', color: 'var(--color-primary)' }}>
            My Orders
          </h3>

          {loading ? (
            <p>Loading orders…</p>
          ) : orders.length === 0 ? (
            <p>You have not placed any orders yet.</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="order-table-wrapper desktop-only">
                <div className="admin-table-container">
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Date</th>
                          <th scope="col">Total</th>
                          <th scope="col">Status</th>
                          <th scope="col" aria-label="Actions"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td>...{order._id.substring(18)}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{formatCurrency(order.totalPrice)}</td>
                            <td>
                              <span className={`status-badge ${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="btn-full"
                                style={{ marginTop: '0px', width: 'auto', padding: '6px 14px', fontSize: '.9rem' }}
                                type="button"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="order-cards mobile-only">
                {orders.map((order) => (
                  <article
                    key={order._id}
                    className="order-card"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '10px',
                      boxShadow: 'var(--shadow-sm)',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                    aria-labelledby={`order-${order._id}-title`}
                  >
                    <p id={`order-${order._id}-title`}><strong>Order ID:</strong> ...{order._id.substring(18)}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> {formatCurrency(order.totalPrice)}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                    </p>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn-full"
                      style={{ marginTop: '12px' }}
                      type="button"
                    >
                      View Details
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default ProfilePage;
