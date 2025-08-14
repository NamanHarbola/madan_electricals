// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import formatCurrency from '../utils/formatCurrency.js';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { userInfo } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Could not fetch orders.');
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchMyOrders();
        }
    }, [userInfo]);

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <h1 style={{ marginBottom: '30px' }}>My Profile</h1>
            <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                <div className="profile-details" style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: 'var(--radius-base)', boxShadow: 'var(--shadow-sm)'}}>
                    <h3 style={{marginTop: '0'}}>User Details</h3>
                    <p><strong>Name:</strong> {userInfo.name}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                </div>
                
                <div className="order-history">
                    <h3>My Orders</h3>
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <p>You have not placed any orders yet.</p>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;