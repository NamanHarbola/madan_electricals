// madan-store-backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { getLiveUsers } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/live-users', protect, admin, getLiveUsers);

module.exports = router;