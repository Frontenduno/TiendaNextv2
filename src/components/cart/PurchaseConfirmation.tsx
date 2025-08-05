'use client';

import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';
import { DisplayedCartItem } from '@/types/cart';
import DownloadReceiptButton from '@/components/common/DownloadReceiptButton'; // Importamos el nuevo componente
import { Order } from '@/types/order'; // Importa la interfaz Order para construir el objeto

interface PurchaseConfirmationProps {
    cart: DisplayedCartItem[];
    totalItems: number;
    total: number;
    descuento: number;
    metodoEnvio: 'retiro' | 'envio';
    formaPago?: string;
    transactionId?: string;
    transactionDate?: string;
    transactionTime?: string;
    orderId?: string; // Necesitamos el orderId
}

export default function PurchaseConfirmation({
    cart,
    totalItems,
    total,
    descuento,
    metodoEnvio,
    formaPago,
    transactionId,
    transactionDate,
    transactionTime,
    orderId,
}: PurchaseConfirmationProps) {
    const finalTotal = total - descuento;

    // Construir el objeto Order para pasarlo al DownloadReceiptButton
    // Aseguramos que 'date' sea un string ISO válido para la interfaz Order
    const orderForReceipt: Order = {
        id: orderId || 'sin-id', // Usar orderId o un valor por defecto
        date: transactionDate ? `${transactionDate}T${transactionTime || '00:00:00'}` : new Date().toISOString(),
        totalCost: finalTotal,
        totalItems: totalItems,
        metodoEnvio: metodoEnvio,
        formaPago: formaPago || 'No especificado',
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            selectedSize: item.selectedSize,
            // Mapear 'color' de DisplayedCartItem a 'selectedColorId' de OrderItem
            selectedColorId: item.color,
        })),
        // Puedes añadir transactionId y transactionTime si la interfaz Order los soporta
        transactionId: transactionId,
        transactionTime: transactionTime,
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-150px)] p-4">
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

                <h2 className="text-3xl font-bold text-black mb-4">¡Pago realizado!</h2>
                <p className="text-gray-700 mb-6">Tu compra ha sido procesada con éxito.</p>

                <div className="text-left border-t border-b border-gray-200 py-4 mb-6 space-y-2 p-2">
                    <h3 className="text-xl font-semibold text-black mb-3 text-center">Detalle de la Compra</h3>
                    <p className="text-gray-800"><strong>Monto Pagado:</strong> <span className="font-semibold text-green-600">S/. {finalTotal.toFixed(2)}</span></p>
                    {transactionId && transactionId !== 'N/A (Otro método de pago)' && <p className="text-gray-800"><strong>ID de Transacción:</strong> {transactionId}</p>}
                    {transactionDate && <p className="text-gray-800"><strong>Fecha:</strong> {transactionDate}</p>}
                    {transactionTime && <p className="text-gray-800"><strong>Hora:</strong> {transactionTime}</p>}
                    <p className="text-gray-800"><strong>Método de Pago:</strong> {formaPago || 'No especificado'}</p>
                    <p className="text-gray-800"><strong>Envío:</strong> {metodoEnvio === 'envio' ? 'Envío a Domicilio' : 'Retiro en Tienda'}</p>

                    <h4 className="text-lg font-semibold text-black mt-4 mb-2">Productos:</h4>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                        {cart.length > 0 ? (
                            cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-b-0 border-gray-100">
                                    <div className="w-12 h-12 relative flex-shrink-0">
                                        <Image
                                            src={item.image || 'https://placehold.co/48x48/cccccc/000000?text=No+Image'} // Fallback para imagen
                                            alt={item.name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1 text-sm text-gray-800 text-left">
                                        <p className="font-medium">{item.name}</p>
                                        <p>Cant: {item.quantity} x S/. {item.price.toFixed(2)}</p>
                                        {item.selectedSize && <p className="text-gray-600 text-xs">Talla: {item.selectedSize}</p>}
                                        {item.color && <p className="text-gray-600 text-xs">Color: {item.color}</p>}
                                    </div>
                                    <div className="text-right text-sm font-semibold text-black">
                                        S/. {(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center">No hay productos en el carrito confirmado.</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 w-full mb-3"
                >
                    Ir al inicio
                </button>
                {/* Usamos el nuevo componente DownloadReceiptButton aquí */}
                {orderId && ( // Solo renderizar si orderId está disponible
                    <DownloadReceiptButton
                        order={orderForReceipt} // Pasamos el objeto orderForReceipt completo
                        buttonText="Descargar boleta"
                    />
                )}
            </div>
        </div>
    );
}
