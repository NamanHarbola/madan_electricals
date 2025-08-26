// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import formatCurrency from '../utils/formatCurrency.js';
import { FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign } from 'react-icons/fa';

// ✅ Auto-register everything Chart.js needs
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
    if (userInfo) fetchStats();
  }, [userInfo]);

  const months = (stats?.monthlySales || []).map(
    d => new Date(d._id.year, d._id.month - 1).toLocaleString('default', { month: 'short' })
  );
  const sales = (stats?.monthlySales || []).map(d => d.totalSales);

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Sales',
        data: sales,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54,162,235,.2)',
        tension: 0.35,
        pointRadius: 3,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false, // 🔑 let the container decide the height
    plugins: {
      legend: { display: true },
      tooltip: { intersect: false, mode: 'index' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: v => `₹${v}` } },
    },
  };

  const topLabels = (stats?.topProducts || []).map(p => p._id);
  const topValues = (stats?.topProducts || []).map(p => p.totalQuantity);

  const doughnutChartData = {
    labels: topLabels,
    datasets: [
      {
        label: 'Quantity Sold',
        data: topValues,
        backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF'],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false, // 🔑
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw}` } },
    },
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page-container">
      <h1 className="page-title" style={{ paddingTop: 0 }}>Dashboard</h1>

      {stats && (
        <>
          <div className="stats-grid">
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
      )}
    </div>
  );
};

export default AdminDashboardPage;
