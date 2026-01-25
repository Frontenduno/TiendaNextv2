// components/cart/CartSummary.tsx
'use client';

import React from 'react';
import { Check, ShieldCheck, Lock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CartItem } from '@/interfaces/cart';
import { getCartPriceInfo, formatPrice } from '@/utils/pricing';

type PaymentMethod = 'card' | 'transfer' | 'wallet';

interface CartSummaryProps {
  items: CartItem[];
  onCheckout?: () => void;
  onPaymentComplete?: () => void;
  freeShippingThreshold?: number;
  deliveryMethod?: 'home' | 'store';
  hasSelectedLocation?: boolean;
  hasSelectedStore?: boolean;
  selectedPaymentMethod?: PaymentMethod;
  hasSelectedPaymentMethod?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  onCheckout,
  onPaymentComplete,
  freeShippingThreshold = 0,
  deliveryMethod = 'home',
  hasSelectedLocation = false,
  hasSelectedStore = false,
  hasSelectedPaymentMethod = false,
}) => {
  const priceInfo = getCartPriceInfo(items, freeShippingThreshold);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Determinar si puede proceder al checkout
  const canCheckout = items.length > 0 && (
    (deliveryMethod === 'home' && hasSelectedLocation) ||
    (deliveryMethod === 'store' && hasSelectedStore)
  );

  // Determinar si puede proceder al pago
  const canPay = canCheckout && hasSelectedPaymentMethod;

  // Mensaje de error según el caso
  const getErrorMessage = () => {
    if (items.length === 0) return null;
    if (deliveryMethod === 'home' && !hasSelectedLocation) {
      return 'Selecciona una dirección de entrega';
    }
    if (deliveryMethod === 'store' && !hasSelectedStore) {
      return 'Selecciona una tienda para recoger';
    }
    if (!hasSelectedPaymentMethod) {
      return 'Selecciona un método de pago';
    }
    return null;
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simular procesamiento de pago
    setTimeout(() => {
      setIsProcessing(false);
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 1500);
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 sm:sticky sm:top-4">
      {/* Header - Mobile colapsable */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between mb-3"
        >
          <h2 className="text-lg font-bold text-gray-900">Resumen de compra</h2>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(deliveryMethod === 'store' 
              ? priceInfo.subtotal - priceInfo.totalDiscount 
              : priceInfo.total
            )}</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </button>
      </div>

      {/* Header - Desktop */}
      <h2 className="hidden sm:block text-lg font-bold text-gray-900 mb-4">Resumen de compra</h2>

      {/* Contenido colapsable en móvil, siempre visible en desktop */}
      <div className={`${isExpanded ? 'block' : 'hidden'} sm:block`}>

      {/* Beneficios */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-900">
            {deliveryMethod === 'store' 
              ? 'Recoge gratis en tienda' 
              : priceInfo.hasFreeShipping 
                ? 'Envío gratis en esta compra' 
                : 'Envío en todas tus compras'
            }
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
          <span className="text-sm text-gray-600">
            Subtotal ({priceInfo.itemsCount} {priceInfo.itemsCount === 1 ? 'producto' : 'productos'})
          </span>
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
          <span className="text-sm text-gray-600">
            {deliveryMethod === 'store' ? 'Recojo' : 'Envío'}
          </span>
          <span className="text-sm font-medium text-green-600">
            {deliveryMethod === 'store' || priceInfo.hasFreeShipping 
              ? 'Gratis' 
              : formatPrice(priceInfo.shipping)
            }
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-200 mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(deliveryMethod === 'store' 
              ? priceInfo.subtotal - priceInfo.totalDiscount 
              : priceInfo.total
            )}
          </span>
        </div>
        {priceInfo.totalDiscount > 0 && (
          <p className="text-xs text-green-600 text-right">
            Ahorraste {formatPrice(priceInfo.totalDiscount)}
          </p>
        )}
      </div>

      {/* Mensaje de error/advertencia */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{errorMessage}</p>
        </div>
      )}

      {/* Botón de compra/pago */}
      {canCheckout && !hasSelectedPaymentMethod && (
        <button
          onClick={onCheckout}
          disabled={!canCheckout}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar compra
        </button>
      )}

      {canPay && (
        <button
          onClick={handlePayment}
          disabled={!canPay || isProcessing}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Procesando pago...' : 'Pagar ahora'}
        </button>
      )}

      {/* Nota de envío gratis */}
      {deliveryMethod === 'home' && !priceInfo.hasFreeShipping && freeShippingThreshold > 0 && (
        <p className="text-xs text-gray-600 text-center mt-3">
          Agrega {formatPrice(freeShippingThreshold - priceInfo.subtotal)} más para envío gratis
        </p>
      )}
      </div>
    </div>
  );
};