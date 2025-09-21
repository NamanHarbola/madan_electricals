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
    // FIX 1: Update the failure redirect URL
    failureRedirect: 'https://www.madanelectricals.com/login', 
    session: false
}), (req, res) => {
    const token = generateToken(req.user._id);
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        token: token,
    };
    
    // FIX 2: Hardcode the correct production frontend URL for the success redirect
    const frontendUrl = 'https://www.madanelectricals.com';
    res.redirect(`${frontendUrl}/auth/callback?user=${encodeURIComponent(JSON.stringify(user))}`);
});


module.exports = router;
