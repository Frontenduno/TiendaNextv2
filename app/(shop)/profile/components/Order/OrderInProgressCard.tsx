// app/profile/components/Order/OrderInProgressCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { Clock, Package, Truck, Eye, MapPin, AlertCircle } from 'lucide-react';
import { OrdenEnProceso } from '@/interfaces/orders-in-progress';

interface Props {
  order: OrdenEnProceso;
  onViewDetails: (order: OrdenEnProceso) => void;
}

export default function OrderInProgressCard({ order, onViewDetails }: Props) {
  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case 'procesando':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          text: 'Procesando',
          icon: Package,
          headerBg: 'from-blue-50 to-blue-100',
          headerBorder: 'border-blue-200',
          iconColor: 'text-blue-600',
        };
      case 'en_camino':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          text: 'En camino',
          icon: Truck,
          headerBg: 'from-green-50 to-green-100',
          headerBorder: 'border-green-200',
          iconColor: 'text-green-600',
        };
      case 'cancelado':
        return {
          color: 'bg-orange-100 text-orange-700 border-orange-200',
          text: 'Cancelado',
          icon: AlertCircle,
          headerBg: 'from-orange-50 to-orange-100',
          headerBorder: 'border-orange-200',
          iconColor: 'text-orange-600',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          text: estado,
          icon: Clock,
          headerBg: 'from-gray-50 to-gray-100',
          headerBorder: 'border-gray-200',
          iconColor: 'text-gray-600',
        };
    }
  };

  const getDaysUntilDelivery = (fechaEstimada: string) => {
    const today = new Date();
    const deliveryDate = new Date(fechaEstimada);
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statusInfo = getStatusInfo(order.estado);
  const daysUntilDelivery = getDaysUntilDelivery(order.tracking.fechaEntregaEstimada);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 hover:shadow-md transition-all overflow-hidden">
      {/* Header de la tarjeta */}
      <div className={`bg-gradient-to-r ${statusInfo.headerBg} px-4 sm:px-6 py-3 sm:py-4 border-b ${statusInfo.headerBorder}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <StatusIcon size={20} className={`sm:w-6 sm:h-6 ${statusInfo.iconColor}`} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{order.numeroOrden}</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {new Date(order.fecha).toLocaleDateString('es-PE')}
              </p>
            </div>
          </div>
          <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold border ${statusInfo.color} whitespace-nowrap`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      {/* Contenido - Mobile optimizado */}
      <div className="p-4 sm:p-6">
        {/* Mensaje de cancelación */}
        {order.estado === 'cancelado' && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800 font-medium text-left">
              En proceso de reembolso
            </p>
          </div>
        )}

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-4">
          {/* Imagen y título */}
          <div className="flex gap-3">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
              <Image
                src={order.productos[0].imagen}
                alt={order.productos[0].nombre}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">
                {order.productos[0].nombre}
              </h4>
              {order.productos.length > 1 && (
                <p className="text-gray-500 text-xs">
                  +{order.productos.length - 1} producto{order.productos.length > 2 ? 's' : ''} más
                </p>
              )}
            </div>
          </div>

          {/* Fecha estimada - solo si no está cancelado */}
          {order.estado !== 'cancelado' && (
            <div className="flex items-center gap-2 text-xs bg-green-50 p-2 rounded-lg">
              <Truck size={14} className="text-green-600 flex-shrink-0" />
              <span className="text-gray-700 text-left">
                Entrega: {' '}
                <span className="font-semibold text-green-600">
                  {daysUntilDelivery === 0 ? 'Hoy' : 
                   daysUntilDelivery === 1 ? 'Mañana' : 
                   `En ${daysUntilDelivery} días`}
                </span>
              </span>
            </div>
          )}

          {/* Dirección */}
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2 text-left">
              {order.direccionEnvio.direccion}, {order.direccionEnvio.distrito}
            </span>
          </div>

          {/* Tracking */}
          <div className={`${order.estado === 'cancelado' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'} border rounded-lg px-3 py-2`}>
            <p className={`text-xs ${order.estado === 'cancelado' ? 'text-orange-600' : 'text-blue-600'} text-left`}>
              Código: <span className="font-bold">{order.tracking.codigoSeguimiento}</span>
            </p>
          </div>

          {/* Total y botón */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-0.5 text-left">Total</p>
              <p className="text-xl font-bold text-gray-900 text-left">
                S/ {order.total.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => onViewDetails(order)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Eye size={16} />
              Ver detalles
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-start gap-6">
          <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
            <Image
              src={order.productos[0].imagen}
              alt={order.productos[0].nombre}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h4 className="font-bold text-gray-900 text-lg text-left">
                {order.productos[0].nombre}
              </h4>
              {order.productos.length > 1 && (
                <p className="text-gray-500 mt-1 text-left">
                  +{order.productos.length - 1} producto{order.productos.length > 2 ? 's' : ''} más
                </p>
              )}
            </div>

            {order.estado !== 'cancelado' && (
              <div className="flex items-center gap-2 text-sm">
                <Truck size={16} className="text-green-600" />
                <span className="text-gray-700 text-left">
                  Entrega estimada: {' '}
                  <span className="font-semibold text-green-600">
                    {daysUntilDelivery === 0 ? 'Hoy' : 
                     daysUntilDelivery === 1 ? 'Mañana' : 
                     `En ${daysUntilDelivery} días`}
                  </span>
                </span>
              </div>
            )}

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              <span className="text-left">
                {order.direccionEnvio.direccion}, {order.direccionEnvio.distrito}
              </span>
            </div>

            <div className={`${order.estado === 'cancelado' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'} border rounded-lg px-4 py-2 inline-block`}>
              <p className={`text-xs ${order.estado === 'cancelado' ? 'text-orange-600' : 'text-blue-600'} font-medium text-left`}>
                Código de seguimiento: <span className="font-bold">{order.tracking.codigoSeguimiento}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                S/ {order.total.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => onViewDetails(order)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Eye size={18} />
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}