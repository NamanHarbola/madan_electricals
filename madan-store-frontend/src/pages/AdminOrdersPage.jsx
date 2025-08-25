// src/pages/AdminOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api'; // 1. Import API
import formatCurrency from '../utils/formatCurrency.js';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    const fetchOrders = async () => {
        try {
            // 2. Use the central API instance (no config needed)
            const { data } = await API.get('/api/v1/orders');
            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (err) {
            toast.error('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchOrders();
        }
    }, [userInfo]);

    const statusChangeHandler = async (orderId, newStatus) => {
        try {
            // 3. Use API instance here too
            const { data: updatedOrder } = await API.put(
                `/api/v1/orders/${orderId}/status`,
                { status: newStatus }
            );
            setOrders(orders.map(o => (o._id === orderId ? updatedOrder : o)));
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update order status.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
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
                            <th>Paid</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>...{order._id.substring(18)}</td>
                                <td>{order.user ? order.user.name : 'N/A'}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>{formatCurrency(order.totalPrice)}</td>
                                <td>{order.isPaid ? 'Yes' : 'No'}</td>
                                <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => statusChangeHandler(order._id, e.target.value)}
                                        className="form-control"
                                        style={{padding: '5px', width: '120px'}}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <Link to={`/admin/order/${order._id}`} style={{marginLeft: '10px'}}>View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;