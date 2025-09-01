// controllers/aboutController.js
const About = require('../models/About');

// @desc    Get about page content
// @route   GET /api/v1/about
// @access  Public
const getAboutContent = async (req, res) => {
    try {
        const aboutContent = await About.findOne();
        if (aboutContent) {
            res.json(aboutContent);
        } else {
            res.status(404).json({ message: 'About content not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update about page content
// @route   PUT /api/v1/about
// @access  Private/Admin
const updateAboutContent = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        let aboutContent = await About.findOne();

        if (aboutContent) {
            aboutContent.title = title || aboutContent.title;
            aboutContent.description = description || aboutContent.description;
            aboutContent.image = image || aboutContent.image;
        } else {
            aboutContent = new About({ title, description, image });
        }

        const updatedContent = await aboutContent.save();
        res.json(updatedContent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAboutContent, updateAboutContent };