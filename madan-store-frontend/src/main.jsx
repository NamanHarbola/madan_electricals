// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// This line is crucial. It imports all your styles and applies them globally.
import './styles/global.css';

// This code finds the 'root' div in your index.html and tells React to render your app inside it.
ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
);