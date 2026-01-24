// app/cart/page.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart/cartStore';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { ProductCarousel } from '@/feature/carousel-product/ProductCarousel';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [isVendorExpanded, setIsVendorExpanded] = useState(true);

  const handleCheckout = () => {
    // Lógica para proceder al checkout
    console.log('Proceeding to checkout...');
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

          {/* Carrusel de productos sugeridos cuando el carrito está vacío */}
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
          {/* Lista de productos */}
          <div className="flex-1 space-y-4">
            {/* Sección por vendedor */}
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
                  {/* Items */}
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
          </div>

          {/* Resumen - Desktop */}
          <div className="hidden lg:block w-full lg:w-96">
            <CartSummary
              items={items}
              onCheckout={handleCheckout}
              freeShippingThreshold={100}
            />
          </div>
        </div>

        {/* Resumen - Mobile (fixed bottom) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <CartSummary
            items={items}
            onCheckout={handleCheckout}
            freeShippingThreshold={100}
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
    </div>
  );
}