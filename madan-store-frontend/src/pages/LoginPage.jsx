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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const next = { email: '', password: '' };
    if (!email.trim()) next.email = 'Email is required.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { data } = await API.post('/api/v1/auth/login', { email, password });
      login(data);
      toast.success('Logged in successfully 🎉');
      navigate('/');
    } catch (error) {
      // Surface a friendly inline error as well as toast
      const msg = error.response?.data?.message || 'Invalid email or password';
      setErrors((prev) => ({ ...prev, password: msg }));
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${base}/api/v1/auth/google`;
  };

  return (
    <main className="form-container">
      <div className="form-wrapper">
        <h1 id="login-title" className="page-title" style={{ paddingTop: 0, marginBottom: 16 }}>
          Login
        </h1>

        {/* Live region to announce form state/errors to assistive tech */}
        <div
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          {submitting ? 'Logging in…' : ''}
          {errors.email || errors.password ? 'There are validation errors on the form.' : ''}
        </div>

        <form
          onSubmit={handleSubmit}
          aria-labelledby="login-title"
          aria-describedby={errors.email || errors.password ? 'login-errors' : undefined}
          aria-busy={submitting ? 'true' : 'false'}
          noValidate
        >
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <small id="email-error" style={{ color: 'var(--color-error)' }}>
                {errors.email}
              </small>
            )}
          </div>

          {/* Password with show/hide toggle */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword ? 'true' : 'false'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  color: 'var(--color-secondary)',
                  fontWeight: 600
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <small id="password-error" style={{ color: 'var(--color-error)' }}>
                {errors.password}
              </small>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn-full" disabled={submitting} aria-disabled={submitting ? 'true' : 'false'}>
            {submitting ? 'Logging in…' : 'Login'}
          </button>
        </form>

        {/* OAuth */}
        <button
          onClick={handleGoogleLogin}
          className="btn-full"
          style={{ background: '#4285F4', marginTop: '12px' }}
          type="button"
          aria-label="Sign in with Google"
        >
          <span style={{ marginRight: '8px', fontWeight: 'bold' }} aria-hidden="true">G</span>
          Sign in with Google
        </button>

        {/* Inline errors summary (referenced by aria-describedby on the form) */}
        {(errors.email || errors.password) && (
          <div id="login-errors" className="sr-only">
            {errors.email ? 'Email field has an error. ' : ''}
            {errors.password ? 'Password field has an error. ' : ''}
          </div>
        )}

        <p className="auth-switch-text" style={{ marginTop: 16 }}>
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
