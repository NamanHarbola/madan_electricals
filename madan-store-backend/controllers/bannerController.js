// controllers/bannerController.js
const Banner = require('../models/Banner');

// Get all active banners
const getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new banner (Admin)
const createBanner = async (req, res) => {
    try {
        const { image, title, link } = req.body;
        if (!image || !title) {
            return res.status(400).json({ message: 'Banner image and title are required' });
        }
        
        // THE FIX: Explicitly set isActive to true when creating a new banner.
        const banner = new Banner({ 
            image, 
            title, 
            link, 
            isActive: true 
        });

        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        console.error(error); // Log the error for better debugging
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a banner (Admin)
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            await banner.deleteOne();
            res.json({ message: 'Banner removed' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getActiveBanners, createBanner, deleteBanner };
