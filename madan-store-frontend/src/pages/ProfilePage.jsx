// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import formatCurrency from '../utils/formatCurrency.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import OrderDetailsModal from '../components/OrderDetailsModal.jsx';

const ProfilePage = () => {
  const { userInfo } = useAuth();

  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/api/v1/profile');
        setProfile(data);
      } catch (error) {
        toast.error('Could not fetch profile.');
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchMyOrders = async () => {
      try {
        const { data } = await API.get('/api/v1/orders/myorders');
        if (Array.isArray(data)) setOrders(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not fetch orders.');
      } finally {
        setLoadingOrders(false);
      }
    };

    if (userInfo) {
      fetchProfile();
      fetchMyOrders();
    }
  }, [userInfo]);

  // Combined loading state
  const loading = loadingProfile || loadingOrders;

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <h1 className="page-title">My Profile</h1>

      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', padding: '24px 0' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className="profile-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '32px',
          }}
        >
          {/* Profile card */}
          <section
            className="profile-details"
            aria-label="User details"
            style={{
              background: 'var(--color-surface)',
              padding: '24px',
              borderRadius: 'var(--r-md, 10px)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
              height: 'fit-content',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <img
                src={
                  profile?.name
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=08747c&color=fff`
                    : `https://ui-avatars.com/api/?name=User&background=08747c&color=fff`
                }
                alt={profile?.name || 'User avatar'}
                width={48}
                height={48}
                style={{ borderRadius: 999, border: '1px solid var(--color-border)' }}
              />
              <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>User Details</h3>
            </div>

            <p style={{ margin: '8px 0' }}>
              <strong>Name:</strong> {profile?.name || '—'}
            </p>
            <p style={{ margin: '8px 0' }}>
              <strong>Email:</strong> {profile?.email || '—'}
            </p>

            <h4 style={{ marginTop: '24px', color: 'var(--color-primary)' }}>Shipping Address</h4>
            {profile?.shippingAddress ? (
              <p style={{ lineHeight: 1.6, marginTop: 8 }}>
                {profile.shippingAddress.address}
                {profile.shippingAddress.city ? `, ${profile.shippingAddress.city}` : ''}
                {profile.shippingAddress.postalCode ? ` — ${profile.shippingAddress.postalCode}` : ''}
                {profile.shippingAddress.country ? `, ${profile.shippingAddress.country}` : ''}
              </p>
            ) : (
              <p style={{ marginTop: 8 }}>No shipping address set.</p>
            )}

            <Link to="/profile/edit" className="btn-full" style={{ marginTop: '24px' }}>
              Edit Profile
            </Link>
          </section>

          {/* Orders */}
          <section className="order-history" aria-label="Order history">
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--color-primary)' }}>My Orders</h3>

            {orders.length === 0 ? (
              <div
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--r-md)',
                  padding: 16,
                }}
              >
                <p style={{ margin: 0 }}>You have not placed any orders yet.</p>
                <Link to="/" className="btn-full" style={{ marginTop: 12, width: 'auto' }}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="order-table-wrapper desktop-only">
                  <div className="admin-table-container">
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th></th>
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
                                  style={{
                                    marginTop: 0,
                                    width: 'auto',
                                    padding: '6px 14px',
                                    fontSize: '.9rem',
                                  }}
                                  aria-label={`View order ${order._id}`}
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
                        borderRadius: 'var(--r-md, 10px)',
                        boxShadow: 'var(--shadow-sm)',
                        padding: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <p style={{ margin: '4px 0' }}>
                        <strong>Order ID:</strong> ...{order._id.substring(18)}
                      </p>
                      <p style={{ margin: '4px 0' }}>
                        <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p style={{ margin: '4px 0' }}>
                        <strong>Total:</strong> {formatCurrency(order.totalPrice)}
                      </p>
                      <p style={{ margin: '4px 0' }}>
                        <strong>Status:</strong>{' '}
                        <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                      </p>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-full"
                        style={{ marginTop: '12px' }}
                        aria-label={`View order ${order._id}`}
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
      )}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default ProfilePage;
