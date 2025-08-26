// src/components/OrderDetailPanel.jsx
import React, { useEffect, useRef } from 'react';
import formatCurrency from '../utils/formatCurrency.js';

const OrderDetailPanel = ({ order, onClose }) => {
  const dialogRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    if (!order) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [order, onClose]);

  // Basic focus management: move focus to close button when opened
  useEffect(() => {
    if (order && dialogRef.current) {
      const btn = dialogRef.current.querySelector('[data-close]');
      btn?.focus();
    }
  }, [order]);

  if (!order) return null;

  const shortId = `...${order._id?.slice(-6)}`;
  const userName = order.user?.name || 'Customer';
  const userEmail = order.user?.email || '';
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=08747c&color=fff`;

  const subtotal = order.itemsPrice ?? (order.orderItems || []).reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = order.shippingPrice ?? 0;
  const tax = order.taxPrice ?? 0;
  const total = order.totalPrice ?? subtotal + shipping + tax;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      aria-hidden={false}
      role="presentation"
    >
      <div
        className="order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        {/* Header */}
        <div className="order-modal-header">
          <h2 id="order-modal-title">Order {shortId}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close order details"
            data-close
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="order-modal-body">
          {/* Customer */}
          <section
            aria-label="Customer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <img
              src={avatar}
              alt={userName}
              width={48}
              height={48}
              style={{ borderRadius: 999 }}
              loading="lazy"
              decoding="async"
            />
            <div>
              <strong>{userName}</strong>
              {userEmail && (
                <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                  {userEmail}
                </p>
              )}
            </div>
          </section>

          {/* Shipping */}
          {order.shippingAddress && (
            <section
              aria-label="Shipping address"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                padding: 12,
                marginBottom: 14,
              }}
            >
              <strong style={{ display: 'block', marginBottom: 6 }}>
                Shipping Address
              </strong>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                {order.shippingAddress.address}
                {order.shippingAddress.city ? `, ${order.shippingAddress.city}` : ''}
                {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}
              </p>
            </section>
          )}

          {/* Items */}
          <section aria-label="Order items">
            <strong>Items</strong>
            <div className="order-items-list">
              {(order.orderItems || []).map((item) => (
                <div key={item._id || item.product} className="order-item-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block' }}>{item.name}</strong>
                    <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                      {item.qty} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {formatCurrency(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Summary */}
          <section
            aria-label="Order summary"
            style={{
              marginTop: 16,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                rowGap: 8,
              }}
            >
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>

              <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
              <span>{formatCurrency(shipping)}</span>

              <span style={{ color: 'var(--color-text-secondary)' }}>Tax</span>
              <span>{formatCurrency(tax)}</span>

              <hr style={{ gridColumn: '1 / -1', border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />

              <strong>Total</strong>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPanel;
