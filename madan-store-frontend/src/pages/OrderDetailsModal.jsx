// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import formatCurrency from '../utils/formatCurrency.js';
import { toast } from 'react-toastify';
import OrderDetailsModal from '../components/OrderDetailsModal'; // Import the modal component

const ProfilePage = () => {
    const { userInfo } = useAuth();
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // State for the selected order

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('/api/v1/profile', config);
                setProfile(data);
            } catch (error) {
                toast.error('Could not fetch profile.');
            }
        };

        const fetchMyOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/v1/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Could not fetch orders.');
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchProfile();
            fetchMyOrders();
        }
    }, [userInfo]);

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <h1 style={{ marginBottom: '30px' }}>My Profile</h1>
            <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                <div className="profile-details" style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: 'var(--radius-base)', boxShadow: 'var(--shadow-sm)'}}>
                    <h3 style={{marginTop: '0'}}>User Details</h3>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>

                    <h4 style={{marginTop: '20px'}}>Shipping Address</h4>
                    {profile.shippingAddress ? (
                        <p>{profile.shippingAddress.address}, {profile.shippingAddress.city}, {profile.shippingAddress.postalCode}</p>
                    ) : (
                        <p>No shipping address set.</p>
                   )}
                    <Link to="/profile/edit" className="btn-full" style={{marginTop: '20px'}}>Edit Profile</Link>
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
                                        <th>Actions</th>
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
                                                <button onClick={() => setSelectedOrder(order)} className="btn-full" style={{marginTop: 0, width: 'auto', padding: '5px 10px'}}>
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        </div>
    );
};

export default ProfilePage;