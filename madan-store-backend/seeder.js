// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const Product = require('./models/Product');
const Order = require('./models/Order'); // Import Order model
const User = require('./models/User'); // Import User model

const products = require('./data/products');
const orders = require('./data/orders'); // Import orders data

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await Order.deleteMany(); // Clear existing orders

    await Product.insertMany(products);
    await Order.insertMany(orders); // Insert sample orders

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};
// ... (destroyData function should also be updated to delete Orders)

// Function to destroy data
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('✅ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error}`);
    process.exit(1);
  }
};

// Check command line arguments to decide whether to import or destroy
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}