// utils/pricing.ts
import { Producto } from '@/interfaces/products';
import { CartItem } from '@/interfaces/cart';

export interface PriceInfo {
  originalPrice: number;
  finalPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  savings: number;
}

export interface CartPriceInfo {
  subtotal: number;
  totalDiscount: number;
  shipping: number;
  total: number;
  itemsCount: number;
  hasFreeShipping: boolean;
}

/**
 * Obtiene información de precio de un producto
 */
export function getPriceInfo(producto: Producto): PriceInfo {
  const originalPrice = producto.precioBase;
  const finalPrice = producto.precioDescuento || producto.precioBase;
  const hasDiscount = producto.precioDescuento !== null && producto.precioDescuento < producto.precioBase;
  
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;
  
  const savings = hasDiscount ? originalPrice - finalPrice : 0;

  return {
    originalPrice,
    finalPrice,
    hasDiscount,
    discountPercentage,
    savings,
  };
}

/**
 * Obtiene información de precio de un item del carrito
 */
export function getCartItemPriceInfo(item: CartItem): PriceInfo {
  const originalPrice = item.precioOriginal || item.precio;
  const finalPrice = item.precio;
  const hasDiscount = item.precioOriginal !== undefined && item.precioOriginal > item.precio;
  
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;
  
  const savings = hasDiscount ? originalPrice - finalPrice : 0;

  return {
    originalPrice,
    finalPrice,
    hasDiscount,
    discountPercentage,
    savings,
  };
}

/**
 * Calcula el subtotal de un item (precio × cantidad)
 */
export function getItemSubtotal(item: CartItem): number {
  return item.precio * item.cantidad;
}

/**
 * Calcula el subtotal original de un item (antes de descuento)
 */
export function getItemOriginalSubtotal(item: CartItem): number {
  const originalPrice = item.precioOriginal || item.precio;
  return originalPrice * item.cantidad;
}

/**
 * Calcula los ahorros de un item
 */
export function getItemSavings(item: CartItem): number {
  if (!item.precioOriginal || item.precioOriginal <= item.precio) return 0;
  return (item.precioOriginal - item.precio) * item.cantidad;
}

/**
 * Calcula el resumen de precios del carrito completo
 */
export function getCartPriceInfo(items: CartItem[], freeShippingThreshold: number = 0): CartPriceInfo {
  const subtotal = items.reduce((sum, item) => sum + getItemSubtotal(item), 0);
  const originalSubtotal = items.reduce((sum, item) => sum + getItemOriginalSubtotal(item), 0);
  const totalDiscount = originalSubtotal - subtotal;
  
  // Envío gratis si algún producto tiene mensajeEnvio="Envío gratis" o si supera el umbral
  const hasFreeShipping = items.some(item => 
    item.mensajeEnvio?.toLowerCase().includes('envío gratis')
  ) || (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold);
  
  const shipping = hasFreeShipping ? 0 : 0; // Puedes configurar el costo de envío aquí
  const total = subtotal + shipping;
  const itemsCount = items.reduce((sum, item) => sum + item.cantidad, 0);

  return {
    subtotal,
    totalDiscount,
    shipping,
    total,
    itemsCount,
    hasFreeShipping,
  };
}

/**
 * Formatea un precio en soles peruanos
 */
export function formatPrice(price: number): string {
  return `S/ ${price.toFixed(2)}`;
}

/**
 * Formatea un porcentaje de descuento
 */
export function formatDiscount(percentage: number): string {
  return `-${percentage}%`;
}