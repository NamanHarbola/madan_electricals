import React from 'react';
import formatCurrency from '../utils/formatCurrency';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Order Details</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-body">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total:</strong> {formatCurrency(order.totalPrice)}</p>
          <p><strong>Status:</strong> <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></p>

          <h3 style={{ marginTop: '20px' }}>Items</h3>
          {order.orderItems.map((item) => (
            <div key={item._id} className="order-item-card">
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <p>{item.qty} x {formatCurrency(item.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;