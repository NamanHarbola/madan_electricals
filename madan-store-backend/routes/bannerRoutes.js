// routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const { getActiveBanners, createBanner, deleteBanner, getBannerById, updateBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route
router.get('/', getActiveBanners);

// Admin routes
router.post('/', protect, admin, createBanner);
router.route('/:id')
    .get(protect, admin, getBannerById)
    .put(protect, admin, updateBanner)
    .delete(protect, admin, deleteBanner);

module.exports = router;