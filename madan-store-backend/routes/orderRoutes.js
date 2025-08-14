// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { getOrders, createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/orders - Get all orders (protected)
router.get('/', protect, getOrders);

// POST /api/orders - Create a new order (protected)
router.post('/', protect, createOrder);

module.exports = router;