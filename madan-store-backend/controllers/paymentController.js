// controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/v1/payment/orders
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };
        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Some error occured");
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/v1/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        res.json({ success: true, message: "Payment has been verified" });
    } else {
        res.json({ success: false, message: "Payment verification failed" });
    }
};


module.exports = { createRazorpayOrder, verifyPayment };