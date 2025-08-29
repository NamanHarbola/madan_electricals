// madan-store-backend/controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to view this order' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingInfo, totalPrice, paymentMethod, shippingPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        
        // **CRITICAL FIX:** Ensure shippingInfo exists and has a name.
        if (!shippingInfo || !shippingInfo.address) {
            return res.status(400).json({ message: 'Shipping information is missing.' });
        }
        
        // Add user's name to shipping info if it's not there
        const finalShippingInfo = {
            name: shippingInfo.name || req.user.name,
            ...shippingInfo
        };

        const isPaid = paymentMethod === 'Razorpay';
        const status = isPaid ? 'Paid' : 'Pending';

        const order = new Order({
            user: req.user._id,
            orderItems: orderItems.map(item => ({
                name: item.name,
                qty: item.qty,
                image: item.images[0],
                price: item.price,
                product: item._id
            })),
            shippingInfo: finalShippingInfo, // Use the corrected shipping info
            shippingPrice,
            totalPrice,
            paymentMethod,
            isPaid,
            paidAt: isPaid ? Date.now() : null,
            status,
        });

        const createdOrder = await order.save();
        
        const user = await User.findById(req.user._id);
        if (user) {
            user.shippingAddress = shippingInfo;
            await user.save();
        }

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error("Error creating order:", error);
        // Provide a more specific error message if it's a validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation Error: ${error.message}` });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            const { status } = req.body;
            order.status = status;

            if (status === 'Paid' && !order.isPaid) {
                order.isPaid = true;
                order.paidAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating status' });
    }
};

module.exports = { getOrders, getOrderById, getMyOrders, createOrder, updateOrderStatus };
