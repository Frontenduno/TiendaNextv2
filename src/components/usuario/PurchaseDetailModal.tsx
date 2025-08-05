'use client';

import Image from 'next/image';
import { Order } from '@/types/order';

interface PurchaseDetailModalProps {
  order: Order;
  onClose: () => void;
}

export default function PurchaseDetailModal({ order, onClose }: PurchaseDetailModalProps) {
  const purchaseDate = new Date(order.date);
  const formattedDate = purchaseDate.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal - order.totalCost;

  const handleDownload = () => {
    alert('Descargando boleta...');
    // Aquí puedes reemplazar con lógica real para generar o descargar boleta.
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30 px-2">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative">
        {/* Encabezado */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-300 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Detalles de la Compra</h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-black text-3xl font-light leading-none"
            aria-label="Cerrar detalles de compra"
            style={{ cursor: 'pointer' }} // ← cursor mano
          >
            &times;
          </button>
        </div>

        {/* Cuerpo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="md:col-span-2 space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
              >
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image
                    src={item.image || 'https://placehold.co/64x64/cccccc/000000?text=No+Image'}
                    alt={item.name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-base">{item.name}</p>
                  <p className="text-gray-700 text-sm">
                    Cantidad: {item.quantity} &nbsp; S/. {item.price.toFixed(2)}
                  </p>
                  <p className="text-red-600 font-bold text-lg">
                    S/. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Detalle de compra */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-md h-fit">
            <h3 className="text-lg font-bold text-blue-600 mb-4">Detalle compra</h3>
            <p className="mb-2">
              <strong className="text-black">Fecha:</strong> {formattedDate}
            </p>
            <p className="mb-2">
              <strong className="text-black">Cant.Productos:</strong> {order.totalItems}
            </p>
            <p className="mb-2">
              <strong className="text-black">Envío:</strong>{' '}
              <span className="font-semibold ml-1 text-green-600">
                {order.metodoEnvio === 'envio' ? 'Envío a domicilio' : 'Retiro en tienda'}
              </span>
            </p>
            <p className="mb-2 text-blue-700 font-semibold">
              <strong>Sub total:</strong> S/. {subtotal.toFixed(2)}
            </p>
            <p className="mb-2 text-red-500 font-semibold">
              <strong>Descuento:</strong> S/. {discount.toFixed(2)}
            </p>
            <p className="text-xl font-bold mt-4">
              <strong>Total:</strong>{' '}
              <span className="text-red-600">S/. {order.totalCost.toFixed(2)}</span>
            </p>

            {/* Botón de descarga */}
            <button
              onClick={handleDownload}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
              style={{ cursor: 'pointer' }} // ← cursor mano
            >
              Descargar boleta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
