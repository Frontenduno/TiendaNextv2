// app/profile/pages/PurchaseHistoryPage.tsx
"use client";

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import PurchaseHistoryCard from '../components/Purchase/PurchaseHistoryCard';
import PurchaseDetailModal from '../components/Purchase/PurchaseDetailModal';
import purchaseHistoryData from '@/data/purchase-history.json';
import { PurchaseHistoryData, CompraHistorial } from '@/interfaces/purchase-history';

export default function PurchaseHistoryPage() {
  const [selectedPurchase, setSelectedPurchase] = useState<CompraHistorial | null>(null);
  
  const data = purchaseHistoryData as PurchaseHistoryData;
  const purchases = data.historialCompras;

  if (purchases.length === 0) {
    return (
      <EmptyState
        title="No tienes compras"
        message="Aparecerán aquí después de tu primer pedido."
        Icon={ShoppingBag}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-gray-600 mt-1">
            {purchases.length} {purchases.length === 1 ? 'compra realizada' : 'compras realizadas'}
          </p>
        </div>

        {/* Lista de compras */}
        <div className="grid grid-cols-1 gap-4">
          {purchases.map((purchase) => (
            <PurchaseHistoryCard
              key={purchase.idCompra}
              purchase={purchase}
              onViewDetails={setSelectedPurchase}
            />
          ))}
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedPurchase && (
        <PurchaseDetailModal
          purchase={selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
        />
      )}
    </>
  );
}