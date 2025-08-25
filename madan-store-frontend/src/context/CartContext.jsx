// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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

    const addToCart = (product, qtyToAdd = 1) => {
        const existingItem = cartItems.find(item => item._id === product._id);

        if (existingItem) {
            const newQty = existingItem.qty + qtyToAdd;
            if (newQty > product.stock) {
                toast.error(`Sorry, only ${product.stock} units of ${product.name} are available.`);
                return;
            }
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === product._id ? { ...item, qty: newQty } : item
                )
            );
            toast.success(`${qtyToAdd} more ${product.name} added to cart!`);
        } else {
            if (qtyToAdd > product.stock) {
                toast.error(`Sorry, only ${product.stock} units of ${product.name} are available.`);
                return;
            }
            setCartItems(prevItems => [...prevItems, { ...product, qty: qtyToAdd }]);
            toast.success(`${product.name} added to cart!`);
        }
    };
    
    const decrementCartItem = (productId) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item._id === productId) {
                    const newQty = item.qty - 1;
                    return newQty > 0 ? { ...item, qty: newQty } : null;
                }
                return item;
            }).filter(Boolean); // Filter out null items (items with quantity 0)
        });
    };


    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    const updateCartQuantity = (productId, newQty) => {
        const itemToUpdate = cartItems.find(item => item._id === productId);

        if (newQty > itemToUpdate.stock) {
            toast.error(`Only ${itemToUpdate.stock} units of ${itemToUpdate.name} are available.`);
            return;
        }

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
            decrementCartItem,
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