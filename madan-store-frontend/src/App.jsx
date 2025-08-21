// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts & Guards
import MainLayout from './pages/MainLayout.jsx';
import AdminLayout from './pages/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx'; // <-- Import new page
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import AdminAddProductPage from './pages/AdminAddProductPage.jsx';
import AdminEditProductPage from './pages/AdminEditProductPage.jsx';
import AdminBannerPage from './pages/AdminBannerPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'; // Import new page
import AdminCustomersPage from './pages/AdminCustomersPage.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="dark" />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="search/:keyword" element={<SearchPage />} />
              <Route path="category/:categoryName" element={<CategoryPage />} /> {/* <-- Add new route */}
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="" element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route path="" element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboardPage />} /> {/* Add new route */}
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/add" element={<AdminAddProductPage />} />
                <Route path="product/:id/edit" element={<AdminEditProductPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="banners" element={<AdminBannerPage />} />
                <Route path="customers" element={<AdminCustomersPage />} /> {/* Add new route */}
              </Route>
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
