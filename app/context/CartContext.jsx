'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    // Cart state
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount (client only)
    useEffect(() => {
        if (typeof window === 'undefined') return; // safety for SSR

        const savedCart = window.localStorage.getItem('urban-veins-cart');

        if (savedCart) {
            // We intentionally hydrate React state from an external system (localStorage)
            // eslint-disable-next-line
            setCartItems(JSON.parse(savedCart));
        }

        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes (after initial load)
    useEffect(() => {
        if (!isLoaded) return;
        if (typeof window === 'undefined') return;

        window.localStorage.setItem('urban-veins-cart', JSON.stringify(cartItems));
    }, [cartItems, isLoaded]);

    // Add to Cart Logic
    const addToCart = (product, size, color, quantity) => {
        setCartItems((prev) => {
            // Check if item with same ID, Color, and Size exists
            const existingItem = prev.find(
                (item) =>
                    item.slug === product.slug &&
                    item.selectedSize === size &&
                    item.selectedColor === color
            );

            if (existingItem) {
                return prev.map((item) =>
                    item.slug === product.slug &&
                        item.selectedSize === size &&
                        item.selectedColor === color
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // Add new item
            return [
                ...prev,
                { ...product, selectedSize: size, selectedColor: color, quantity },
            ];
        });
    };

    // Remove from Cart
    const removeFromCart = (slug, size, color) => {
        setCartItems((prev) =>
            prev.filter(
                (item) =>
                    !(
                        item.slug === slug &&
                        item.selectedSize === size &&
                        item.selectedColor === color
                    )
            )
        );
    };

    // Update Quantity
    const updateQuantity = (slug, size, color, newQty) => {
        if (newQty < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.slug === slug &&
                    item.selectedSize === size &&
                    item.selectedColor === color
                    ? { ...item, quantity: newQty }
                    : item
            )
        );
    };

    // Derived State
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                cartCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
