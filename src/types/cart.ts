// src/types/cart.ts

import { Product } from '@/data/products'; // Asegúrate de que esta ruta sea correcta para tu Product

// Interfaz para un ítem del carrito tal como se muestra en la UI.
// Extiende la interfaz Product para incluir TODAS sus propiedades,
// y añade las propiedades específicas del carrito (cantidad, talla, color).
export interface DisplayedCartItem extends Product {
    quantity: number;
    selectedSize?: string;
    selectedColorId?: string;
}

// Interfaz para un ítem del carrito tal como se almacena (más simple).
// Usado en CartContext para la gestión interna del carrito.
export interface CartItem {
    productId: number; // Referencia al 'id' del Product
    quantity: number;
    selectedSize?: string;
    selectedColorId?: string;
}

// Interfaz para la estructura completa del carrito.
export interface Cart {
    items: CartItem[];
}