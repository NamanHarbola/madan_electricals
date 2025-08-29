// src/pages/CheckoutPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import API from '../api';
import { toast } from "react-toastify";
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import formatCurrency from "../utils/formatCurrency.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, clearCart, addToCart, decrementCartItem, removeFromCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [isPlacing, setIsPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [shippingInfo, setShippingInfo] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  // Fetch user profile to get shipping address
  useEffect(() => {
    const fetchProfile = async () => {
      if (userInfo) {
        try {
          const { data } = await API.get('/api/v1/profile');
          if (data && data.shippingAddress && data.shippingAddress.address) {
            setShippingInfo({ ...data.shippingAddress, name: data.name });
          } else {
             setShippingInfo({ name: data.name });
          }
        } catch (error) {
          toast.error("Could not fetch your shipping address.");
        } finally {
            setLoadingAddress(false);
        }
      }
    };
    fetchProfile();
  }, [userInfo]);

  const { finalTotal, taxAmount, codFee } = useMemo(() => {
    let tax = 0;
    let cod = 0;
    if (paymentMethod === 'online') tax = cartSubtotal * 0.0255;
    else if (paymentMethod === 'COD') cod = 20; // Match uppercase state
    return { finalTotal: cartSubtotal + tax + cod, taxAmount: tax, codFee: cod };
  }, [cartSubtotal, paymentMethod]);

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const createOrderPayload = () => {
      if (!shippingInfo || !shippingInfo.address) {
          toast.error("Please add a shipping address to your profile before placing an order.");
          return null;
      }
      return {
          orderItems: cartItems.map(item => ({ ...item, product: item._id, image: item.images[0] })),
          shippingInfo,
          totalPrice: finalTotal,
          paymentMethod,
          shippingPrice: paymentMethod === 'COD' ? codFee : 0,
      };
  };

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

  const handleOnlinePayment = async () => {
    const orderPayload = createOrderPayload();
    if (!orderPayload) return;
    
    setIsPlacing(true);
    if (!await loadRazorpay()) {
      toast.error("Payment SDK failed to load.");
      return setIsPlacing(false);
    }

    try {
      const { data: { id: order_id, breakdown } } = await API.post("/api/v1/payment/orders", { amount: cartSubtotal });
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: Math.round(breakdown.finalAmount * 100),
        currency: "INR",
        name: "Madan Store",
        description: "Order Payment",
        order_id,
        handler: async (response) => {
            try {
              const { data: verifyData } = await API.post("/api/v1/payment/verify", response);
              if (verifyData.success) {
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

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', () => toast.error("Payment failed. Please try again."));
    } catch (err) {
      toast.error("Payment initiation failed");
    } finally {
      setIsPlacing(false);
    }
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return toast.error("Your cart is empty.");
    if (paymentMethod === "COD") handleCOD();
    else handleOnlinePayment();
  };

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px', maxWidth: '1024px', margin: 'auto' }}>
      <h1 className="page-title">Shopping Cart</h1>

      {loadingAddress ? <LoadingSpinner /> : (
        <>
            {cartItems.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px 0'}}>
                    <p>Your cart is empty.</p>
                    <Link to="/" className="btn-full" style={{marginTop: 12, width: 'auto', display: 'inline-block'}}>Continue Shopping</Link>
                </div>
            ) : (
            <div className="cart-layout">
                <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    <div className="checkout-summary">
                        <h2 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px'}}><FaMapMarkerAlt /> Shipping Address</h2>
                        {shippingInfo?.address ? (
                            <div>
                                <p style={{margin: '4px 0', fontWeight: 'bold'}}>{shippingInfo.name}</p>
                                <p style={{margin: '4px 0'}}>{shippingInfo.address}</p>
                                <p style={{margin: '4px 0'}}>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                                <Link to="/profile/edit" style={{color: 'var(--color-secondary)', fontWeight: 500}}>Change Address</Link>
                            </div>
                        ) : (
                            <div style={{padding: '10px', background: '#fff8e1', borderRadius: 'var(--r-sm)'}}>
                                <p style={{margin: 0}}>You have no shipping address saved.</p>
                                <Link to="/profile/edit" className="btn-full" style={{marginTop: 12, width: 'auto', display: 'inline-block', padding: '8px 16px'}}>Add Address</Link>
                            </div>
                        )}
                    </div>

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
                                            <button onClick={() => decrementCartItem(item._id)} aria-label="Decrease quantity">−</button>
                                            <span>{item.qty}</span>
                                            <button onClick={() => addToCart(item, 1)} aria-label="Increase quantity">+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="btn-icon" aria-label="Remove item"><FaTrash /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="checkout-summary cart-summary">
                    <h2 style={{marginTop: 0}}>Order Summary</h2>
                    <div className="space-y-2 mb-6">
                        <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
                        {paymentMethod === 'online' && (<div className="summary-row"><span>Convenience Fee (2.55%)</span><span>{formatCurrency(taxAmount)}</span></div>)}
                        {paymentMethod === 'COD' && (<div className="summary-row"><span>Cash on Delivery Fee</span><span>{formatCurrency(codFee)}</span></div>)}
                        <div className="summary-row total"><span>Total</span><span>{formatCurrency(finalTotal)}</span></div>
                    </div>

                    <div className="mb-6">
                        <h3 style={{marginBottom: 12}}>Choose Payment Method</h3>
                        <div className="payment-method-options">
                            <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                                <input type="radio" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} name="paymentMethod" style={{display: 'none'}}/>
                                Online Payment
                            </label>
                            <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                                <input type="radio" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} name="paymentMethod" style={{display: 'none'}}/>
                                Cash on Delivery
                            </label>
                        </div>
                    </div>

                    <button onClick={placeOrder} disabled={isPlacing || !shippingInfo?.address} className="btn-full">
                        {isPlacing ? "Processing..." : `Place Order`}
                    </button>
                </div>
            </div>
            )}
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
