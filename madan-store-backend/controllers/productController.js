// controllers/productController.js

const Product = require('../models/Product');

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products from DB:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

// POST a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, mrp, category, image, description, stock, rating, trending } = req.body;
    
    const product = new Product({
      name,
      price,
      mrp, // 2. Add 'mrp' to the new product object
      category,
      image,
      description,
      stock,
      rating,
      trending,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
} catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

// GET a single product by its ID
// Make sure this function exists and is exported correctly.
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Error fetching single product from DB:", error);
    res.status(500).json({ message: "Server error" });
  }
};