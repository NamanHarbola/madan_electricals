// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Get the login function from context
    const navigate = useNavigate(); // Get the navigate function for redirection

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/login',
                { email, password }
            );
            
            // On successful API call, update the global state
            login(data);
            
            // Redirect the user to the homepage
            navigate('/');

        } catch (error) {
            alert(error.response.data.message || 'An error occurred');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', margin: '50px auto' }}>
            <div className="modal-content" style={{ padding: '24px' }}>
                <h1 style={{ textAlign: 'center' }}>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn--primary btn--full-width">Login</button>
                </form>
                <p className="auth-switch">
                    <span>Don't have an account? </span>
                    <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;