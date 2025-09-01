// src/components/OrderDetailsModal.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import formatCurrency from '../utils/formatCurrency.js';

const OrderDetailsModal = ({ order, onClose }) => {
  const backdropRef = useRef(null);
  const dialogRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Close helpers
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const onBackdropClick = (e) => {
    if (e.target === backdropRef.current) handleClose();
  };

  // Trap focus inside modal
  useEffect(() => {
    if (!order) return;

    // remember last focused element to restore after close
    lastFocusedRef.current = document.activeElement;

    // lock background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // move focus to dialog (or first focusable)
    const dialogEl = dialogRef.current;
    const focusables = dialogEl.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    (first || dialogEl).focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
      }
      if (e.key === 'Tab') {
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
      // restore focus
      if (lastFocusedRef.current && lastFocusedRef.current.focus) {
        lastFocusedRef.current.focus();
      }
    };
  }, [order, handleClose]);

  if (!order) return null;

  // --- CALCULATE PRICE BREAKDOWN ---
  const subtotal = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = order.shippingPrice || 0;
  // Infer tax/convenience fee by subtracting known values from the total
  const taxOrFee = Math.max(0, order.totalPrice - subtotal - shippingFee);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onBackdropClick}
      ref={backdropRef}
      aria-hidden={false}
    >
      <div
        className="order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        aria-describedby="order-modal-desc"
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()} // prevent backdrop close when dragging inside
      >
        <div className="order-modal-header">
          <h2 id="order-modal-title">Order Details</h2>
          <button
            onClick={handleClose}
            className="modal-close-btn"
            aria-label="Close order details"
          >
            &times;
          </button>
        </div>

        <div className="order-modal-body" id="order-modal-desc">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`status-badge ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </p>

          <h3 style={{ marginTop: 20 }}>Items</h3>
          <div className="order-items-list">
            {order.orderItems.map((item) => (
              <div key={item._id} className="order-item-card">
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.qty} × {formatCurrency(item.price)}
                  </p>
                </div>
                <div style={{marginLeft: 'auto', fontWeight: 'bold'}}>
                  {formatCurrency(item.qty * item.price)}
                </div>
              </div>
            ))}
          </div>

          {/* --- NEW PRICE BREAKDOWN RECEIPT --- */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <h3 style={{ marginTop: 0 }}>Price Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
              </div>
              {shippingFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                      <span>{order.paymentMethod === 'COD' ? 'COD Fee' : 'Shipping'}</span>
                      <span>{formatCurrency(shippingFee)}</span>
                  </div>
              )}
              {taxOrFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                      <span>Convenience Fee</span>
                      <span>{formatCurrency(taxOrFee)}</span>
                  </div>
              )}
              <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontWeight: 'bold', 
                  fontSize: '1.1rem', 
                  borderTop: '1px solid var(--color-border)', 
                  paddingTop: '12px', 
                  marginTop: '8px' 
              }}>
                  <span>Total Paid</span>
                  <span>{formatCurrency(order.totalPrice)}</span>
              </div>
          </div>


          {/* Close button at bottom for mobile reachability */}
          <button
            className="btn-full"
            style={{ marginTop: 24 }}
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
