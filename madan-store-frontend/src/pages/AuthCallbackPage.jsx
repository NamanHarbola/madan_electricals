// src/pages/AuthCallbackPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

function parseUserParam(raw) {
  if (!raw) return null;
  try {
    // Most backends will URL-encode JSON
    const decoded = decodeURIComponent(raw);

    // Try JSON first
    try {
      return JSON.parse(decoded);
    } catch {
      // Try base64 / base64url as a fallback
      const b64 = decoded.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(b64);
      return JSON.parse(json);
    }
  } catch {
    return null;
  }
}

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [message, setMessage] = useState('Completing sign-in…');

  useEffect(() => {
    // Support both search (?user=) and hash (#user=) styles
    const rawQuery = location.search || location.hash?.replace(/^#/, '?') || '';
    const params = new URLSearchParams(rawQuery);

    const errorParam = params.get('error') || params.get('message');
    if (errorParam) {
      const msg = decodeURIComponent(errorParam);
      toast.error(msg || 'Authentication failed.');
      setMessage('Authentication failed. Redirecting…');
      navigate('/login', { replace: true });
      return;
    }

    const userParam = params.get('user');
    const userData = parseUserParam(userParam);

    if (userData && typeof userData === 'object') {
      try {
        // Optional: quick shape check for expected fields
        // (adjust to match your backend)
        // e.g., userData = { name, email, token, isAdmin, ... }
        if (!userData.token) {
          throw new Error('Missing token in auth response.');
        }

        login(userData);

        // Use replace so the callback page isn’t in history
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Auth callback handling failed:', err);
        toast.error('Invalid auth response. Please try again.');
        setMessage('Invalid auth response. Redirecting…');
        navigate('/login', { replace: true });
      }
    } else {
      // No data present — bounce to login
      setMessage('No sign-in data found. Redirecting…');
      navigate('/login', { replace: true });
    }
  }, [location, navigate, login]);

  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <LoadingSpinner />
      <p style={{ textAlign: 'center', marginTop: 8 }}>{message}</p>
    </div>
  );
};

export default AuthCallbackPage;
