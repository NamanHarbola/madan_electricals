// controllers/categoryController.js
const Category = require('../models/Category');

// @desc    Fetch all categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single category by ID
// @route   GET /api/v1/categories/:id
// @access  Private/Admin
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a category
// @route   POST /api/v1/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name, image } = req.body;
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400).json({ message: 'Category already exists' });
        return;
    }

    const category = new Category({
        name,
        image,
    });

    try {
        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    const { name, image } = req.body;

    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = name || category.name;
            category.image = image || category.image;

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};