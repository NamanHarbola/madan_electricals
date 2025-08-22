// server.js
const express = require('express');
const cors = require('cors');
const dotenv =require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend's address
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(express.json()); // <-- to accept JSON data in the body

// API Version 1 Routes
const v1Routes = express.Router();
v1Routes.use('/products', require('./routes/productRoutes'));
v1Routes.use('/users', require('./routes/userRoutes'));
v1Routes.use('/auth', require('./routes/authRoutes'));
v1Routes.use('/upload', require('./routes/uploadRoutes'));
v1Routes.use('/orders', require('./routes/orderRoutes'));
v1Routes.use('/banners', require('./routes/bannerRoutes'));
v1Routes.use('/categories', require('./routes/categoryRoutes'));
v1Routes.use('/payment', require('./routes/paymentRoutes'));
v1Routes.use('/profile', require('./routes/profileRoutes'));
v1Routes.use('/admin', require('./routes/adminRoutes'));

app.use('/api/v1', v1Routes);

// Use the error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});