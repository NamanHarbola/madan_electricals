// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true }, // <-- ADD THIS LINE
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    trending: { type: Boolean, default: false }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;