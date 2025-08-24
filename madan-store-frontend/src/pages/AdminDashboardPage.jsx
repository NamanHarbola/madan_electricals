// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.js'; // <-- CORRECTED IMPORT PATH
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import formatCurrency from '../utils/formatCurrency';

const StatCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <h4>{title}</h4>
            <p>{value}</p>
        </div>
    </div>
);

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/v1/admin/stats', config);
                setStats(data);
            } catch (error) {
                toast.error('Could not fetch dashboard stats.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [userInfo.token]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-page-container">
            <h1 className="page-title" style={{paddingTop: 0}}>Dashboard</h1>
            {stats && (
                <div className="stats-grid">
                    <StatCard title="Total Sales" value={formatCurrency(stats.totalSales)} icon="💰" />
                    <StatCard title="Total Orders" value={stats.orderCount} icon="📦" />
                    <StatCard title="Total Products" value={stats.productCount} icon="🔧" />
                    <StatCard title="Total Customers" value={stats.userCount} icon="👥" />
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;