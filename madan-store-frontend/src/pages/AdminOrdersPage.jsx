// src/pages/AdminOrdersPage.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
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
      const { data } = await API.get('/api/v1/orders');
      if (Array.isArray(data)) setOrders(data);
      else toast.error('Unexpected response for orders.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.isAdmin) fetchOrders();
  }, [userInfo]);

  const statusChangeHandler = async (orderId, newStatus) => {
    // optimistic update
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      const { data: updatedOrder } = await API.put(`/api/v1/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order status.');
      // revert on failure
      await fetchOrders();
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!orders.length) {
    return (
      <div className="admin-page-container">
        <h1 className="page-title">Orders</h1>
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <h1 className="page-title">Orders</h1>

      <div className="admin-table-container" role="region" aria-label="Orders table">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Customer</th>
              <th scope="col">Date</th>
              <th scope="col">Total</th>
              <th scope="col">Paid</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const shortId = order?._id ? `...${order._id.slice(-6)}` : '—';
              const customer = order?.user?.name || 'N/A';
              const dateStr = order?.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : '—';
              const total = formatCurrency(order?.totalPrice || 0);
              const paid = order?.isPaid ? 'Yes' : 'No';
              const status = order?.status || 'Pending';

              return (
                <tr key={order?._id || Math.random()}>
                  <td data-label="Order ID">{shortId}</td>
                  <td data-label="Customer">{customer}</td>
                  <td data-label="Date">{dateStr}</td>
                  <td data-label="Total">{total}</td>
                  <td data-label="Paid">{paid}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${String(status).toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                  <td data-label="Actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <label htmlFor={`status-${order._id}`} className="sr-only">
                      Change status for order {shortId}
                    </label>
                    <select
                      id={`status-${order._id}`}
                      value={status}
                      onChange={(e) => statusChangeHandler(order._id, e.target.value)}
                      className="form-control"
                      style={{ padding: '5px', width: 140 }}
                      aria-label={`Change status for order ${shortId}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <Link to={`/admin/order/${order._id}`} className="nav-link" style={{ padding: '6px 10px' }}>
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
