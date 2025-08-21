const Order = require('../models/Order');

// ... (getOrders, getOrderById, getMyOrders functions remain the same) ...
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


/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
    try {
        const { orderItems, totalPrice, paymentMethod } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const isPaid = paymentMethod === 'Razorpay'; // Assume Razorpay is paid instantly
        const status = isPaid ? 'Paid' : 'Pending';

        const order = new Order({
            user: req.user._id,
            orderItems: orderItems.map(item => ({ ...item, product: item._id, _id: undefined })),
            totalPrice,
            paymentMethod,
            isPaid,
            paidAt: isPaid ? Date.now() : null,
            status,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            const { status } = req.body;

            // Update status
            order.status = status;

            // If status is 'Paid' and it wasn't before, update payment details
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