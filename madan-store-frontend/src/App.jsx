// src/App.jsx
import React, { Suspense, lazy } from 'react';
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
import LoadingSpinner from './components/LoadingSpinner.jsx';

// LAZY-LOADED PAGES
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage.jsx'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage.jsx'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage.jsx'));
const AdminAddProductPage = lazy(() => import('./pages/AdminAddProductPage.jsx'));
const AdminEditProductPage = lazy(() => import('./pages/AdminEditProductPage.jsx'));
const AdminCategoriesPage = lazy(() => import('./pages/AdminCategoriesPage.jsx'));
const AdminEditCategoryPage = lazy(() => import('./pages/AdminEditCategoryPage.jsx'));
const AdminOrderDetailPage = lazy(() => import('./pages/AdminOrderDetailPage.jsx'));
const AdminBannerPage = lazy(() => import('./pages/AdminBannerPage.jsx'));
const AdminEditBannerPage = lazy(() => import('./pages/AdminEditBannerPage.jsx'));
const AdminCustomersPage = lazy(() => import('./pages/AdminCustomersPage.jsx'));
const AdminAboutPage = lazy(() => import('./pages/AdminAboutPage.jsx'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="dark" />
            <Suspense fallback={<LoadingSpinner />}>
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
                  <Route path="auth/callback" element={<AuthCallbackPage />} />
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
            </Suspense>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;