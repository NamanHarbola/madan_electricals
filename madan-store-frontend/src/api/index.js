// src/api/index.js
import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    }
    return req;
});

// Product API calls
export const fetchProducts = () => API.get('/products');
export const createProduct = (newProduct) => API.post('/products', newProduct);

// Auth API calls
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// ... and so on for orders, banners, etc.