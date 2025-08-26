// src/pages/AdminOrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import formatCurrency from '../utils/formatCurrency.js';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/api/v1/orders/${id}`);
        setOrder(data);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Could not fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) fetchOrder();
  }, [id, userInfo]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <p className="container" style={{ paddingTop: '100px' }}>Order not found.</p>;

  const {
    _id,
    orderItems = [],
    shippingInfo = {},
    totalPrice = 0,
    status = 'Pending',
    createdAt,
    user,
  } = order;

  const shortId = _id ? _id.slice(-6) : '';
  const dateStr = createdAt ? new Date(createdAt).toLocaleString() : '—';

  return (
    <div className="admin-page-container">
      <header className="admin-header" style={{ marginBottom: 12 }}>
        <h1 className="page-title" style={{ paddingTop: 0, marginBottom: 0 }}>
          Order {shortId && (<><span style={{ opacity: .6 }}>#</span>{shortId}</>)}
        </h1>
        <p style={{ margin: '6px 0 0', color: 'var(--color-text-secondary)' }}>
          Placed: {dateStr}{user?.name ? ` • Customer: ${user.name}` : ''}
        </p>
      </header>

      <div
        className="order-details-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 20,
        }}
      >
        {/* Items */}
        <section
          aria-labelledby="order-items-heading"
          className="order-items-summary"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--r-md)',
            boxShadow: 'var(--shadow-sm)',
            padding: 'var(--s-24)',
          }}
        >
          <h2 id="order-items-heading" style={{ marginTop: 0 }}>Order Items</h2>

          {orderItems.length === 0 ? (
            <p>No items in this order.</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {orderItems.map((item, idx) => (
                <article
                  key={item._id || item.product || idx}
                  className="order-item-card"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)' }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    width={64}
                    height={64}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div>
                    <strong style={{ display: 'block' }}>{item.name}</strong>
                    <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                      {item.qty} × {formatCurrency(item.price)} = <strong>{formatCurrency((item.qty || 0) * (item.price || 0))}</strong>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Shipping + Summary */}
        <aside
          aria-labelledby="shipping-summary-heading"
          className="order-shipping-summary"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--r-md)',
            boxShadow: 'var(--shadow-sm)',
            padding: 'var(--s-24)',
          }}
        >
          <h2 id="shipping-summary-heading" style={{ marginTop: 0 }}>Shipping & Summary</h2>

          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 8px' }}>Shipping Address</h3>
            <p style={{ margin: '0 0 4px' }}>
              <strong>Name:</strong> {shippingInfo?.name || '—'}
            </p>
            <p style={{ margin: '0 0 4px' }}>
              <strong>Address:</strong> {shippingInfo?.address || '—'}
            </p>
            {shippingInfo?.landmark && (
              <p style={{ margin: '0 0 4px' }}>
                <strong>Landmark:</strong> {shippingInfo.landmark}
              </p>
            )}
            <p style={{ margin: '0 0 4px' }}>
              <strong>City/Pin:</strong> {shippingInfo?.city || '—'}{shippingInfo?.postalCode ? `, ${shippingInfo.postalCode}` : ''}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Country:</strong> {shippingInfo?.country || '—'}
            </p>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />

          <div>
            <h3 style={{ margin: '0 0 8px' }}>Order Summary</h3>
            <p style={{ margin: '0 0 6px' }}>
              <strong>Total Price:</strong> {formatCurrency(totalPrice)}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Status:</strong>{' '}
              <span className={`status-badge ${String(status).toLowerCase()}`}>
                {status}
              </span>
            </p>
          </div>
        </aside>
      </div>

      {/* Responsive enhancement: two-column on large screens */}
      <style>{`
        @media (min-width: 992px) {
          .order-details-layout {
            grid-template-columns: 2fr 1fr;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrderDetailPage;
