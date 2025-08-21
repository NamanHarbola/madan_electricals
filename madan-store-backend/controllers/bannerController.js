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

// --- NEW --- Get single banner by ID (for editing)
const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            res.json(banner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
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
        
        const banner = new Banner({ 
            image, 
            title, 
            link, 
            isActive: true 
        });

        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- NEW --- Update a banner
const updateBanner = async (req, res) => {
    try {
        const { title, link, image, isActive } = req.body;
        const banner = await Banner.findById(req.params.id);

        if (banner) {
            banner.title = title || banner.title;
            banner.link = link || banner.link;
            banner.image = image || banner.image;
            banner.isActive = isActive;

            const updatedBanner = await banner.save();
            res.json(updatedBanner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
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

module.exports = { getActiveBanners, createBanner, deleteBanner, getBannerById, updateBanner };
