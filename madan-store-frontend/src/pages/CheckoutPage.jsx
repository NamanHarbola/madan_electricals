// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useCart } from '../context/CartContext.jsx';
import API from '../api';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [isPlacing, setIsPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" | "cod"

  // ---- Price Calculation ----
  const taxRate = 0.0255; // Razorpay fee (2.11% + GST 18%) ≈ 2.55%
  const taxAmount = cartSubtotal * taxRate;
  const finalTotal = cartSubtotal + taxAmount;

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

      const orderItems = cartItems.map((item) => ({
        ...item, // Pass the whole item
        product: item._id,
      }));

      await API.post("/api/v1/orders", {
        orderItems,
        paymentMethod: "COD",
        totalPrice: finalTotal.toFixed(2),
        // Add shippingInfo if you have a form for it
      });

      toast.success("Order placed successfully (Cash on Delivery)");
      clearCart();
      navigate('/');
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
      // 1. Create Razorpay Order
      const {
        data: { id: order_id },
      } = await API.post("/api/v1/payment/orders", {
        amount: finalTotal.toFixed(2),
      });

      // 2. Configure Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: (finalTotal * 100).toFixed(0),
        currency: "INR",
        name: "Madan Store",
        description: "Order Payment",
        order_id: order_id,

        handler: async (response) => {
          try {
            // 3. Verify Payment
            const verifyRes = await API.post("/api/v1/payment/verify", response);

            if (verifyRes.data.success) {
              // 4. Create order in DB after successful payment
              const orderItems = cartItems.map((item) => ({
                ...item,
                product: item._id,
              }));

              await API.post("/api/v1/orders", {
                orderItems,
                paymentMethod: "Online",
                totalPrice: finalTotal.toFixed(2),
                isPaid: true,
                paidAt: new Date(),
                // Add shippingInfo if you have a form for it
              });

              toast.success("Payment successful & order placed!");
              clearCart();
              navigate('/');
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
    if (cartItems.length === 0) {
        toast.error("Your cart is empty.");
        return;
    }
    if (paymentMethod === "cod") {
      handleCOD();
    } else {
      handleOnlinePayment();
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px', maxWidth: '768px', margin: 'auto' }}>
      <h1 className="page-title">Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
      <div className="cart-layout">
        <div className="cart-items-list">
            {/* Cart Items */}
            <div className="border-b pb-4 mb-4">
                {cartItems.map((item) => (
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
        </div>
        <div className="checkout-summary">
            {/* Price Details */}
            <div className="space-y-2 mb-6">
                <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row text-sm text-gray-600">
                <span>Payment Gateway Fee (2.55%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
                <h2 className="font-medium mb-2">Choose Payment Method</h2>
                <div className="payment-method-options">
                <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                    <input
                    type="radio"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    name="paymentMethod"
                    />
                    Online Payment (Razorpay)
                </label>
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    name="paymentMethod"
                    />
                    Cash on Delivery
                </label>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                onClick={placeOrder}
                disabled={isPlacing}
                className="btn-full"
            >
                {isPlacing
                ? "Processing..."
                : `Place Order (₹${finalTotal.toFixed(2)})`}
            </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default CheckoutPage;
