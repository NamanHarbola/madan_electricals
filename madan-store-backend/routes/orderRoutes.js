// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    getOrders,
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// === GROUPED & REORDERED ROUTES ===

// ADMIN: Get all orders | USER: Create an order
router.route('/')
    .get(protect, admin, getOrders)
    .post(protect, createOrder);

// USER: Get their own orders
router.route('/myorders')
    .get(protect, getMyOrders);

// ADMIN: Update an order's status (Specific route first)
router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

// USER/ADMIN: Get a single order by ID (General route last)
router.route('/:id')
    .get(protect, getOrderById);

module.exports = router;