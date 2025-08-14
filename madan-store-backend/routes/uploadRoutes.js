const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Configure Cloudinary directly here.
// NOTE: Your .env file with Cloudinary credentials MUST be loaded in your main server.js file.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'madan-store',
        allowed_formats: ['jpeg', 'png', 'jpg'],
        // This transformation now includes a quality setting
        transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto:good' } // <-- THE FIX: Prioritizes quality
        ]
    },
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// This is the new, robust upload route
router.post('/', protect, admin, (req, res) => {
    const uploader = upload.single('image');

    uploader(req, res, function (err) {
        // Handle errors from Multer and Cloudinary
        if (err) {
            console.error("Upload Error:", err);
            let message = 'File upload failed. Please try again.';
            if (err.message && err.message.includes('Invalid API key')) {
                message = 'Cloudinary Error: Invalid API key or secret. Please check your .env file.';
            } else if (err.message) {
                message = err.message;
            }
            return res.status(500).json({ message });
        }

        // If middleware succeeds but there's no file, it's a client error.
        if (!req.file) {
            return res.status(400).json({ message: 'No file was uploaded.' });
        }

        // Success! Send back the secure URL.
        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: req.file.path
        });
    });
});

module.exports = router;
