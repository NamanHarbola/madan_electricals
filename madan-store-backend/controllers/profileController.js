// controllers/profileController.js
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/v1/profile
// @access  Private
const getProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone, // <-- ADD THIS LINE
            shippingAddress: user.shippingAddress,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/profile
// @access  Private
const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone; // <-- ADD THIS LINE

        if (req.body.shippingAddress) {
            user.shippingAddress = req.body.shippingAddress;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone, // <-- ADD THIS LINE
            shippingAddress: updatedUser.shippingAddress,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getProfile, updateProfile };
