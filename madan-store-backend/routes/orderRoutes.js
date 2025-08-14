// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    getOrders,
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus // Import the new controller
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// USER ROUTES
router.route('/myorders').get(protect, getMyOrders);
router.route('/').post(protect, createOrder);
router.route('/:id').get(protect, getOrderById);

// ADMIN ROUTES
router.route('/').get(protect, admin, getOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus); // <-- ADD THIS NEW ROUTE

module.exports = router;