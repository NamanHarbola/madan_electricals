// routes/aboutRoutes.js
const express = require('express');
const router = express.Router();
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getAboutContent).put(protect, admin, updateAboutContent);

module.exports = router;