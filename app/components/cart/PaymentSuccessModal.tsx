// components/cart/PaymentSuccessModal.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShoppingBag, Package } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose
}) => {
  const router = useRouter();

  const handleContinueShopping = () => {
    onClose();
    router.push('/');
  };

  const handleViewOrder = () => {
    onClose();
    router.push('/profile/pedidos');
  };

  if (!isOpen) return null;

  // Número de orden estático para pruebas
  const orderNumber = 'ORD-DEMO2024';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Success Icon */}
        <div className="p-8 text-center">
          <div className="mb-6 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-green-100 rounded-full p-4">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago exitoso!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido confirmado y está siendo procesado
          </p>

          {/* Detalles rápidos */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Número de pedido</p>
                <p className="text-sm text-gray-600">#{orderNumber}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Recibirás un correo con los detalles de tu compra
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={handleViewOrder}
              className="w-full px-4 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Ver mi pedido
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};