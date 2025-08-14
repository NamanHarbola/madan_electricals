// routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const { getActiveBanners, createBanner } = require('../controllers/bannerController');

router.get('/', getActiveBanners);
router.post('/', createBanner); // We'll protect this later

module.exports = router;