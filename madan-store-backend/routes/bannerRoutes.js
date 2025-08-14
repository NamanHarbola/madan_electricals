// routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const { getActiveBanners, createBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to get banners for display
router.get('/', getActiveBanners);

// Admin routes to manage banners
router.post('/', protect, admin, createBanner);
router.delete('/:id', protect, admin, deleteBanner);

module.exports = router;