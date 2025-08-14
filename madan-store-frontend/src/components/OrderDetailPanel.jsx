// src/components/OrderDetailPanel.jsx
import React from 'react';
import formatCurrency from '../utils/formatCurrency.js';

const OrderDetailPanel = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className={`order-detail-panel ${order ? 'open' : ''}`}>
            <div className="panel-header">
                <h3>Order #{order._id.substring(18)}</h3>
                <button onClick={onClose} className="panel-close-btn">&times;</button>
            </div>
            <div className="panel-body">
                <div className="customer-details">
                    <img src={`https://ui-avatars.com/api/?name=${order.user.name.replace(/\s/g, '+')}`} alt={order.user.name} />
                    <div>
                        <strong>{order.user.name}</strong>
                        <p>{order.user.email}</p>
                    </div>
                </div>
                
                <h4>Order Items</h4>
                <div className="order-items-list">
                    {order.orderItems.map(item => (
                        <div key={item._id} className="order-item-card">
                            <img src={item.image} alt={item.name} />
                            <div>
                                <strong>{item.name}</strong>
                                <p>{item.qty} x {formatCurrency(item.price)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h4 style={{marginTop: '24px'}}>Total: {formatCurrency(order.totalPrice)}</h4>
            </div>
        </div>
    );
};

export default OrderDetailPanel;