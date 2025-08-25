// models/Product.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, {
    timestamps: true,
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    // FIX: Removed the hardcoded 'enum' to allow any category name
    category: { type: String, required: true },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    sku: { type: String, unique: true },
    tags: [String],
    trending: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
