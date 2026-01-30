// app/profile/pages/OrdersInProgressPage.tsx
"use client";

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import OrderInProgressCard from '../components/Order/OrderInProgressCard';
import OrderDetailModal from '../components/Order/OrderDetailModal';
import ordersInProgressData from '@/data/orders-in-progress.json';
import { OrdersInProgressData, OrdenEnProceso } from '@/interfaces/orders-in-progress';

export default function OrdersInProgressPage() {
  const [selectedOrder, setSelectedOrder] = useState<OrdenEnProceso | null>(null);
  const [orders, setOrders] = useState<OrdenEnProceso[]>((ordersInProgressData as OrdersInProgressData).ordenesEnProceso);

  const handleCancelOrder = (orderId: number) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.idOrden === orderId
          ? { ...order, estado: 'cancelado' as const }
          : order
      )
    );
    
    // Si el modal está abierto con esta orden, actualizamos también
    if (selectedOrder?.idOrden === orderId) {
      setSelectedOrder({ ...selectedOrder, estado: 'cancelado' as const });
    }
  };

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No hay pedidos en curso"
        message="Sigue tus envíos aquí."
        Icon={Clock}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-gray-600 mt-1">
            {orders.length} {orders.length === 1 ? 'pedido activo' : 'pedidos activos'}
          </p>
        </div>

        {/* Lista de pedidos */}
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <OrderInProgressCard
              key={order.idOrden}
              order={order}
              onViewDetails={setSelectedOrder}
            />
          ))}
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </>
  );
}