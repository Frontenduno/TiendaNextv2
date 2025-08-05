// src/context/CartContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { Product, CartItem, sampleProducts } from '../data/products';

export interface CartContextType {
    cartItems: CartItem[];
    addItem: (productId: number, quantity?: number, selectedSize?: string, selectedColorId?: string) => void;
    removeItem: (productId: number) => void;
    incrementQuantity: (productId: number) => void;
    decrementQuantity: (productId: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    displayedCart: (Product & { quantity: number; selectedSize?: string; selectedColorId?: string })[];
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            let parsedCart: CartItem[] = [];
            if (savedCart) {
                try {
                    const tempCart = JSON.parse(savedCart);
                    if (Array.isArray(tempCart)) {
                        parsedCart = tempCart;
                    } else {
                        console.warn("Los datos del carrito almacenados en localStorage no son un array. Reiniciando el carrito.");
                    }
                } catch (e) {
                    console.error("Error al parsear el carrito de localStorage:", e);
                }
            }
            setCartItems(parsedCart);
            setIsClient(true);
        }
    }, []);

    useEffect(() => {
        if (isClient && typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isClient]);

    const getProductDetails = useCallback((productId: number): Product | undefined => {
        return sampleProducts.find(p => p.id === productId);
    }, []);

    const displayedCart = useMemo(() => {
        if (!isClient) return [];

        return cartItems
            .map(cartItem => {
                const productDetails = getProductDetails(cartItem.productId);
                if (!productDetails) {
                    console.warn(`Producto con ID ${cartItem.productId} no encontrado.`);
                    return null;
                }
                return { ...productDetails, quantity: cartItem.quantity, selectedSize: cartItem.selectedSize, selectedColorId: cartItem.selectedColorId };
            })
            .filter(Boolean) as (Product & { quantity: number; selectedSize?: string; selectedColorId?: string })[];
    }, [cartItems, getProductDetails, isClient]);

    const totalItems = useMemo(() => displayedCart.reduce((sum, item) => sum + item.quantity, 0), [displayedCart]);
    const subtotal = useMemo(() => displayedCart.reduce((sum, item) => sum + item.price * item.quantity, 0), [displayedCart]);

    const addItem = useCallback((productId: number, quantity: number = 1, selectedSize?: string, selectedColorId?: string) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item =>
                item.productId === productId &&
                item.selectedSize === selectedSize &&
                item.selectedColorId === selectedColorId
            );
            const productDetails = getProductDetails(productId);

            if (!productDetails) {
                console.warn(`No se puede añadir el producto con ID ${productId}: Detalles no encontrados.`);
                return prevItems;
            }

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                const currentQuantity = updatedItems[existingItemIndex].quantity;
                const newQuantity = currentQuantity + quantity;
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: Math.min(newQuantity, productDetails.stock)
                };
                return updatedItems;
            } else {
                return [...prevItems, { productId, quantity: Math.min(quantity, productDetails.stock), selectedSize, selectedColorId }];
            }
        });
    }, [getProductDetails]);

    const removeItem = useCallback((productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    }, []);

    const incrementQuantity = useCallback((productId: number) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.productId === productId) {
                    const productDetails = getProductDetails(productId);
                    if (productDetails && item.quantity < productDetails.stock) {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                }
                return item;
            });
            return updatedItems;
        });
    }, [getProductDetails]);

    const decrementQuantity = useCallback((productId: number) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems
                .map(item => {
                    if (item.productId === productId) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                })
                .filter(item => item.quantity > 0);
            return updatedItems;
        });
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const contextValue = useMemo(() => ({
        cartItems,
        addItem,
        removeItem,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        totalItems,
        subtotal,
        displayedCart,
    }), [cartItems, addItem, removeItem, incrementQuantity, decrementQuantity, clearCart, totalItems, subtotal, displayedCart]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}