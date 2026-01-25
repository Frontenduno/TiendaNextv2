// app/profile/components/PurchaseDetailModal.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { X, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import { CompraHistorial } from '@/interfaces/purchase-history';

interface Props {
  purchase: CompraHistorial;
  onClose: () => void;
}

export default function PurchaseDetailModal({ purchase, onClose }: Props) {
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detalles de la Compra</h2>
            <p className="text-sm text-gray-600 mt-1">{purchase.numeroOrden}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Estado y fecha */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Fecha de compra</p>
                <p className="font-semibold text-gray-900">
                  {new Date(purchase.fecha).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(purchase.estado)}`}>
              {getStatusText(purchase.estado)}
            </span>
          </div>

          {/* Fecha de entrega si está entregado */}
          {purchase.estado === 'entregado' && purchase.fechaEntrega && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-green-600" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Entregado el:</span>{' '}
                  {new Date(purchase.fechaEntrega).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Productos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-gray-400" />
              <h3 className="font-bold text-gray-900">Productos</h3>
            </div>
            <div className="space-y-3">
              {purchase.productos.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.nombre}</h4>
                    {item.color && (
                      <p className="text-sm text-gray-600 mt-1">Color: {item.color}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">Cantidad: {item.cantidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">S/ {item.precio.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dirección de entrega */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={20} className="text-gray-400" />
              <h3 className="font-bold text-gray-900">Dirección de entrega</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                {purchase.direccionEntrega.direccion}, {purchase.direccionEntrega.distrito}, {purchase.direccionEntrega.ciudad}
              </p>
              {purchase.direccionEntrega.referencia && (
                <p className="text-sm text-gray-600 mt-2">
                  Referencia: {purchase.direccionEntrega.referencia}
                </p>
              )}
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={20} className="text-gray-400" />
              <h3 className="font-bold text-gray-900">Método de pago</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{purchase.metodoPago}</p>
            </div>
          </div>

          {/* Resumen de costos */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>S/ {purchase.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Envío</span>
              <span>S/ {purchase.envio.toFixed(2)}</span>
            </div>
            {purchase.descuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-S/ {purchase.descuento.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>S/ {purchase.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}