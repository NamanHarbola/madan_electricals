// src/api/index.js
import axios from 'axios';

// Create an axios instance that uses the VITE_API_URL from your .env file
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// This interceptor adds the auth token to every request automatically
API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    }
    return req;
});

export default API;