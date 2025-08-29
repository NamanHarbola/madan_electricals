// madan-store-backend/controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');

// ... (getOrders, getOrderById, getMyOrders functions remain the same) ...

const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingInfo, totalPrice, paymentMethod, shippingPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        
        if (!shippingInfo || !shippingInfo.address) {
            return res.status(400).json({ message: 'Shipping information is missing.' });
        }
        
        // **CRITICAL FIX:** Ensure shippingInfo includes the phone number.
        const finalShippingInfo = {
            name: shippingInfo.name || req.user.name,
            phone: shippingInfo.phone || req.user.phone, // <-- ADD THIS LINE
            ...shippingInfo
        };

        const isPaid = paymentMethod === 'Razorpay';
        const status = isPaid ? 'Paid' : 'Pending';

        const order = new Order({
            user: req.user._id,
            orderItems: orderItems.map(item => ({
                name: item.name,
                qty: item.qty,
                image: (item.images && item.images[0]) || item.image || '/images/placeholder.jpg',
                price: item.price,
                product: item._id
            })),
            shippingInfo: finalShippingInfo,
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
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation Error: ${error.message}` });
        }
        res.status(500).json({ message: 'Server Error Creating Order' });
    }
};

// ... (updateOrderStatus function remains the same) ...

module.exports = { getOrders, getOrderById, getMyOrders, createOrder, updateOrderStatus };
