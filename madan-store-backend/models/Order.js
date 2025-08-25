// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    shippingInfo: { // Add shipping info
        name: { type: String, required: true },
        landmark: { type: String },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Razorpay', 'COD'],
        default: 'COD'
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingPrice: { type: Number, required: true, default: 0.0 }, // Add shipping price
    trackingNumber: { type: String }, // Add tracking number
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;