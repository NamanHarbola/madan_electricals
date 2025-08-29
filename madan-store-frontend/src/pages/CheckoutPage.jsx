// src/pages/CheckoutPage.jsx
import React, { useState, useMemo } from "react";
import { useCart } from '../context/CartContext.jsx';
import API from '../api';
import { toast } from "react-toastify";
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import formatCurrency from "../utils/formatCurrency.js";

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, clearCart, addToCart, decrementCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [isPlacing, setIsPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" | "cod"

  // ---- Price & Fee Calculation for DISPLAY ----
  const { finalTotal, taxAmount, codFee } = useMemo(() => {
    let tax = 0;
    let cod = 0;

    if (paymentMethod === 'online') {
      // **CORRECTED:** Use the exact same 2.55% fee for display consistency
      tax = cartSubtotal * 0.0255; 
    } else if (paymentMethod === 'cod') {
      cod = 20; // ₹20 fee for Cash on Delivery
    }

    const total = cartSubtotal + tax + cod;
    return { finalTotal: total, taxAmount: tax, codFee: cod };
  }, [cartSubtotal, paymentMethod]);


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
        ...item,
        product: item._id,
      }));

      await API.post("/api/v1/orders", {
        orderItems,
        paymentMethod: "COD",
        totalPrice: finalTotal,
        shippingPrice: codFee,
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
      // 1. Create Razorpay Order by sending the clean subtotal
      const { data: orderData } = await API.post("/api/v1/payment/orders", {
        amount: cartSubtotal,
      });
      
      const { id: order_id, breakdown } = orderData;
      
      // 2. Configure Razorpay Checkout using the final amount from the backend
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: Math.round(breakdown.finalAmount * 100), // Use the precise final amount from backend
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
                  paymentMethod: "Razorpay",
                  totalPrice: breakdown.finalAmount, // Use final amount from backend
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
      paymentObject.on('payment.failed', function (response){
        toast.error("Payment failed. Please try again.");
      });

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
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px', maxWidth: '1024px', margin: 'auto' }}>
      <h1 className="page-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px 0'}}>
            <p>Your cart is empty.</p>
            <Link to="/" className="btn-full" style={{marginTop: 12, width: 'auto', display: 'inline-block'}}>Continue Shopping</Link>
        </div>
      ) : (
      <div className="cart-layout">
        <div className="cart-items-list">
            <h2 style={{marginTop: 0}}>Your Items</h2>
            {cartItems.map((item) => (
                <div key={item._id} className="cart-page-item">
                    <img src={item.images[0]} alt={item.name} />
                    <div className="cart-item-info">
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                        <h4>{formatCurrency(item.price)}</h4>
                        <div className="cart-item-actions">
                            <div className="quantity-adjuster">
                                <button onClick={() => decrementCartItem(item._id)} aria-label="Decrease quantity">
                                −
                                </button>
                                <span>{item.qty}</span>
                                <button onClick={() => addToCart(item, 1)} aria-label="Increase quantity">
                                +
                                </button>
                            </div>
                             <button onClick={() => removeFromCart(item._id)} className="btn-icon" aria-label="Remove item">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="checkout-summary cart-summary">
            <h2 style={{marginTop: 0}}>Order Summary</h2>
            <div className="space-y-2 mb-6">
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                {paymentMethod === 'online' && (
                    <div className="summary-row text-sm text-gray-600">
                        <span>Convenience Fee (2.55%)</span>
                        <span>{formatCurrency(taxAmount)}</span>
                    </div>
                )}
                {paymentMethod === 'cod' && (
                     <div className="summary-row text-sm text-gray-600">
                        <span>Cash on Delivery Fee</span>
                        <span>{formatCurrency(codFee)}</span>
                    </div>
                )}
                <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatCurrency(finalTotal)}</span>
                </div>
            </div>

            <div className="mb-6">
                <h3 style={{marginBottom: 12}}>Choose Payment Method</h3>
                <div className="payment-method-options">
                    <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            value="online"
                            checked={paymentMethod === "online"}
                            onChange={() => setPaymentMethod("online")}
                            name="paymentMethod"
                            style={{display: 'none'}}
                        />
                        Online Payment
                    </label>
                    <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                            name="paymentMethod"
                            style={{display: 'none'}}
                        />
                        Cash on Delivery
                    </label>
                </div>
            </div>

            <button
                onClick={placeOrder}
                disabled={isPlacing}
                className="btn-full"
            >
                {isPlacing ? "Processing..." : `Place Order`}
            </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default CheckoutPage;
