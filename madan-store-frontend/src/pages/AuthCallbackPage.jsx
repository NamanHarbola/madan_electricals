// src/pages/AuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; // <-- CORRECTED IMPORT PATH
import LoadingSpinner from '../components/LoadingSpinner';

const AuthCallbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userParam = params.get('user');

        if (userParam) {
            try {
                const userData = JSON.parse(decodeURIComponent(userParam));
                login(userData);
                navigate('/'); // Redirect to home page after successful login
            } catch (error) {
                console.error("Failed to parse user data from URL", error);
                navigate('/login'); // Redirect to login on error
            }
        } else {
            // No user data found, redirect to login
            navigate('/login');
        }
    }, [location, navigate, login]);

    return <LoadingSpinner />;
};

export default AuthCallbackPage;