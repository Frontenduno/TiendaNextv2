'use client';

import { FaCreditCard, FaMoneyBillWave, FaQrcode } from 'react-icons/fa';
import { MdCreditCard } from 'react-icons/md';

interface PaymentMethodsProps {
    formaPago?: string; // Corregido: ahora es opcional
    onSeleccionarFormaPago: (metodo: string) => void;
}

export default function PaymentMethods({ formaPago, onSeleccionarFormaPago }: PaymentMethodsProps) {
    const handleSeleccionarFormaPago = (metodo: string) => {
        onSeleccionarFormaPago(metodo);
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-black mb-4">Selecciona tu método de pago</h2>

            <div className="space-y-3">
                {/* Tarjeta de crédito */}
                <button
                    type="button"
                    onClick={() => handleSeleccionarFormaPago('credito')}
                    className={`w-full flex items-center gap-4 p-4 bg-white rounded-xl shadow ${
                        formaPago === 'credito' ? 'ring-2 ring-blue-500' : ''
                    } transition-all duration-200`}
                >
                    <FaCreditCard className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-black">Tarjeta de crédito</span>
                </button>

                {/* Tarjeta de débito */}
                <button
                    type="button"
                    onClick={() => handleSeleccionarFormaPago('debito')}
                    className={`w-full flex items-center gap-4 p-4 bg-white rounded-xl shadow ${
                        formaPago === 'debito' ? 'ring-2 ring-green-500' : ''
                    } transition-all duration-200`}
                >
                    <MdCreditCard className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-black">Tarjeta de débito</span>
                </button>

                {/* Yape */}
                <button
                    type="button"
                    onClick={() => handleSeleccionarFormaPago('yape')}
                    className={`w-full flex items-center gap-4 p-4 bg-white rounded-xl shadow ${
                        formaPago === 'yape' ? 'ring-2 ring-purple-500' : ''
                    } transition-all duration-200`}
                >
                    <FaQrcode className="w-6 h-6 text-purple-600" />
                    <span className="font-semibold text-black">Yape</span>
                </button>

                {/* Efectivo */}
                <button
                    type="button"
                    onClick={() => handleSeleccionarFormaPago('efectivo')}
                    className={`w-full flex items-center gap-4 p-4 bg-white rounded-xl shadow ${
                        formaPago === 'efectivo' ? 'ring-2 ring-yellow-500' : ''
                    } transition-all duration-200`}
                >
                    <FaMoneyBillWave className="w-6 h-6 text-yellow-600" />
                    <span className="font-semibold text-black">Efectivo</span>
                </button>
            </div>
        </div>
    );
}
