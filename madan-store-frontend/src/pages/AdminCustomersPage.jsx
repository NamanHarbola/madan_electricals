// src/pages/AdminCustomersPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import API from '../api';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminCustomersPage = () => {
  const { userInfo } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/api/v1/users');
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('API did not return an array for users:', data);
          toast.error('Unexpected response while fetching users.');
        }
      } catch {
        toast.error('Could not fetch users.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.isAdmin) fetchUsers();
    else setLoading(false);
  }, [userInfo]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u._id?.toLowerCase().includes(term)
    );
  }, [q, users]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="page-title" style={{ paddingTop: 0, margin: 0 }}>Customers</h1>

        {/* Inline search (client-side) */}
        <div className="admin-actions" style={{ marginLeft: 'auto' }}>
          <label htmlFor="customer-search" className="visually-hidden">
            Search customers
          </label>
          <input
            id="customer-search"
            className="form-control"
            placeholder="Search by name, email, or ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 280 }}
            aria-label="Search customers by name, email, or ID"
          />
        </div>
      </div>

      <div
        className="admin-table-container"
        aria-live="polite"
        aria-busy={loading ? 'true' : 'false'}
      >
        <table className="admin-table" role="table" aria-label="Customers list">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col" style={{ width: 90 }}>Admin</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: 20, textAlign: 'center' }}>
                  {q ? 'No customers match your search.' : 'No customers found.'}
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user._id}>
                  {/* data-labels enable your CSS mobile “stacked” layout */}
                  <td data-label="ID">…{user._id?.slice(-6)}</td>
                  <td data-label="Name">{user.name}</td>
                  <td data-label="Email">
                    <a
                      href={`mailto:${user.email}`}
                      title={`Email ${user.name}`}
                      rel="noopener noreferrer"
                    >
                      {user.email}
                    </a>
                  </td>
                  <td data-label="Admin">{user.isAdmin ? 'Yes' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomersPage;
