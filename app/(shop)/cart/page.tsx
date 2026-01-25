// app/cart/page.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart/cartStore';
import { useDeliveryStore } from '@/store/delivery/deliveryStore';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { DeliveryMethodSelector } from '@/components/cart/DeliveryMethodSelector';
import { DeliveryLocationSelector } from '@/components/cart/DeliveryLocationSelector';
import { StoreSelector } from '@/components/cart/StoreSelector';
import { PaymentMethodSelector } from '@/components/cart/PaymentMethodSelector';
import { PaymentSuccessModal } from '@/components/cart/PaymentSuccessModal';
import { ProductCarousel } from '@/feature/carousel-product/ProductCarousel';
import RegisterModal from '@/components/auth/RegisterModal';

type PaymentMethod = 'card' | 'transfer' | 'wallet';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { 
    method, 
    selectedLocationId, 
    selectedStoreId,
    setMethod,
    setSelectedLocation,
    setSelectedStore
  } = useDeliveryStore();
  
  const [isVendorExpanded, setIsVendorExpanded] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [isPaymentFormComplete, setIsPaymentFormComplete] = useState(false);
  
  // Simulación: cambia esto a false para simular usuario no registrado
  const [isUserRegistered] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    // Resetear el estado cuando cambie el método
    setIsPaymentFormComplete(false);
  };

  const handlePaymentFormConfirm = (isComplete: boolean) => {
    setIsPaymentFormComplete(isComplete);
  };

  const handlePaymentComplete = () => {
    // Si no está registrado, mostrar modal de registro
    if (!isUserRegistered) {
      setShowRegisterModal(true);
      return;
    }
    
    // Si está registrado, proceder con el pago
    setShowPaymentSuccess(true);
  };

  const handleModalClose = () => {
    setShowPaymentSuccess(false);
    clearCart();
    setIsPaymentFormComplete(false);
  };

  const handleRegisterClose = () => {
    setShowRegisterModal(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
              <p className="text-gray-600 mb-8">Agrega productos para comenzar tu compra</p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Ir a comprar
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <ProductCarousel 
              titulo="💎 Productos que podrían interesarte"
              filtro="mas-vendidos"
              cardSize="md"
              imageAspect="portrait"
              addToCartBehavior="always"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - Desktop */}
        <h1 className="hidden sm:block text-2xl font-bold text-gray-900 mb-8">Mi Carrito</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna izquierda - Productos y Entrega */}
          <div className="flex-1 space-y-6">
            {/* Lista de productos */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header del vendedor */}
              <button
                onClick={() => setIsVendorExpanded(!isVendorExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">Vendido por</p>
                  <p className="font-semibold text-gray-900">
                    <span className="text-blue-600">JyP</span>
                  </p>
                </div>
                {isVendorExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Lista de items */}
              {isVendorExpanded && (
                <div className="border-t border-gray-200">
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.idProducto} className="p-4">
                        {/* Desktop */}
                        <div className="hidden sm:block">
                          <CartItemCard
                            item={item}
                            onUpdateQuantity={(quantity) => updateQuantity(item.idProducto, quantity)}
                            onRemove={() => removeItem(item.idProducto)}
                            layout="default"
                          />
                        </div>

                        {/* Mobile */}
                        <div className="sm:hidden">
                          <CartItemCard
                            item={item}
                            onUpdateQuantity={(quantity) => updateQuantity(item.idProducto, quantity)}
                            onRemove={() => removeItem(item.idProducto)}
                            layout="compact"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selector de método de entrega */}
            <DeliveryMethodSelector
              selectedMethod={method}
              onMethodChange={setMethod}
            />

            {/* Selector de ubicación o tienda según el método */}
            {method === 'home' ? (
              <DeliveryLocationSelector
                selectedLocationId={selectedLocationId}
                onLocationSelect={setSelectedLocation}
              />
            ) : (
              <StoreSelector
                selectedStoreId={selectedStoreId}
                onStoreSelect={setSelectedStore}
              />
            )}

            {/* Método de pago - solo si hay ubicación/tienda seleccionada */}
            {((method === 'home' && selectedLocationId) || (method === 'store' && selectedStoreId)) && (
              <PaymentMethodSelector 
                selectedMethod={selectedPaymentMethod}
                onMethodChange={handlePaymentMethodChange}
                onPaymentConfirm={handlePaymentFormConfirm}
              />
            )}
          </div>

          {/* Columna derecha - Resumen - Desktop */}
          <div className="hidden lg:block w-full lg:w-96">
            <CartSummary
              items={items}
              onPaymentComplete={handlePaymentComplete}
              freeShippingThreshold={100}
              deliveryMethod={method}
              hasSelectedLocation={selectedLocationId !== null}
              hasSelectedStore={selectedStoreId !== null}
              selectedPaymentMethod={selectedPaymentMethod}
              hasSelectedPaymentMethod={isPaymentFormComplete}
            />
          </div>
        </div>

        {/* Resumen - Mobile (fixed bottom) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <CartSummary
            items={items}
            onPaymentComplete={handlePaymentComplete}
            freeShippingThreshold={100}
            deliveryMethod={method}
            hasSelectedLocation={selectedLocationId !== null}
            hasSelectedStore={selectedStoreId !== null}
            selectedPaymentMethod={selectedPaymentMethod}
            hasSelectedPaymentMethod={isPaymentFormComplete}
          />
        </div>

        {/* Sección de productos recomendados - Compra Rápida Horizontal */}
        <div className="mt-16">
          <ProductCarousel 
            titulo="⚡ Completa tu compra"
            filtro="mas-vendidos"
            layout="horizontal"
            cardSize="sm"
            showColors={false}
            addToCartBehavior="always"
            maxTags={1}
          />
        </div>

        {/* Sección de ofertas */}
        <div className="mt-12 mb-8">
          <ProductCarousel 
            titulo="🔥 Ofertas que no puedes dejar pasar"
            filtro="descuentos"
            cardSize="sm"
            imageAspect="square"
            addToCartBehavior="always"
            maxTags={2}
          />
        </div>

        {/* Espaciado para el footer mobile */}
        <div className="h-32 lg:hidden" />
      </div>

      {/* Modal de pago exitoso */}
      <PaymentSuccessModal
        isOpen={showPaymentSuccess}
        onClose={handleModalClose}
      />

      {/* Modal de registro (solo si isUserRegistered es false) */}
      {showRegisterModal && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4"
          onClick={handleRegisterClose}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar X */}
            <button
              onClick={handleRegisterClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <RegisterModal
              onSwitchLogin={() => {}}
              onSwitchRecovery={() => {}}
              onClose={handleRegisterClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}