// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary'); // We will create this next
const { uploadImage } = require('../controllers/uploadController');

// This route handles the image upload.
// 'upload.single('image')' is the middleware that catches the file named 'image'
// and sends it to Cloudinary before the uploadImage controller runs.
router.post('/', upload.single('image'), uploadImage);

module.exports = router;