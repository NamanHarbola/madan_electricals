// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview, // Import new controller
    duplicateProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

// Review route
router.route('/:id/reviews').post(protect, createProductReview); // Add review route

// Admin-only routes
router.route('/').post(protect, admin, createProduct);
router.route('/:id').put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.route('/:id/duplicate').post(protect, admin, duplicateProduct);

module.exports = router;