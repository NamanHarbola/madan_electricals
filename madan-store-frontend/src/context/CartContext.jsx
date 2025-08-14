// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    // Load cart items from localStorage, or start with an empty array
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart items from localStorage", error);
            return [];
        }
    });

    // Save cart items to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const exist = prevItems.find(item => item._id === product._id);
            if (exist) {
                // If item exists, update its quantity
                return prevItems.map(item =>
                    item._id === product._id ? { ...item, qty: item.qty + 1 } : item
                );
            } else {
                // If item doesn't exist, add it to the cart with quantity 1
                return [...prevItems, { ...product, qty: 1 }];
            }
        });
        // We can remove the alert for a smoother user experience
        // alert(`${product.name} added to cart!`);
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    const updateCartQuantity = (productId, newQty) => {
        if (newQty <= 0) {
            removeFromCart(productId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === productId ? { ...item, qty: newQty } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartSubtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
            cartSubtotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to easily use the cart context
export const useCart = () => {
    return useContext(CartContext);
};