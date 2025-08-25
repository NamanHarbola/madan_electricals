// src/pages/AdminOrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api'; // <-- 1. Import the central API instance
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import formatCurrency from '../utils/formatCurrency';

const AdminOrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // 2. Use the API instance (no manual config needed)
                const { data } = await API.get(`/api/v1/orders/${id}`);
                setOrder(data);
            } catch (error) {
                toast.error('Could not fetch order details.');
            } finally {
                setLoading(false);
            }
        };
        if (userInfo) {
            fetchOrder();
        }
    }, [id, userInfo]);

    if (loading) return <LoadingSpinner />;
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="admin-page-container">
            <h1 className="page-title" style={{ paddingTop: 0 }}>Order #{order._id.substring(18)}</h1>
            <div className="order-details-layout">
                <div className="order-items-summary">
                    <h3>Order Items</h3>
                    {order.orderItems.map(item => (
                        <div key={item.product} className="order-item-card">
                            <img src={item.image} alt={item.name} />
                            <div>
                                <strong>{item.name}</strong>
                                <p>{item.qty} x {formatCurrency(item.price)} = {formatCurrency(item.qty * item.price)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-shipping-summary">
                    <h3>Shipping Address</h3>
                    <p><strong>Name:</strong> {order.shippingInfo.name}</p>
                    <p><strong>Address:</strong> {order.shippingInfo.address}</p>
                    {order.shippingInfo.landmark && <p><strong>Landmark:</strong> {order.shippingInfo.landmark}</p>}
                    <p><strong>City:</strong> {order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
                    <p><strong>Country:</strong> {order.shippingInfo.country}</p>
                    <hr />
                    <h3>Order Summary</h3>
                    <p><strong>Total Price:</strong> {formatCurrency(order.totalPrice)}</p>
                    <p><strong>Status:</strong> <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></p>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage;