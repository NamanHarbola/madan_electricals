// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/orders', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;