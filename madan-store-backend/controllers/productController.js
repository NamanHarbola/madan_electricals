// controllers/productController.js
const Product = require('../models/Product');

// @desc    Fetch all products, with optional filtering by keyword/category
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { keyword, category } = req.query;
        const filter = {};

        if (keyword) {
            filter.name = { $regex: keyword, $options: 'i' };
        }
        if (category) {
            const categoryRegex = new RegExp(`^${category.replace(/-/g, ' ')}$`, 'i');
            filter.category = { $regex: categoryRegex };
        }

        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching products" });
    }
};

// @desc    Fetch a single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, price, mrp, category, images, description, stock, trending } = req.body;
        
        const product = new Product({
            user: req.user._id,
            name,
            price,
            mrp,
            category,
            images,
            description,
            stock,
            trending,
            rating: 0,
            numReviews: 0,
            reviews: [],
            sku: `ME-${category.substring(0, 4).toUpperCase()}-${Date.now()}`
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error while creating product" });
    }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, price, mrp, description, images, category, stock, trending } = req.body;
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.mrp = mrp || product.mrp;
            product.description = description || product.description;
            product.images = images || product.images;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;
            product.trending = trending !== undefined ? trending : product.trending;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new review
// @route   POST /api/v1/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
};