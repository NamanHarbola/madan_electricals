// controllers/bannerController.js
const Banner = require('../models/Banner');

// Get all active banners
const getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new banner (for admin)
const createBanner = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Banner text is required' });
        }
        const banner = new Banner({ text });
        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getActiveBanners, createBanner };