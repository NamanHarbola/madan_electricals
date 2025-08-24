// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.js'; // <-- CORRECTED IMPORT PATH
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                '/api/v1/auth/login',
                { email, password }
            );
            login(data);
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };
    
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/v1/auth/google';
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-full">Login</button>
                </form>
                
                <button 
                    onClick={handleGoogleLogin} 
                    className="btn-full" 
                    style={{ background: '#4285F4', marginTop: '10px' }}
                >
                    Sign in with Google
                </button>

                <p className="auth-switch-text">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;