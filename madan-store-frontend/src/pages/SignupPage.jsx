// src/pages/SignupPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create Account | Madan Store';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // simple client-side checks
    if (trimmedPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      const { data } = await API.post('/api/v1/auth/register', {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });
      login(data);
      toast.success('Account created successfully 🎉');
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || 'An error occurred';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Safer base (matches LoginPage): fall back to localhost if env not set
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${base}/api/v1/auth/google`;
  };

  return (
    <div className="form-container">
      <div className="form-wrapper" role="form" aria-labelledby="signup-title">
        <h1 id="signup-title">Create Account</h1>

        {/* Inline status region for a11y */}
        <div
          aria-live="polite"
          className="sr-only"
        >
          {submitting ? 'Creating your account…' : errorMsg ? `Error: ${errorMsg}` : ''}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              aria-invalid={!!errorMsg && !name ? 'true' : 'false'}
            />
          </div>

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
              aria-invalid={!!errorMsg && !email ? 'true' : 'false'}
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
              autoComplete="new-password"
              minLength={6}
              aria-invalid={!!errorMsg && password.length < 6 ? 'true' : 'false'}
            />
            <small style={{ color: 'var(--color-text-secondary)' }}>
              Must be at least 6 characters.
            </small>
          </div>

          <button type="submit" className="btn-full" disabled={submitting}>
            {submitting ? 'Creating…' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="btn-full"
          style={{ background: '#4285F4', marginTop: '10px' }}
          type="button"
          disabled={submitting}
          aria-label="Sign up with Google"
        >
          <span style={{ marginRight: 8, fontWeight: 'bold' }}>G</span>
          Sign up with Google
        </button>

        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
