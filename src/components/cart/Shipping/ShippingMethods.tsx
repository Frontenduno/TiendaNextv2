'use client';

interface ShippingMethodsProps {
    metodoEnvio: 'retiro' | 'envio';
    onMetodoChange: (metodo: 'retiro' | 'envio') => void;
    onEditAddress: () => void;
}

export default function ShippingMethods({ metodoEnvio, onMetodoChange, onEditAddress }: ShippingMethodsProps) {
    return (
        <div className="space-y-4">
            {/* Dirección */}
            <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between backdrop-blur-md bg-white/70">
                <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-xl">📍</span>
                    <p>
                        <span className="font-semibold text-black">Dirección - SJL, campoy calle 6</span>
                    </p>
                </div>
                <button
                    className="text-blue-600 text-sm flex items-center gap-1 hover:cursor-pointer"
                    onClick={onEditAddress}
                >
                    🖊️ <span className="underline">Cambiar</span>
                </button>
            </div>

            {/* Métodos de envío */}
            <div className="space-y-4">
                {/* Retiro en tienda */}
                <div
                    className={`bg-white shadow-md rounded-xl p-4 cursor-pointer backdrop-blur-md bg-white/70 ${
                        metodoEnvio === 'retiro' ? 'border-2 border-blue-600' : ''
                    }`}
                    onClick={() => onMetodoChange('retiro')}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex gap-2">
                            <span
                                className={`w-4 h-4 rounded-full border-2 border-gray-400 transition-all duration-300 ease-in-out ${
                                    metodoEnvio === 'retiro' ? 'bg-blue-500' : ''
                                }`}
                            ></span>
                            <div>
                                <p className="font-semibold text-black">Retiro en tienda</p>
                                <p className="font-semibold ml-5 text-black">Centro cívico</p>
                                <p className="text-red-500 text-sm ml-5 mt-1">puede retirarlo desde el 2 de julio</p>
                            </div>
                        </div>
                        <div className="text-green-600 font-semibold mt-1">Gratis</div>
                    </div>
                    <button className="text-blue-600 flex items-center gap-1 text-sm mt-2 ml-7 hover:cursor-pointer">
                        🖊️ <span className="underline">cambiar lugar de retiro</span>
                    </button>
                </div>

                {/* Envío a domicilio */}
                <div
                    className={`bg-white shadow-md rounded-xl p-4 cursor-pointer backdrop-blur-md bg-white/70 ${
                        metodoEnvio === 'envio' ? 'border-2 border-blue-600' : ''
                    }`}
                    onClick={() => onMetodoChange('envio')}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex gap-2">
                            <span
                                className={`w-4 h-4 rounded-full border-2 border-gray-400 transition-all duration-300 ease-in-out ${
                                    metodoEnvio === 'envio' ? 'bg-blue-500' : ''
                                }`}
                            ></span>
                            <div>
                                <p className="font-semibold text-black">Envío a domicilio</p>
                                <p className="text-black ml-5">El pedido llega el 2 de julio</p>
                                <p className="text-red-500 text-sm ml-5 mt-1">
                                    El pedido puede tardar entre 9 a 24 horas
                                </p>
                            </div>
                        </div>
                        <div className="text-cyan-800 font-semibold mt-1">S/. 21.90</div>
                    </div>
                    <button className="text-blue-600 flex items-center gap-1 text-sm mt-2 ml-7 hover:cursor-pointer">
                        🖊️ <span className="underline">cambiar fecha</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
