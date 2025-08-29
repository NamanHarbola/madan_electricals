// src/pages/CheckoutPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import API from '../api';
import { toast } from "react-toastify";
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import formatCurrency from "../utils/formatCurrency.js";

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, clearCart, addToCart, decrementCartItem, removeFromCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [isPlacing, setIsPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [shippingInfo, setShippingInfo] = useState(null);

  // Fetch user profile to get shipping address
  useEffect(() => {
    const fetchProfile = async () => {
      if (userInfo) {
        try {
          const { data } = await API.get('/api/v1/profile');
          if (data.shippingAddress) {
            setShippingInfo(data.shippingAddress);
          }
        } catch (error) {
          toast.error("Could not fetch your shipping address.");
        }
      }
    };
    fetchProfile();
  }, [userInfo]);

  // ---- Price & Fee Calculation ----
  const { finalTotal, taxAmount, codFee } = useMemo(() => {
    let tax = 0;
    let cod = 0;

    if (paymentMethod === 'online') {
      tax = cartSubtotal * 0.0255;
    } else if (paymentMethod === 'cod') {
      cod = 20;
    }

    const total = cartSubtotal + tax + cod;
    return { finalTotal: total, taxAmount: tax, codFee: cod };
  }, [cartSubtotal, paymentMethod]);

  // ---- Load Razorpay SDK ----
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrderPayload = () => {
      if (!shippingInfo || !shippingInfo.address) {
          toast.error("Please add a shipping address to your profile before placing an order.");
          return null;
      }
      return {
          orderItems: cartItems.map(item => ({ ...item, product: item._id })),
          shippingInfo,
          totalPrice: finalTotal,
          paymentMethod,
          shippingPrice: paymentMethod === 'cod' ? codFee : 0,
      };
  };

  // ---- Handle COD ----
  const handleCOD = async () => {
    const payload = createOrderPayload();
    if (!payload) return;

    setIsPlacing(true);
    try {
      await API.post("/api/v1/orders", payload);
      toast.success("Order placed successfully (Cash on Delivery)");
      clearCart();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "COD Order failed");
    } finally {
      setIsPlacing(false);
    }
  };

  // ---- Handle Razorpay Payment ----
  const handleOnlinePayment = async () => {
    const orderPayload = createOrderPayload();
    if (!orderPayload) return;
    
    setIsPlacing(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Payment SDK failed to load.");
      setIsPlacing(false);
      return;
    }

    try {
      const { data: orderData } = await API.post("/api/v1/payment/orders", { amount: cartSubtotal });
      const { id: order_id, breakdown } = orderData;
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: Math.round(breakdown.finalAmount * 100),
        currency: "INR",
        name: "Madan Store",
        description: "Order Payment",
        order_id: order_id,
        handler: async (response) => {
            try {
              const verifyRes = await API.post("/api/v1/payment/verify", response);
              if (verifyRes.data.success) {
                await API.post("/api/v1/orders", {
                  ...orderPayload,
                  paymentMethod: "Razorpay",
                  totalPrice: breakdown.finalAmount,
                  isPaid: true,
                  paidAt: new Date(),
                });
                toast.success("Payment successful & order placed!");
                clearCart();
                navigate('/');
              } else {
                toast.error("Payment verification failed!");
              }
            } catch (error) {
              toast.error("Error finalizing order after payment.");
            }
          },
        prefill: { name: userInfo?.name, email: userInfo?.email },
        notes: { address: shippingInfo.address },
        theme: { color: "#08747c" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on('payment.failed', () => toast.error("Payment failed. Please try again."));
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

      {!shippingInfo && (
          <div style={{textAlign: 'center', padding: '20px', background: 'var(--color-surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--color-error)', marginBottom: '20px'}}>
              <p style={{margin: 0, fontWeight: 500}}>Please add a shipping address to your profile to proceed.</p>
              <Link to="/profile/edit" className="btn-full" style={{marginTop: 12, width: 'auto', display: 'inline-block', padding: '8px 16px'}}>Go to Profile</Link>
          </div>
      )}

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
                    <div className="summary-row">
                        <span>Convenience Fee (2.55%)</span>
                        <span>{formatCurrency(taxAmount)}</span>
                    </div>
                )}
                {paymentMethod === 'cod' && (
                     <div className="summary-row">
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
                disabled={isPlacing || !shippingInfo}
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
