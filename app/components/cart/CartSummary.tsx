// components/cart/CartSummary.tsx
'use client';

import React from 'react';
import { Check, ShieldCheck, Lock } from 'lucide-react';
import { CartItem } from '@/interfaces/cart';
import { getCartPriceInfo, formatPrice } from '@/utils/pricing';

interface CartSummaryProps {
  items: CartItem[];
  onCheckout?: () => void;
  freeShippingThreshold?: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  onCheckout,
  freeShippingThreshold = 0,
}) => {
  const priceInfo = getCartPriceInfo(items, freeShippingThreshold);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 sticky top-4">
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen de compra</h2>

      {/* Beneficios */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-900">
            {priceInfo.hasFreeShipping ? 'Envío gratis en esta compra' : 'Envío en todas tus compras'}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-900">Garantía de devolución</span>
        </div>
        <div className="flex items-start gap-2">
          <Lock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-900">Compra 100% segura</span>
        </div>
      </div>

      {/* Desglose de precios */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Subtotal ({priceInfo.itemsCount} {priceInfo.itemsCount === 1 ? 'producto' : 'productos'})</span>
          <span className="text-sm font-medium text-gray-900">{formatPrice(priceInfo.subtotal)}</span>
        </div>

        {priceInfo.totalDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Descuento</span>
            <span className="text-sm font-medium text-green-600">
              -{formatPrice(priceInfo.totalDiscount)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Envío</span>
          <span className="text-sm font-medium text-green-600">
            {priceInfo.hasFreeShipping ? 'Gratis' : formatPrice(priceInfo.shipping)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-200 mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(priceInfo.total)}</span>
        </div>
        {priceInfo.totalDiscount > 0 && (
          <p className="text-xs text-green-600 text-right">
            Ahorraste {formatPrice(priceInfo.totalDiscount)}
          </p>
        )}
      </div>

      {/* Botón de compra */}
      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar compra
      </button>

      {/* Nota de envío gratis */}
      {!priceInfo.hasFreeShipping && freeShippingThreshold > 0 && (
        <p className="text-xs text-gray-600 text-center mt-3">
          Agrega {formatPrice(freeShippingThreshold - priceInfo.subtotal)} más para envío gratis
        </p>
      )}
    </div>
  );
};