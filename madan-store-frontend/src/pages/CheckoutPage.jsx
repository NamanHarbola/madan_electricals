// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../utils/API";
import { toast } from "react-toastify";
import { clearCart } from "../redux/cartSlice";

const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [isPlacing, setIsPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" | "cod"

  // ---- Price Calculation ----
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxRate = 0.0255; // Razorpay fee (2.11% + GST 18%) ≈ 2.55%
  const taxAmount = subtotal * taxRate;
  const finalTotal = subtotal + taxAmount;

  // ---- Load Razorpay SDK ----
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ---- Handle COD ----
  const handleCOD = async () => {
    try {
      setIsPlacing(true);

      const orderItems = cart.map((item) => ({
        product: item._id,
        qty: item.qty,
        price: item.price,
      }));

      await API.post("/api/v1/orders", {
        orderItems,
        paymentMethod: "COD",
        totalPrice: finalTotal.toFixed(2),
      });

      toast.success("Order placed successfully (Cash on Delivery)");
      dispatch(clearCart());
    } catch (err) {
      toast.error("COD Order failed");
    } finally {
      setIsPlacing(false);
    }
  };

  // ---- Handle Razorpay Payment ----
  const handleOnlinePayment = async () => {
    setIsPlacing(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Payment SDK failed to load. Please try again.");
      setIsPlacing(false);
      return;
    }

    try {
      // 1. Create Razorpay Order (backend handles paise conversion)
      const {
        data: { id },
      } = await API.post("/api/v1/payment/orders", {
        amount: finalTotal.toFixed(2), // send INR (decimal)
      });

      // 2. Configure Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: finalTotal.toFixed(2), // just for display; backend already set paise
        currency: "INR",
        name: "Madan Store",
        description: "Order Payment",
        order_id: id,

        handler: async (response) => {
          try {
            // 3. Verify Payment
            const verifyRes = await API.post("/api/v1/payment/verify", response);

            if (verifyRes.data.success) {
              // 4. Create order in DB after successful payment
              const orderItems = cart.map((item) => ({
                product: item._id,
                qty: item.qty,
                price: item.price,
              }));

              await API.post("/api/v1/orders", {
                orderItems,
                paymentMethod: "Online",
                totalPrice: finalTotal.toFixed(2),
                isPaid: true,
                paidAt: new Date(),
              });

              toast.success("Payment successful & order placed!");
              dispatch(clearCart());
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (error) {
            toast.error("Error verifying payment!");
          }
        },

        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Madan Store Address",
        },
        theme: {
          color: "#08747c",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error("Payment initiation failed");
    } finally {
      setIsPlacing(false);
    }
  };

  // ---- Main Checkout Handler ----
  const placeOrder = () => {
    if (paymentMethod === "cod") {
      handleCOD();
    } else {
      handleOnlinePayment();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      {/* Cart Items */}
      <div className="border-b pb-4 mb-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center mb-2"
          >
            <p>
              {item.name} × {item.qty}
            </p>
            <p>₹{(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Payment Gateway Fee (2.55%)</span>
          <span>₹{taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h2 className="font-medium mb-2">Choose Payment Method</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            Online Payment (Razorpay)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={placeOrder}
        disabled={isPlacing}
        className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition"
      >
        {isPlacing
          ? "Processing..."
          : `Place Order (₹${finalTotal.toFixed(2)})`}
      </button>
    </div>
  );
};

export default CheckoutPage;
