// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');
const generateToken = require('../utils/generateToken');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    ],
    validateRequest,
    registerUser
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    validateRequest,
    loginUser
);

// --- NEW GOOGLE OAUTH ROUTES ---

// @desc    Auth with Google
// @route   GET /api/v1/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/v1/auth/google/callback
router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: 'https://madan-electricalsfrontend.vercel.app/', // Redirect on failure
    session: false // We are using JWT, not sessions
}), (req, res) => {
    const token = generateToken(req.user._id);
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        token: token,
    };
    // Redirect to a frontend page with the user data/token
    const frontendUrl = process.env.FRONTEND_URL || 'https://madan-electricalsfrontend.vercel.app';
    res.redirect(`${frontendUrl}/auth/callback?user=${encodeURIComponent(JSON.stringify(user))}`);
});


module.exports = router;
