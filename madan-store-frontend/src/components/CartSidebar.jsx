// src/components/CartSidebar.jsx
import React, { useState } from 'react'; // <-- Import useState
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import formatCurrency from '../utils/formatCurrency.js';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartSidebar = ({ isCartOpen, toggleCart }) => {
    const { cartItems, cartSubtotal, clearCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('COD'); // <-- State for payment method

    const placeOrderHandler = async () => {
        if (!userInfo) {
            toast.info('Please log in to place an order.');
            navigate('/login');
            toggleCart();
            return;
        }

        try {
            const order = {
                orderItems: cartItems.map(item => ({ ...item, product: item._id })),
                totalPrice: cartSubtotal,
                paymentMethod: paymentMethod, // <-- Send the selected payment method
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post('http://localhost:5000/api/orders', order, config);

            toast.success('Order placed successfully!');
            clearCart();
            toggleCart();

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order.');
        }
    };

    // ... The rest of your component ...
    return (
        <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
             {/* ... cart header and cart items ... */}

            {cartItems.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-total" style={{marginBottom: '20px'}}>
                        <strong>Subtotal: {formatCurrency(cartSubtotal)}</strong>
                    </div>

                    {/* New Payment Method Selector */}
                    <div className="payment-method-selector" style={{marginBottom: '20px'}}>
                        <strong>Payment Method:</strong>
                        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                            <button
                                onClick={() => setPaymentMethod('COD')}
                                className={`btn-full ${paymentMethod === 'COD' ? 'active' : ''}`}
                                style={paymentMethod !== 'COD' ? {background: 'grey'} : {}}
                            >
                                Cash on Delivery
                            </button>
                            <button
                                onClick={() => setPaymentMethod('Razorpay')}
                                className={`btn-full ${paymentMethod === 'Razorpay' ? 'active' : ''}`}
                                style={paymentMethod !== 'Razorpay' ? {background: 'grey'} : {}}
                            >
                                Pay Now
                            </button>
                        </div>
                    </div>

                    <button className="btn-full" onClick={placeOrderHandler}>
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartSidebar;