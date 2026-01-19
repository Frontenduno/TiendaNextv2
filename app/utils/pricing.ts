// utils/pricing.ts
import { Producto, Etiqueta } from '@/interfaces/products';

export interface PriceInfo {
  hasDiscount: boolean;
  originalPrice: number;
  finalPrice: number;
  discountPercentage: number;
}

export const getPriceInfo = (producto: Producto): PriceInfo => {
  const discountTag = producto.etiquetas.find((e: Etiqueta) => 
    e.descripcion.toLowerCase().includes('descuento') || 
    e.descripcion.toLowerCase().includes('oferta')
  );

  if (!discountTag) {
    return {
      hasDiscount: false,
      originalPrice: producto.precio,
      finalPrice: producto.precio,
      discountPercentage: 0,
    };
  }

  const percentMatch = discountTag.descripcion.match(/(\d+)%?/);
  const discountPercentage = percentMatch ? parseInt(percentMatch[1]) : 20;
  const finalPrice = producto.precio * (1 - discountPercentage / 100);

  return {
    hasDiscount: true,
    originalPrice: producto.precio,
    finalPrice,
    discountPercentage,
  };
};