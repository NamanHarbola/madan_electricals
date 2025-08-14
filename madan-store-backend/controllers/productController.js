// controllers/productController.js
const Product = require('../models/Product');

// GET all products OR filter by keyword/category
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    const filter = {};

    if (keyword) {
      filter.name = {
        $regex: keyword,
        $options: 'i', // Case-insensitive
      };
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

// ... (The rest of your controller functions remain the same)
// GET a single product by its ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST a new product (Admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, mrp, category, image, description, stock, rating, trending } = req.body;
    const product = new Product({
      name, price, mrp, category, image, description, stock, rating, trending,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating product" });
  }
};

// PUT (update) a product (Admin)
exports.updateProduct = async (req, res) => {
    const { name, price, mrp, description, image, category, stock, rating, trending } = req.body;
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name;
            product.price = price;
            product.mrp = mrp;
            product.description = description;
            product.image = image;
            product.category = category;
            product.stock = stock;
            product.rating = rating;
            product.trending = trending;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE a product (Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
