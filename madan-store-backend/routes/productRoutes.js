// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, createProduct, getProductById } = require('../controllers/productController');

// When a GET request is made to the root of this route ('/'),
// it will call the getProducts function.
router.get('/', getProducts);
// ADD THIS NEW ROUTE
// This route will handle POST requests to /api/products
router.post('/', createProduct);
router.get('/:id', getProductById);

module.exports = router;