// src/pages/CheckoutPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import API from '../api';
import formatCurrency from '../utils/formatCurrency';
import { FaTrash } from 'react-icons/fa';

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, clearCart, addToCart, decrementCartItem, removeFromCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'Razorpay'
  const [isPlacing, setIsPlacing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: userInfo?.name || '',
    landmark: userInfo?.shippingAddress?.landmark || '',
    address: userInfo?.shippingAddress?.address || '',
    city: userInfo?.shippingAddress?.city || '',
    postalCode: userInfo?.shippingAddress?.postalCode || '',
    country: 'India',
  });

  useEffect(() => {
    if (userInfo) {
      setShippingInfo((prev) => ({
        ...prev,
        name: userInfo.name || prev.name,
        landmark: userInfo.shippingAddress?.landmark || prev.landmark,
        address: userInfo.shippingAddress?.address || prev.address,
        city: userInfo.shippingAddress?.city || prev.city,
        postalCode: userInfo.shippingAddress?.postalCode || prev.postalCode,
      }));
    }
  }, [userInfo]);

  const { finalTotal, handlingCharge, taxAmount } = useMemo(() => {
    let handling = 0;
    let tax = 0;
    let total = cartSubtotal;

    if (paymentMethod === 'COD') {
      handling = 20;
      total += handling;
    } else {
      // 2.11% fee for online payment
      tax = cartSubtotal * 0.0211;
      total += tax;
    }
    return { finalTotal: total, handlingCharge: handling, taxAmount: tax };
  }, [cartSubtotal, paymentMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = useCallback(
    async (paymentDetails = {}) => {
      try {
        const order = {
          orderItems: cartItems.map((item) => ({ ...item, product: item._id })),
          shippingInfo,
          totalPrice: finalTotal,
          paymentMethod,
          ...paymentDetails,
        };

        await API.post('/api/v1/orders', order);
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to place order.');
      } finally {
        setIsPlacing(false);
      }
    },
    [cartItems, shippingInfo, finalTotal, paymentMethod, clearCart, navigate]
  );

  const handlePayment = async () => {
    setIsPlacing(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error('Payment SDK failed to load. Please try again.');
      setIsPlacing(false);
      return;
    }

    try {
      const { data: { id, amount } } = await API.post('/api/v1/payment/orders', {
        amount: Math.round(finalTotal * 100),
      });

      const key = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_1234567890';
      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'Madan Store',
        description: 'Payment for your order',
        order_id: id,
        handler: async (response) => {
          try {
            const { data } = await API.post('/api/v1/payment/verify', response);
            if (data.success) {
              await placeOrder({
                paymentResult: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                isPaid: true,
                paidAt: new Date().toISOString(),
              });
            } else {
              toast.error('Payment verification failed. Please contact support.');
              setIsPlacing(false);
            }
          } catch {
            toast.error('Payment verification failed.');
            setIsPlacing(false);
          }
        },
        prefill: {
          name: shippingInfo.name,
          email: userInfo?.email || '',
        },
        theme: { color: '#08747c' },
        modal: {
          ondismiss: () => setIsPlacing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error('Could not initiate payment.');
      setIsPlacing(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isPlacing) return;

    // basic client validation
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country) {
      toast.error('Please fill all required shipping fields.');
      return;
    }

    if (paymentMethod === 'COD') {
      setIsPlacing(true);
      placeOrder({ isPaid: false });
    } else {
      handlePayment();
    }
  };

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '50px' }}>
        <h1 className="page-title">Your Cart is Empty</h1>
        <Link to="/" className="btn-full" style={{ maxWidth: 220, margin: '12px auto 0' }}>
          Go Shopping
        </Link>
      </div>
    );
  }

  // Require login to check out (gentle prompt)
  if (!userInfo) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 60 }}>
        <h1 className="page-title">Please Log In</h1>
        <p style={{ marginTop: 8 }}>You need an account to complete checkout.</p>
        <Link to="/login" className="btn-full" style={{ maxWidth: 220, margin: '16px auto 0' }}>
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '50px' }}>
      <h1 className="page-title">Checkout</h1>

      <div className="cart-layout">
        {/* Cart items */}
        <div className="cart-items-list" aria-labelledby="cart-items-heading">
          <h2 id="cart-items-heading" style={{ marginTop: 0 }}>Your Items</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-page-item">
              <img
                src={item.images?.[0] || item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
              />
              <div className="cart-item-info">
                <Link to={`/product/${item._id}`}>{item.name}</Link>
                <h4>{formatCurrency(item.price)}</h4>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-adjuster" role="group" aria-label={`Quantity for ${item.name}`}>
                  <button type="button" onClick={() => decrementCartItem(item._id)} aria-label={`Decrease ${item.name} quantity`}>
                    −
                  </button>
                  <span aria-live="polite">{item.qty}</span>
                  <button type="button" onClick={() => addToCart(item, 1)} aria-label={`Increase ${item.name} quantity`}>
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item._id)}
                  className="btn-icon"
                  aria-label={`Remove ${item.name} from cart`}
                  title="Remove"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout form */}
        <form onSubmit={submitHandler} className="checkout-summary" noValidate>
          <h3 style={{ marginTop: 0 }}>Shipping Information</h3>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              className="form-control"
              value={shippingInfo.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              className="form-control"
              value={shippingInfo.address}
              onChange={handleChange}
              autoComplete="street-address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="landmark">Landmark (Optional)</label>
            <input
              id="landmark"
              name="landmark"
              className="form-control"
              value={shippingInfo.landmark}
              onChange={handleChange}
              autoComplete="address-line2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              className="form-control"
              value={shippingInfo.city}
              onChange={handleChange}
              autoComplete="address-level2"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              id="postalCode"
              name="postalCode"
              className="form-control"
              value={shippingInfo.postalCode}
              onChange={handleChange}
              autoComplete="postal-code"
              inputMode="numeric"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              name="country"
              className="form-control"
              value={shippingInfo.country}
              onChange={handleChange}
              autoComplete="country-name"
              required
            />
          </div>

          <h3>Payment Method</h3>

          {/* Accessible radios styled like your tiles */}
          <div className="payment-method-options" role="radiogroup" aria-label="Payment method">
            <label
              className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                aria-label="Cash on Delivery"
              />
              <span style={{ fontWeight: 600, marginTop: 4 }}>Cash on Delivery</span>
            </label>

            <label
              className={`payment-option ${paymentMethod === 'Razorpay' ? 'selected' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <input
                type="radio"
                name="payment"
                value="Razorpay"
                checked={paymentMethod === 'Razorpay'}
                onChange={() => setPaymentMethod('Razorpay')}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                aria-label="Pay Online"
              />
              <span style={{ fontWeight: 600, marginTop: 4 }}>Pay Online</span>
            </label>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(cartSubtotal)}</span>
          </div>

          {handlingCharge > 0 && (
            <div className="summary-row">
              <span>Handling Charge</span>
              <span>{formatCurrency(handlingCharge)}</span>
            </div>
          )}

          {taxAmount > 0 && (
            <div className="summary-row">
              <span>Tax (2.11%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          )}

          <div className="summary-row total" aria-live="polite">
            <span>Total</span>
            <span>{formatCurrency(finalTotal)}</span>
          </div>

          <button type="submit" className="btn-full" disabled={isPlacing} aria-busy={isPlacing}>
            {isPlacing ? 'Processing…' : paymentMethod === 'COD' ? 'Place Order' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
