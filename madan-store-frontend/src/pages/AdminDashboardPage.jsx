// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import formatCurrency from '../utils/formatCurrency.js';
import { FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, icon, color }) => (
    <div className="stat-card" style={{ borderLeft: `5px solid ${color}`}}>
        <div className="stat-icon" style={{ color }}>{icon}</div>
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

    const lineChartData = {
        labels: stats?.monthlySales.map(d => new Date(d._id.year, d._id.month - 1).toLocaleString('default', { month: 'long' })) || [],
        datasets: [
            {
                label: 'Sales',
                data: stats?.monthlySales.map(d => d.totalSales) || [],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const doughnutChartData = {
        labels: stats?.topProducts.map(p => p._id) || [],
        datasets: [
            {
                label: 'Quantity Sold',
                data: stats?.topProducts.map(p => p.totalQuantity) || [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                ],
            },
        ],
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-page-container">
            <h1 className="page-title" style={{paddingTop: 0}}>Dashboard</h1>
            {stats && (
                <>
                    <div className="stats-grid">
                        <StatCard title="Total Sales" value={formatCurrency(stats.totalSales)} icon={<FaDollarSign />} color="#27ae60" />
                        <StatCard title="Total Orders" value={stats.orderCount} icon={<FaShoppingCart />} color="#2980b9" />
                        <StatCard title="Total Products" value={stats.productCount} icon={<FaBoxOpen />} color="#8e44ad" />
                        <StatCard title="Total Customers" value={stats.userCount} icon={<FaUsers />} color="#f39c12" />
                    </div>
                    <div className="charts-grid">
                        <div className="chart-container">
                            <h3>Sales Trend (Last 6 Months)</h3>
                            <Line data={lineChartData} />
                        </div>
                        <div className="chart-container">
                            <h3>Top 5 Products</h3>
                            <Doughnut data={doughnutChartData} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboardPage;