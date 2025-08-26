// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await API.post('/api/v1/auth/login', { email, password });
      login(data);
      toast.success('Logged in successfully 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Use environment variable for backend base URL
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${base}/api/v1/auth/google`;
  };

  return (
    <div className="form-container">
      <div className="form-wrapper" role="form" aria-labelledby="login-title">
        <h1 id="login-title">Login</h1>

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
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-full" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="btn-full"
          style={{ background: '#4285F4', marginTop: '12px' }}
          type="button"
        >
          <span style={{ marginRight: '8px', fontWeight: 'bold' }}>G</span>
          Sign in with Google
        </button>

        <p className="auth-switch-text">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
