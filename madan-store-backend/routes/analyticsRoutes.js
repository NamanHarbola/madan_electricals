// madan-store-backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { getLiveUsers, getViewStats } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/live-users', protect, admin, getLiveUsers);

// --- NEW: Route for fetching historical view data ---
router.get('/view-stats', protect, admin, getViewStats);

module.exports = router;