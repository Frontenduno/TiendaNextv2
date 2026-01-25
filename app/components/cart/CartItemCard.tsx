// components/cart/CartItemCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/interfaces/cart';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { getCartItemPriceInfo, getItemSubtotal, getItemOriginalSubtotal } from '@/utils/pricing';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  showActions?: boolean;
  layout?: 'default' | 'compact';
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  showActions = true,
  layout = 'default',
}) => {
  const priceInfo = getCartItemPriceInfo(item);
  const subtotal = getItemSubtotal(item);
  const originalSubtotal = getItemOriginalSubtotal(item);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.cantidad + delta;
    if (newQuantity >= 1 && newQuantity <= item.stockDisponible) {
      onUpdateQuantity(newQuantity);
    }
  };

  // Layout compacto (mobile)
  if (layout === 'compact') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3 relative">
        <div className="flex gap-3">
          {/* Imagen */}
          <Link href={`/product/${item.idProducto}`} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={item.imagen}
              alt={item.nombre}
              fill
              className="object-cover"
              sizes="80px"
            />
          </Link>

          {/* Info del producto */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-1">
              <Link href={`/product/${item.idProducto}`} className="flex-1">
                {item.marca && (
                  <p className="text-xs text-gray-500 uppercase mb-0.5">{item.marca}</p>
                )}
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {item.nombre}
                </h3>
              </Link>

              {/* Menú de opciones */}
              {showActions && (
                <button
                  onClick={onRemove}
                  className="text-gray-400 hover:text-red-600 p-1"
                  aria-label="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Color y opción adicional */}
            <p className="text-xs text-gray-600 mb-2">
              Color: <span className="font-medium">{item.color}</span>
              {item.opcionAdicional && ` • ${item.opcionAdicional}`}
            </p>

            {/* Precio y controles */}
            <div className="flex items-end justify-between gap-2">
              <PriceDisplay
                finalPrice={subtotal}
                originalPrice={priceInfo.hasDiscount ? originalSubtotal : undefined}
                discountPercentage={priceInfo.discountPercentage}
                size="sm"
                orientation="vertical"
                showBadge={true}
              />

              {/* Controles de cantidad */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={item.cantidad <= 1}
                  className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 py-1 text-sm font-medium text-gray-900 border-x border-gray-300">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={item.cantidad >= item.stockDisponible}
                  className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Límite de stock */}
            <p className="text-xs text-gray-500 mt-1">
              Máx {item.stockDisponible} unidades
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Layout default (desktop)
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Imagen */}
        <Link href={`/product/${item.idProducto}`} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={item.imagen}
            alt={item.nombre}
            fill
            className="object-cover hover:scale-105 transition-transform"
            sizes="96px"
          />
        </Link>

        {/* Información del producto */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/product/${item.idProducto}`} className="flex-1 min-w-0 mr-4">
              {item.marca && (
                <p className="text-xs text-gray-500 uppercase mb-1">{item.marca}</p>
              )}
              <h3 className="text-base font-medium text-gray-900 hover:text-blue-600 transition line-clamp-2">
                {item.nombre}
              </h3>
            </Link>

            {/* Botón eliminar */}
            {showActions && (
              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-600 p-1 flex-shrink-0"
                aria-label="Eliminar producto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Color y opción adicional */}
          <p className="text-sm text-gray-600 mb-3">
            Color: <span className="font-medium">{item.color}</span>
            {item.opcionAdicional && ` • ${item.opcionAdicional}`}
          </p>

          {/* Precio y controles en la misma línea */}
          <div className="flex items-center justify-between">
            {/* Precio */}
            <PriceDisplay
              finalPrice={subtotal}
              originalPrice={priceInfo.hasDiscount ? originalSubtotal : undefined}
              discountPercentage={priceInfo.discountPercentage}
              size="md"
              orientation="horizontal"
              showBadge={true}
            />

            {/* Controles de cantidad */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={item.cantidad <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-base font-medium text-gray-900 border-x border-gray-300">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={item.cantidad >= item.stockDisponible}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Máx {item.stockDisponible} unidades
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};