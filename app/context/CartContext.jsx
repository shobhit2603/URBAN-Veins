'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Import session hook

const CartContext = createContext();

export function CartProvider({ children }) {
    const { data: session, status } = useSession();
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // --- HELPER: Map Backend Data to Frontend Structure ---
    // Backend returns: { _id, quantity, color, size, product: { name, price... } }
    // Frontend needs: { cartItemId, quantity, selectedColor, selectedSize, name, price... }
    const mapBackendCartToFrontend = (backendCart) => {
        return backendCart.map((item) => {
            // If product is null (deleted product), skip or handle gracefully
            if (!item.product) return null; 
            return {
                ...item.product, // Spread product details (name, price, images, slug)
                cartItemId: item._id, // IMPORTANT: The ID of the item *inside* the cart
                quantity: item.quantity,
                selectedColor: item.color,
                selectedSize: item.size,
                // Ensure we keep the product ID accessible
                productId: item.product._id 
            };
        }).filter(Boolean); // Remove nulls
    };

    // --- 1. LOAD CART (DB vs LocalStorage) ---
    useEffect(() => {
        if (status === 'loading') return; // Wait for auth check

        const loadCart = async () => {
            if (status === 'authenticated') {
                // LOGGED IN: Fetch from API
                try {
                    const res = await fetch('/api/cart');
                    if (res.ok) {
                        const data = await res.json();
                        setCartItems(mapBackendCartToFrontend(data.cart));
                    }
                } catch (err) {
                    console.error("Failed to load cart from DB:", err);
                }
            } else {
                // GUEST: Load from LocalStorage
                const savedCart = window.localStorage.getItem('urban-veins-cart');
                if (savedCart) {
                    setCartItems(JSON.parse(savedCart));
                }
            }
            setIsLoaded(true);
        };

        loadCart();
    }, [status]); // Re-run when login status changes

    // --- 2. SYNC TO LOCALSTORAGE (Guest Only) ---
    useEffect(() => {
        if (!isLoaded) return;
        if (status === 'authenticated') return; // Don't save to LS if logged in

        window.localStorage.setItem('urban-veins-cart', JSON.stringify(cartItems));
    }, [cartItems, isLoaded, status]);

    // --- 3. ADD TO CART ---
    const addToCart = async (product, size, color, quantity) => {
        if (status === 'authenticated') {
            // SERVER Logic
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId: product._id, // Mongoose ID
                        quantity,
                        color,
                        size
                    }) 
                });
                if (res.ok) {
                    const data = await res.json();
                    setCartItems(mapBackendCartToFrontend(data.cart));
                }
            } catch (err) {
                console.error("Add to API failed", err);
            }
        } else {
            // LOCAL Logic (Your existing code)
            setCartItems((prev) => {
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

                return [
                    ...prev,
                    { ...product, selectedSize: size, selectedColor: color, quantity },
                ];
            });
        }
    };

    // --- 4. REMOVE FROM CART ---
    const removeFromCart = async (slug, size, color) => {
        if (status === 'authenticated') {
            // SERVER Logic
            // We need the 'cartItemId' to delete from backend. 
            // We find it in our current state based on selection.
            const itemToRemove = cartItems.find(
                item => item.slug === slug && item.selectedSize === size && item.selectedColor === color
            );

            if (!itemToRemove || !itemToRemove.cartItemId) return;

            try {
                const res = await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemId: itemToRemove.cartItemId })
                });
                if (res.ok) {
                    const data = await res.json();
                    setCartItems(mapBackendCartToFrontend(data.cart));
                }
            } catch (err) {
                console.error("Remove from API failed", err);
            }
        } else {
            // LOCAL Logic
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
        }
    };

    // --- 5. UPDATE QUANTITY ---
    const updateQuantity = async (slug, size, color, newQty) => {
        if (newQty < 1) return;

        if (status === 'authenticated') {
            // SERVER Logic
            const itemToUpdate = cartItems.find(
                item => item.slug === slug && item.selectedSize === size && item.selectedColor === color
            );

            if (!itemToUpdate || !itemToUpdate.cartItemId) return;

            try {
                const res = await fetch('/api/cart', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        itemId: itemToUpdate.cartItemId,
                        quantity: newQty 
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    setCartItems(mapBackendCartToFrontend(data.cart));
                }
            } catch (err) {
                console.error("Update API failed", err);
            }
        } else {
            // LOCAL Logic
            setCartItems((prev) =>
                prev.map((item) =>
                    item.slug === slug &&
                        item.selectedSize === size &&
                        item.selectedColor === color
                        ? { ...item, quantity: newQty }
                        : item
                )
            );
        }
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
                isLoaded, // Useful if you want to show a loading spinner on cart page
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);