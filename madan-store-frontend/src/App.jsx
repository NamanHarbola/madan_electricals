// src/App.jsx

import React, { useState, useEffect } from 'react';
// 1. Import routing components from react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 1. Import AuthProvider
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage'; // <-- Import Login Page
import SignupPage from './pages/SignupPage'; // <-- Import Signup Page
import SiteChrome from './components/SiteChrome';

function App() {
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(
    () => JSON.parse(localStorage.getItem('isAdminPanelOpen')) || false
  );

  useEffect(() => {
    localStorage.setItem('isAdminPanelOpen', JSON.stringify(showAdminPanel));
  }, [showAdminPanel]);

  const handleAdminLoginSuccess = () => {
    setShowAdminLoginModal(false);
    setShowAdminPanel(true);
  };

  return (
    // 2. Wrap your entire application in the Router component
    <AuthProvider>
    <Router>  
      <div className="running-banner">
        <div className="banner-content">
          <span className="banner-text">🎉 Grand Opening Sale - Up to 50% OFF on Electronics! Limited Time Only!</span>
          <span className="banner-text">🔧 Professional Hardware Tools - Buy 2 Get 1 FREE on Selected Items!</span>
          <span className="banner-text">🚚 FREE Shipping on Orders Over $99 - Shop Now and Save!</span>
        </div>
      </div>

      <Navbar onAdminClick={() => setShowAdminLoginModal(true)} />

      <main>
        {/* 3. Use the Routes component to define your pages */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} /> {/* <-- Add Login Route */}
          <Route path="/signup" element={<SignupPage />} /> {/* <-- Add Signup Route */}
        </Routes>
      </main>

      <SiteChrome
        showAdminLogin={showAdminLoginModal}
        setShowAdminLogin={setShowAdminLoginModal}
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />
    </Router>
    </AuthProvider>
  );
}

export default App;