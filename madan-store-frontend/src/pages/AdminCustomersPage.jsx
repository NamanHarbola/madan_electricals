// src/pages/AdminCustomersPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api'; // <-- 1. Import the central API instance
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminCustomersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // 2. Use the API instance (no manual config needed)
                const { data } = await API.get('/api/v1/users');
                // 3. Add a check to ensure data is an array
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error("API did not return an array for users:", data);
                }
            } catch (error) {
                toast.error('Could not fetch users.');
            } finally {
                setLoading(false);
            }
        };
        
        if (userInfo) {
            fetchUsers();
        }
    }, [userInfo]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-page-container">
            <h1 className="page-title" style={{paddingTop: 0}}>Customers</h1>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCustomersPage;