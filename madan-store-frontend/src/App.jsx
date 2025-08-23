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

// Core Pages
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProfileEditPage from './pages/ProfileEditPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import AdminAddProductPage from './pages/AdminAddProductPage.jsx';
import AdminEditProductPage from './pages/AdminEditProductPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import AdminEditCategoryPage from './pages/AdminEditCategoryPage.jsx';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage.jsx';
import AdminBannerPage from './pages/AdminBannerPage.jsx';
import AdminEditBannerPage from './pages/AdminEditBannerPage.jsx';
import AdminCustomersPage from './pages/AdminCustomersPage.jsx';
import AdminAboutPage from './pages/AdminAboutPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="dark" />
            <Routes>
              {/* Main Site Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="search/:keyword" element={<SearchPage />} />
                <Route path="category/:categoryName" element={<CategoryPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="" element={<ProtectedRoute />}>
                  <Route path="profile" element={<ProfilePage />} />  
                  <Route path="profile/edit" element={<ProfileEditPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                </Route>
              </Route>

            {/* Admin Panel Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route path="" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="order/:id" element={<AdminOrderDetailPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/add" element={<AdminAddProductPage />} />
                  <Route path="product/:id/edit" element={<AdminEditProductPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="category/:id/edit" element={<AdminEditCategoryPage />} />
                  <Route path="banners" element={<AdminBannerPage />} />
                  <Route path="banner/:id/edit" element={<AdminEditBannerPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="about" element={<AdminAboutPage />} />
                </Route>
              </Route>
            </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;