// src/components/CartSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import formatCurrency from '../utils/formatCurrency.js';
import axios from 'axios';

const CartSidebar = ({ isCartOpen, toggleCart }) => {
    const { cartItems, removeFromCart, updateCartQuantity, cartSubtotal, clearCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const checkoutHandler = async () => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        try {
            const order = {
                orderItems: cartItems.map(item => ({
                    ...item,
                    product: item._id, // Ensure product ID is included
                })),
                totalPrice: cartSubtotal,
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/orders', order, config);

            alert('Order placed successfully!');
            clearCart();
            toggleCart(); // Close the cart sidebar
            console.log('Created Order:', data);

        } catch (error) {
            alert('Failed to place order.');
            console.error(error);
        }
    };

    // ... (The rest of your JSX remains the same, but update the checkout button)
    return (
        <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
            {/* ... (cart header and cart items) ... */}
            {cartItems.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-total">
                        <strong>Subtotal: {formatCurrency(cartSubtotal)}</strong>
                    </div>
                    <button className="btn btn--primary btn--full-width" onClick={checkoutHandler}>
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartSidebar;