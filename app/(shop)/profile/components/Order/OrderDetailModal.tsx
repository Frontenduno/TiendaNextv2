// app/profile/components/OrderDetailModal.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { X, Package, MapPin, CreditCard, Calendar, Truck, Clock } from 'lucide-react';
import { OrdenEnProceso } from '@/interfaces/orders-in-progress';

interface Props {
  order: OrdenEnProceso;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: Props) {
  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case 'procesando':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          text: 'Procesando',
        };
      case 'en_camino':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          text: 'En camino',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          text: estado,
        };
    }
  };

  const statusInfo = getStatusInfo(order.estado);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detalles del Pedido</h2>
            <p className="text-sm text-gray-600 mt-1">{order.numeroOrden}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Estado y fechas */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Fecha de pedido</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.fecha).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Entrega estimada</p>
                <p className="font-semibold text-green-600">
                  {new Date(order.tracking.fechaEntregaEstimada).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Estado actual y tracking */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-600" />
                <span className="font-semibold text-gray-900">Estado actual:</span>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold border ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
            </div>
            <div className="pt-3 border-t border-blue-200 space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Código:</span> {order.tracking.codigoSeguimiento}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Empresa:</span> {order.tracking.empresa}
              </p>
            </div>
            
            {/* Historial de seguimiento */}
            {order.tracking.historial && order.tracking.historial.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Historial de seguimiento</h4>
                <div className="space-y-3">
                  {order.tracking.historial.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        {index < order.tracking.historial.length - 1 && (
                          <div className="w-0.5 h-full bg-blue-300 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="font-semibold text-sm text-gray-900">{item.estado}</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {new Date(item.fecha).toLocaleString('es-PE', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">{item.descripcion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Productos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-gray-400" />
              <h3 className="font-bold text-gray-900">Productos</h3>
            </div>
            <div className="space-y-3">
              {order.productos.map((item, index) => (
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
                {order.direccionEnvio.direccion}, {order.direccionEnvio.distrito}, {order.direccionEnvio.ciudad}
              </p>
              {order.direccionEnvio.referencia && (
                <p className="text-sm text-gray-600 mt-2">
                  Referencia: {order.direccionEnvio.referencia}
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
              <p className="text-gray-700">{order.metodoPago}</p>
            </div>
          </div>

          {/* Resumen de costos */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>S/ {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Envío</span>
              <span>S/ {order.envio.toFixed(2)}</span>
            </div>
            {order.descuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-S/ {order.descuento.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>S/ {order.total.toFixed(2)}</span>
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