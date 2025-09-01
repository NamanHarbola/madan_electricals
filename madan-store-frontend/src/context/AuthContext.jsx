// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

// Export the context so the hook can use it
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        try {
            const storedUserInfo = localStorage.getItem('userInfo');
            return storedUserInfo ? JSON.parse(storedUserInfo) : null;
        } catch (error) {
            return null;
        }
    });

    // Check localStorage when the app first loads
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    // Login function updates state and saves to localStorage
    const login = useCallback((userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUserInfo(userData);
    }, []);

    // Logout function clears state and localStorage
    const logout = useCallback(() => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        // This is a safe way to redirect after logout
        window.location.href = '/login';
    }, []);

    return (
        <AuthContext.Provider value={{ userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// We no longer export the hook from this file