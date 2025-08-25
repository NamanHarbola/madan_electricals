// controllers/adminController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        // --- Sales data for the last 6 months ---
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlySales = await Order.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    totalSales: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // --- Top 5 selling products ---
        const topProducts = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.name",
                    totalQuantity: { $sum: "$orderItems.qty" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);
        
        // --- Total counts ---
        const userCount = await User.countDocuments();
        const orderCount = await Order.countDocuments();
        const productCount = await Product.countDocuments();
        const totalSalesData = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
        ]);
        const totalSales = totalSalesData.length > 0 ? totalSalesData[0].totalSales : 0;


        res.json({
            userCount,
            orderCount,
            productCount,
            totalSales,
            monthlySales,
            topProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};