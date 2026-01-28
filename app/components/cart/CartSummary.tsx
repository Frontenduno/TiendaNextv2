// components/cart/CartSummary.tsx
'use client';

import React, { useMemo } from 'react';
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
  isUserRegistered?: boolean;
  hasRegisterData?: boolean;
  hasAcceptedPurchaseTerms?: boolean;
  hasValidInvoiceData?: boolean;
  isProcessing?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  onPaymentComplete,
  freeShippingThreshold = 0,
  deliveryMethod = 'home',
  hasSelectedLocation = false,
  hasSelectedStore = false,
  hasSelectedPaymentMethod = false,
  isUserRegistered = true,
  hasRegisterData = false,
  hasAcceptedPurchaseTerms = false,
  hasValidInvoiceData = true,
  isProcessing = false,
}) => {
  const priceInfo = getCartPriceInfo(items, freeShippingThreshold);
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Validación optimizada del botón
  const isButtonDisabled = useMemo(() => {
    if (items.length === 0 || isProcessing) return true;
    
    const hasDeliveryInfo = deliveryMethod === 'home' 
      ? hasSelectedLocation 
      : hasSelectedStore;
    
    return !hasDeliveryInfo || 
           !hasSelectedPaymentMethod || 
           !hasRegisterData || 
           !hasAcceptedPurchaseTerms ||
           !hasValidInvoiceData;
  }, [
    items.length,
    isProcessing,
    deliveryMethod,
    hasSelectedLocation,
    hasSelectedStore,
    hasSelectedPaymentMethod,
    hasRegisterData,
    hasAcceptedPurchaseTerms,
    hasValidInvoiceData
  ]);

  // Mensaje de error optimizado
  const errorMessage = useMemo(() => {
    if (items.length === 0 || isProcessing) return null;
    
    if (!hasRegisterData) return 'Completa tus datos personales para continuar';
    if (deliveryMethod === 'home' && !hasSelectedLocation) return 'Selecciona una dirección de entrega';
    if (deliveryMethod === 'store' && !hasSelectedStore) return 'Selecciona una tienda para recoger';
    if (!hasSelectedPaymentMethod) return 'Selecciona un método de pago';
    if (!hasValidInvoiceData) return 'Completa los datos de facturación';
    if (!hasAcceptedPurchaseTerms) return 'Acepta los términos y condiciones de compra';
    
    return null;
  }, [
    items.length,
    isProcessing,
    hasRegisterData,
    deliveryMethod,
    hasSelectedLocation,
    hasSelectedStore,
    hasSelectedPaymentMethod,
    hasValidInvoiceData,
    hasAcceptedPurchaseTerms
  ]);

  const buttonText = isProcessing 
    ? (isUserRegistered ? "Procesando pago..." : "Procesando tu compra...") 
    : (isUserRegistered ? "Pagar ahora" : "Realizar pago");

  const totalPrice = deliveryMethod === 'store' 
    ? priceInfo.subtotal - priceInfo.totalDiscount 
    : priceInfo.total;

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
            <span className="text-lg font-bold text-gray-900">{formatPrice(totalPrice)}</span>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
          </div>
        </button>
      </div>

      {/* Header - Desktop */}
      <h2 className="hidden sm:block text-lg font-bold text-gray-900 mb-4">Resumen de compra</h2>

      {/* Contenido colapsable */}
      <div className={`${isExpanded ? 'block' : 'hidden'} sm:block`}>
        {/* Beneficios */}
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
          <BenefitItem icon={Check} text={deliveryMethod === 'store' ? 'Recoge gratis en tienda' : priceInfo.hasFreeShipping ? 'Envío gratis en esta compra' : 'Envío en todas tus compras'} />
          <BenefitItem icon={ShieldCheck} text="Garantía de devolución" />
          <BenefitItem icon={Lock} text="Compra 100% segura" />
        </div>

        {/* Desglose de precios */}
        <div className="space-y-3 mb-4">
          <PriceRow 
            label={`Subtotal (${priceInfo.itemsCount} ${priceInfo.itemsCount === 1 ? 'producto' : 'productos'})`} 
            value={formatPrice(priceInfo.subtotal)} 
          />
          {priceInfo.totalDiscount > 0 && (
            <PriceRow 
              label="Descuento" 
              value={`-${formatPrice(priceInfo.totalDiscount)}`} 
              valueClassName="text-green-600" 
            />
          )}
          <PriceRow 
            label={deliveryMethod === 'store' ? 'Recojo' : 'Envío'} 
            value={deliveryMethod === 'store' || priceInfo.hasFreeShipping ? 'Gratis' : formatPrice(priceInfo.shipping)} 
            valueClassName="text-green-600" 
          />
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-gray-200 mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-base font-medium text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
          </div>
          {priceInfo.totalDiscount > 0 && (
            <p className="text-xs text-green-600 text-right">
              Ahorraste {formatPrice(priceInfo.totalDiscount)}
            </p>
          )}
        </div>

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{errorMessage}</p>
          </div>
        )}

        {/* Lista de pasos faltantes */}
        {isButtonDisabled && !isProcessing && items.length > 0 && (
          <div className="mb-4 text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-700 mb-2">Para completar tu compra:</p>
            {!hasRegisterData && <StepItem text="Completa tus datos personales y acepta los términos" />}
            {!(deliveryMethod === 'home' ? hasSelectedLocation : hasSelectedStore) && (
              <StepItem text={`Selecciona ${deliveryMethod === 'home' ? 'una ubicación' : 'una tienda'}`} />
            )}
            {!hasSelectedPaymentMethod && <StepItem text="Completa la información de pago" />}
            {!hasValidInvoiceData && <StepItem text="Completa los datos de facturación (si aplica)" />}
            {!hasAcceptedPurchaseTerms && <StepItem text="Acepta los términos y condiciones de compra" />}
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={onPaymentComplete}
          disabled={isButtonDisabled}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            isButtonDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]'
          }`}
        >
          {buttonText}
        </button>

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

// Componentes helper para reducir repetición
const BenefitItem: React.FC<{ icon: React.ElementType; text: string }> = ({ icon: Icon, text }) => (
  <div className="flex items-start gap-2">
    <Icon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
    <span className="text-sm text-gray-900">{text}</span>
  </div>
);

const PriceRow: React.FC<{ label: string; value: string; valueClassName?: string }> = ({ 
  label, 
  value, 
  valueClassName = 'text-gray-900' 
}) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`text-sm font-medium ${valueClassName}`}>{value}</span>
  </div>
);

const StepItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
    <span>{text}</span>
  </div>
);