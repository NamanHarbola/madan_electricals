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
        const baseAmount = req.body.amount; // amount you want to actually receive (in INR)

        // Razorpay fee + GST
        const feePercent = 2.11;   // Razorpay base fee %
        const gstPercent = 18;     // GST %
        const effectiveDeduction = feePercent * (1 + gstPercent / 100); // ≈ 2.4898%
        const grossUpPercent = (effectiveDeduction / (100 - effectiveDeduction)) * 100; // ≈ 2.553%

        // Final amount after gross-up
        const finalAmount = baseAmount * (1 + grossUpPercent / 100);

        const options = {
            amount: Math.round(finalAmount * 100), // in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Some error occurred");

        res.json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).send(error);
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/v1/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            res.json({ success: true, message: "Payment has been verified" });
        } else {
            res.json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Razorpay Verify Error:", error);
        res.status(500).send(error);
    }
};

module.exports = { createRazorpayOrder, verifyPayment };