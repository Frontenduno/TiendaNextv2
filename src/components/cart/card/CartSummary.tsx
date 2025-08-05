// src/components/cart/card/CartSummary.tsx
'use client';

interface CartSummaryProps {
    totalItems: number;
    total: number;
    descuento: number;
    viewState: 'cart' | 'summary' | 'payment' | 'card-form' | 'confirmation';
    formaPago?: string;
    onContinueAction: () => void;
    culqiLoaded: boolean;
    loadingCulqi: boolean;
}

export default function CartSummary({
    totalItems,
    total,
    descuento,
    viewState,
    formaPago,
    onContinueAction,
    culqiLoaded,
    loadingCulqi,
}: CartSummaryProps) {
    const getButtonText = () => {
        switch (viewState) {
            case 'cart': return 'Continuar Compra';
            case 'summary': return 'Ir a formas de pago';
            case 'payment':
                if (formaPago === 'credito' || formaPago === 'debito') {
                    return 'Continuar a pago con tarjeta';
                }
                return 'Confirmar Compra';
            case 'card-form':
                if (loadingCulqi) return 'Procesando...';
                if (!culqiLoaded) return 'Cargando Culqi...';
                return 'Esperando pago con Culqi';
            case 'confirmation': return 'Ver mis compras';
            default: return 'Continuar';
        }
    };

    const isButtonDisabled = () => {
        if (viewState === 'payment' && !formaPago) return true;
        if (viewState === 'card-form') return true;
        return false;
    };

    return (
        <div className="bg-white shadow rounded-xl p-6 w-full mx-auto space-y-4">
            <div className="flex justify-between items-center text-black text-base font-semibold">
                <span>Productos ({totalItems})</span>
                <span>S/. {total.toFixed(2)}</span>
            </div>
            <hr />

            <div className="flex justify-between items-center text-red-500 font-semibold">
                <span>Descuentos ({descuento > 0 ? '1' : '0'})</span>
                <div className="flex items-center gap-1 text-black">
                    <span>S/. {descuento.toFixed(2)}</span>
                    <span className="text-gray-400">⌄</span>
                </div>
            </div>
            <hr />

            <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">Entrega</span>
                <span className="text-green-600 font-semibold">Gratis</span>
            </div>
            <hr />

            <div className="flex justify-between items-center">
                <span className="text-red-600 font-bold text-lg">Total:</span>
                <span className="text-black font-semibold text-lg">S/. {(total - descuento).toFixed(2)}</span>
            </div>

            <button
                className={`mt-4 w-full py-2 rounded-xl font-semibold transition ${
                    isButtonDisabled()
                        ? 'bg-gray-300 cursor-not-allowed text-black'
                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                }`}
                onClick={onContinueAction}
                disabled={isButtonDisabled()}
            >
                {getButtonText()}
            </button>
        </div>
    );
}