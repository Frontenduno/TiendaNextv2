// app/profile/components/Order/OrderDetailModal.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Package, MapPin, CreditCard, Calendar, Truck, Clock, AlertCircle } from 'lucide-react';
import { OrdenEnProceso } from '@/interfaces/orders-in-progress';

interface Props {
  order: OrdenEnProceso;
  onClose: () => void;
  onCancelOrder: (orderId: number) => void;
}

export default function OrderDetailModal({ order, onClose, onCancelOrder }: Props) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case 'procesando':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          text: 'Procesando',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-600',
        };
      case 'en_camino':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          text: 'En camino',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-600',
        };
      case 'cancelado':
        return {
          color: 'bg-orange-100 text-orange-700 border-orange-200',
          text: 'Cancelado',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-600',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          text: estado,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-600',
        };
    }
  };

  const statusInfo = getStatusInfo(order.estado);

  const handleCancelClick = () => {
    if (order.estado === 'cancelado') return;
    setIsConfirmingCancel(true);
  };

  const handleConfirmCancel = () => {
    onCancelOrder(order.idOrden);
    setIsConfirmingCancel(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${statusInfo.borderColor} flex items-center justify-between bg-gradient-to-r ${statusInfo.bgColor === 'bg-blue-50' ? 'from-blue-50 to-blue-100' : statusInfo.bgColor === 'bg-green-50' ? 'from-green-50 to-green-100' : 'from-orange-50 to-orange-100'}`}>
          <div>
            <h2 className="text-xl font-bold text-gray-900 text-left">Detalles del Pedido</h2>
            <p className="text-sm text-gray-600 mt-1 text-left">{order.numeroOrden}</p>
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
          {/* Mensaje de cancelación */}
          {order.estado === 'cancelado' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-orange-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-orange-900 text-left">Pedido cancelado</p>
                  <p className="text-sm text-orange-700 mt-1 text-left">En proceso de reembolso</p>
                </div>
              </div>
            </div>
          )}

          {/* Estado y fechas */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 text-left">Fecha de pedido</p>
                <p className="font-semibold text-gray-900 text-left">
                  {new Date(order.fecha).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            {order.estado !== 'cancelado' && (
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 text-left">Entrega estimada</p>
                  <p className="font-semibold text-green-600 text-left">
                    {new Date(order.tracking.fechaEntregaEstimada).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Estado actual y tracking */}
          <div className={`${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Clock size={20} className={statusInfo.textColor} />
                <span className="font-semibold text-gray-900 text-left">Estado actual:</span>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold border ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
            </div>
            <div className={`pt-3 border-t ${statusInfo.borderColor} space-y-2`}>
              <p className="text-sm text-gray-700 text-left">
                <span className="font-semibold">Código:</span> {order.tracking.codigoSeguimiento}
              </p>
              <p className="text-sm text-gray-700 text-left">
                <span className="font-semibold">Empresa:</span> {order.tracking.empresa}
              </p>
            </div>
            
            {/* Historial de seguimiento */}
            {order.tracking.historial && order.tracking.historial.length > 0 && (
              <div className={`mt-4 pt-4 border-t ${statusInfo.borderColor}`}>
                <h4 className="font-semibold text-gray-900 mb-3 text-left">Historial de seguimiento</h4>
                <div className="space-y-3">
                  {order.tracking.historial.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${order.estado === 'cancelado' ? 'bg-orange-600' : 'bg-blue-600'}`}></div>
                        {index < order.tracking.historial.length - 1 && (
                          <div className={`w-0.5 h-full ${order.estado === 'cancelado' ? 'bg-orange-300' : 'bg-blue-300'} mt-1`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="font-semibold text-sm text-gray-900 text-left">{item.estado}</p>
                        <p className="text-xs text-gray-600 mt-0.5 text-left">
                          {new Date(item.fecha).toLocaleString('es-PE', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm text-gray-700 mt-1 text-left">{item.descripcion}</p>
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
              <h3 className="font-bold text-gray-900 text-left">Productos</h3>
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
                    <h4 className="font-semibold text-gray-900 text-left">{item.nombre}</h4>
                    {item.color && (
                      <p className="text-sm text-gray-600 mt-1 text-left">Color: {item.color}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1 text-left">Cantidad: {item.cantidad}</p>
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
              <h3 className="font-bold text-gray-900 text-left">Dirección de entrega</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-left">
                {order.direccionEnvio.direccion}, {order.direccionEnvio.distrito}, {order.direccionEnvio.ciudad}
              </p>
              {order.direccionEnvio.referencia && (
                <p className="text-sm text-gray-600 mt-2 text-left">
                  Referencia: {order.direccionEnvio.referencia}
                </p>
              )}
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={20} className="text-gray-400" />
              <h3 className="font-bold text-gray-900 text-left">Método de pago</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-left">{order.metodoPago}</p>
            </div>
          </div>

          {/* Resumen de costos */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span className="text-left">Subtotal</span>
              <span>S/ {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="text-left">Envío</span>
              <span>S/ {order.envio.toFixed(2)}</span>
            </div>
            {order.descuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="text-left">Descuento</span>
                <span>-S/ {order.descuento.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
              <span className="text-left">Total</span>
              <span>S/ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {isConfirmingCancel ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-700 text-center">
                ¿Estás seguro de que deseas cancelar este pedido?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmingCancel(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  No, mantener
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Sí, cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              {order.estado !== 'cancelado' && (
                <button
                  onClick={handleCancelClick}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Cancelar pedido
                </button>
              )}
              <button
                onClick={onClose}
                className={`${order.estado === 'cancelado' ? 'w-full' : 'flex-1'} bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors`}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}