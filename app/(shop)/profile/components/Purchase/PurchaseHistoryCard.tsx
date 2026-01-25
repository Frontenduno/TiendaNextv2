// app/profile/components/PurchaseHistoryCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { Calendar, Package, Eye } from 'lucide-react';
import { CompraHistorial } from '@/interfaces/purchase-history';

interface Props {
  purchase: CompraHistorial;
  onViewDetails: (purchase: CompraHistorial) => void;
}

export default function PurchaseHistoryCard({ purchase, onViewDetails }: Props) {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return 'Entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all overflow-hidden">
      {/* Header de la tarjeta */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
              <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">
                {new Date(purchase.fecha).toLocaleDateString('es-PE', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              {purchase.numeroOrden}
            </div>
          </div>
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getStatusColor(purchase.estado)}`}>
            {getStatusText(purchase.estado)}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 sm:p-6">
        {/* Mobile Layout */}
        <div className="sm:hidden space-y-3">
          <div className="flex gap-3">
            {/* Imagen del primer producto */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
              <Image
                src={purchase.productos[0].imagen}
                alt={purchase.productos[0].nombre}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            {/* Info del producto */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">
                {purchase.productos[0].nombre}
              </h3>
              {purchase.productos.length > 1 && (
                <span className="text-gray-500 text-xs">
                  +{purchase.productos.length - 1} producto{purchase.productos.length > 2 ? 's' : ''} más
                </span>
              )}
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-2">
                <Package size={12} />
                <span>{purchase.productos.reduce((sum, item) => sum + item.cantidad, 0)} producto(s)</span>
              </div>
            </div>
          </div>

          {/* Total y botón */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Total</p>
              <p className="text-xl font-bold text-gray-900">
                S/ {purchase.total.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => onViewDetails(purchase)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Eye size={16} />
              Ver detalles
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-start gap-6">
          {/* Imagen del primer producto */}
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
            <Image
              src={purchase.productos[0].imagen}
              alt={purchase.productos[0].nombre}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">
              {purchase.productos[0].nombre}
              {purchase.productos.length > 1 && (
                <span className="text-gray-500 font-normal ml-2">
                  +{purchase.productos.length - 1} producto{purchase.productos.length > 2 ? 's' : ''} más
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Package size={14} />
              <span>{purchase.productos.reduce((sum, item) => sum + item.cantidad, 0)} producto(s)</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              S/ {purchase.total.toFixed(2)}
            </div>
          </div>

          {/* Botón ver detalles */}
          <button
            onClick={() => onViewDetails(purchase)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Eye size={18} />
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}