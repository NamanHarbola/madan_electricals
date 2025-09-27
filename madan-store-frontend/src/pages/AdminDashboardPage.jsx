// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import formatCurrency from '../utils/formatCurrency.js';
import { FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign, FaEye } from 'react-icons/fa';

import 'chart.js/auto';
import { Line, Doughnut } from 'react-chartjs-2';

const StatCard = ({ title, value, icon, color }) => (
  <div className="stat-card" style={{ borderLeft: `5px solid ${color}` }}>
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <div className="stat-info">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [liveUsers, setLiveUsers] = useState('...');
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/api/v1/admin/stats');
        setStats(data);
      } catch (error) {
        toast.error('Could not fetch dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    const fetchLiveUsers = async () => {
      try {
        const { data } = await API.get('/api/v1/analytics/live-users');
        setLiveUsers(data.liveUsers);
      } catch (error) {
        console.error('Could not fetch live users', error);
        setLiveUsers('N/A');
      }
    };

    if (userInfo) {
      fetchStats();
      fetchLiveUsers();
      const interval = setInterval(fetchLiveUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [userInfo]);

  // Safely access chart data, providing empty defaults.
  const monthlySalesData = stats?.monthlySales || [];
  const topProductsData = stats?.topProducts || [];

  const months = monthlySalesData.map(
    d => new Date(d._id.year, d._id.month - 1).toLocaleString('default', { month: 'short' })
  );
  const sales = monthlySalesData.map(d => d.totalSales);

  const lineChartData = {
      labels: months,
      datasets: [
          {
              label: 'Sales',
              data: sales,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              fill: true,
              tension: 0.4,
          },
      ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const topLabels = topProductsData.map(p => p._id);
  const topValues = topProductsData.map(p => p.totalQuantity);

  const doughnutChartData = {
      labels: topLabels,
      datasets: [
          {
              label: 'Quantity Sold',
              data: topValues,
              backgroundColor: ['#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e74c3c'],
          },
      ],
  };
  
    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
  };


  if (loading) return <LoadingSpinner />;

  if (!stats) {
    return (
      <div className="admin-page-container">
        <h1 className="page-title" style={{ paddingTop: 0 }}>Dashboard</h1>
        <p>Could not load dashboard statistics. Please check the backend connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <h1 className="page-title" style={{ paddingTop: 0 }}>Dashboard</h1>

        <>
          <div className="stats-grid">
            <StatCard title="Live Viewers" value={liveUsers} icon={<FaEye />} color="#e67e22" />
            <StatCard title="Total Sales" value={formatCurrency(stats.totalSales)} icon={<FaDollarSign />} color="#27ae60" />
            <StatCard title="Total Orders" value={stats.orderCount} icon={<FaShoppingCart />} color="#2980b9" />
            <StatCard title="Total Products" value={stats.productCount} icon={<FaBoxOpen />} color="#8e44ad" />
            <StatCard title="Total Customers" value={stats.userCount} icon={<FaUsers />} color="#f39c12" />
          </div>

          <div className="charts-grid">
            <div className="chart-container" style={{ height: 340 }}>
              <h3>Sales Trend (Last 6 Months)</h3>
              <Line data={lineChartData} options={lineOptions} />
            </div>
            <div className="chart-container" style={{ height: 340 }}>
              <h3>Top 5 Products</h3>
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            </div>
          </div>
        </>
    </div>
  );
};

export default AdminDashboardPage;