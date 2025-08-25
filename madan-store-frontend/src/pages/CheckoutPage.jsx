// src/pages/CheckoutPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import axios from 'axios';
import formatCurrency from '../utils/formatCurrency';
import { FaTrash } from 'react-icons/fa';

const CheckoutPage = () => {
    const { cartItems, cartSubtotal, clearCart, addToCart, decrementCartItem, removeFromCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('COD');
    // FIX: Pre-fill shipping info from user profile if it exists
    const [shippingInfo, setShippingInfo] = useState({
        name: userInfo?.name || '',
        landmark: userInfo?.shippingAddress?.landmark || '',
        address: userInfo?.shippingAddress?.address || '',
        city: userInfo?.shippingAddress?.city || '',
        postalCode: userInfo?.shippingAddress?.postalCode || '',
        country: 'India',
    });

    useEffect(() => {
        // This effect runs if the userInfo is loaded after the component mounts
        if (userInfo?.shippingAddress) {
            setShippingInfo({
                name: userInfo.name,
                landmark: userInfo.shippingAddress.landmark || '',
                address: userInfo.shippingAddress.address || '',
                city: userInfo.shippingAddress.city || '',
                postalCode: userInfo.shippingAddress.postalCode || '',
                country: 'India',
            });
        }
    }, [userInfo]);

    const { finalTotal, handlingCharge, taxAmount } = useMemo(() => {
        let handlingCharge = 0;
        let taxAmount = 0;
        let finalTotal = cartSubtotal;

        if (paymentMethod === 'COD') {
            handlingCharge = 20;
            finalTotal += handlingCharge;
        } else { // Razorpay
            taxAmount = cartSubtotal * 0.0211;
            finalTotal += taxAmount;
        }
        return { finalTotal, handlingCharge, taxAmount };
    }, [cartSubtotal, paymentMethod]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prevState => ({ ...prevState, [name]: value }));
    };
    
    const placeOrder = async (paymentDetails = {}) => {
        try {
            const order = {
                orderItems: cartItems.map(item => ({ ...item, product: item._id })),
                shippingInfo,
                totalPrice: finalTotal,
                paymentMethod,
                ...paymentDetails
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post('/api/v1/orders', order, config);
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/');
        } catch (error) {
             toast.error(error.response?.data?.message || 'Failed to place order.');
        }
    };
    
    const handlePayment = async () => {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data: { id, amount } } = await axios.post('/api/v1/payment/orders', { amount: Math.round(finalTotal * 100) }, config);

        const options = {
            key: "rzp_live_R8MtGukbGCC0v3", // Replace with your key ID
            amount,
            currency: "INR",
            name: "Madan Store",
            description: "Payment for your order",
            order_id: id,
            handler: async (response) => {
                try {
                    const verifyConfig = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
                    const { data } = await axios.post('/api/v1/payment/verify', response, verifyConfig);
                    if (data.success) {
                        placeOrder();
                    } else {
                        toast.error("Payment verification failed. Please contact support.");
                    }
                } catch (error) {
                    toast.error("Payment verification failed.");
                }
            },
            prefill: {
                name: shippingInfo.name,
                email: userInfo.email,
            },
            theme: {
                color: "#B7A684"
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (paymentMethod === 'COD') {
            placeOrder();
        } else {
            handlePayment();
        }
    };
    
    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '50px' }}>
                <h1 className="page-title">Your Cart is Empty</h1>
                <Link to="/" className="btn-full" style={{ maxWidth: '200px', margin: 'auto' }}>Go Shopping</Link>
            </div>
        )
    }

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '50px' }}>
            <h1 className="page-title">Checkout</h1>
            <div className="cart-layout">
                <div className="cart-items-list">
                    {cartItems.map(item => (
                        <div key={item._id} className="cart-page-item">
                            <img src={item.images[0]} alt={item.name} />
                            <div className="cart-item-info">
                                <Link to={`/product/${item._id}`}>{item.name}</Link>
                                <h4>{formatCurrency(item.price)}</h4>
                            </div>
                            <div className="cart-item-actions">
                                <div className="quantity-adjuster">
                                    <button onClick={() => decrementCartItem(item._id)}>-</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => addToCart(item, 1)}>+</button>
                                </div>
                                <button onClick={() => removeFromCart(item._id)} className="btn-icon">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={submitHandler} className="checkout-summary">
                    <h3>Shipping Information</h3>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" className="form-control" value={shippingInfo.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input type="text" id="address" name="address" className="form-control" value={shippingInfo.address} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="landmark">Landmark (Optional)</label>
                        <input type="text" id="landmark" name="landmark" className="form-control" value={shippingInfo.landmark} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" name="city" className="form-control" value={shippingInfo.city} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input type="text" id="postalCode" name="postalCode" className="form-control" value={shippingInfo.postalCode} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input type="text" id="country" name="country" value={shippingInfo.country} className="form-control" onChange={handleChange} required />
                    </div>

                    <h3>Payment Method</h3>
                    <div className="payment-method-options">
                        <label>
                            <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                            Cash on Delivery
                        </label>
                         <label>
                            <input type="radio" name="paymentMethod" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={() => setPaymentMethod('Razorpay')} />
                            Pay Online
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
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>{formatCurrency(finalTotal)}</span>
                    </div>
                    <button type="submit" className="btn-full">
                        {paymentMethod === 'COD' ? 'Place Order' : 'Pay Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;