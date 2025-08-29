// madan-store-backend/controllers/paymentController.js

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
        // This amount should be the clean cart subtotal sent from the frontend
        const baseAmount = Number(req.body.amount); 

        if (!baseAmount || baseAmount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // --- Convenience Fee Calculation (Passing Razorpay fees to customer) ---
        // This logic ensures you receive the full 'baseAmount' after fees are deducted.
        const feePercent = 2.0; // Standard Razorpay fee is ~2%
        const gstPercent = 18;  // GST on the fee

        // Calculate the total fee percentage including GST
        const feeWithGst = feePercent * (1 + gstPercent / 100); // e.g., 2 * 1.18 = 2.36%

        // To ensure you receive the full baseAmount, we calculate the gross amount to charge the customer.
        // The formula is: GrossAmount = BaseAmount / (1 - FeePercentage)
        const finalAmount = baseAmount / (1 - (feeWithGst / 100));

        const convenienceFee = finalAmount - baseAmount;

        // Razorpay expects the amount in the smallest currency unit (paise)
        const amountInPaise = Math.round(finalAmount * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Some error occurred");

        // Send back the final calculated amounts so the frontend can display them accurately
        res.json({
            ...order,
            breakdown: {
                baseAmount: Number(baseAmount.toFixed(2)),
                convenienceFee: Number(convenienceFee.toFixed(2)),
                finalAmount: Number(finalAmount.toFixed(2)),
            },
        });
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
