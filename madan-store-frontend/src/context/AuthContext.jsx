// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    // Check localStorage when the app first loads
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    // Login function updates state and saves to localStorage
    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUserInfo(userData);
    };

    // Logout function clears state and localStorage
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        // This is a safe way to redirect after logout
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily use the auth context in other components
export const useAuth = () => {
    return useContext(AuthContext);
};