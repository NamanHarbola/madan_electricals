// models/Banner.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true, default: 'Special Offer' }, // For alt text and accessibility
    link: { type: String, default: '/' }, // URL to navigate to on click
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;