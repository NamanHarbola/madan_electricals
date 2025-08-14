// src/pages/AdminOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formatCurrency from '../utils/formatCurrency.js';
import { useAuth } from '../context/AuthContext.jsx';
import OrderDetailPanel from '../components/OrderDetailPanel.jsx'; // 1. Import the panel component

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); // 2. State for the selected order
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (userInfo && userInfo.token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    const { data } = await axios.get('http://localhost:5000/api/orders', config);
                    setOrders(data);
                } catch (err) {
                    setError('Failed to fetch orders. You may not be authorized.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setError('No authorization token found. Please log in.');
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userInfo]);

    // 3. Function to fetch details for a single order and open the panel
    const viewOrderDetails = async (orderId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`, config);
            setSelectedOrder(data);
        } catch (error) {
            alert('Could not fetch order details.');
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <>
            <div className="admin-page-container">
                <h1 className="page-title">Orders</h1>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    // 4. Add onClick handler to the table row
                                    <tr key={order._id} onClick={() => viewOrderDetails(order._id)} style={{cursor: 'pointer'}}>
                                        <td>#{order._id.substring(18, 24)}</td>
                                        <td>{order.user ? order.user.name : 'N/A'}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{formatCurrency(order.totalPrice)}</td>
                                        <td>
                                            <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-icon btn-secondary">View</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 5. Render the detail panel, passing the selected order and a close function */}
            <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </>
    );
};

export default AdminOrdersPage;