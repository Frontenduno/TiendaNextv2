'use client';

interface CreditCardFormProps {
    numeroTarjeta: string;
    setNumeroTarjeta: (valor: string) => void;
    nombreTitular: string;
    setNombreTitular: (valor: string) => void;
    mesExpiracion: string;
    setMesExpiracion: (valor: string) => void;
    anioExpiracion: string;
    setAnioExpiracion: (valor: string) => void;
    cvv: string;
    setCvv: (valor: string) => void;
    guardarMetodoPago: boolean;
    setGuardarMetodoPago: (valor: boolean) => void;
}

export default function CreditCardForm({
    numeroTarjeta,
    setNumeroTarjeta,
    nombreTitular,
    setNombreTitular,
    mesExpiracion,
    setMesExpiracion,
    anioExpiracion,
    setAnioExpiracion,
    cvv,
    setCvv,
    guardarMetodoPago,
    setGuardarMetodoPago
}: CreditCardFormProps) {
    return (
        <div className="bg-white rounded-xl p-6 w-full shadow-sm">
            {/* Título */}
            <h2 className="text-lg font-bold mb-4 text-center text-black">Añadir una tarjeta Nueva</h2>

            <form className="space-y-4">
                {/* Número y Nombre */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Numero de la tarjeta"
                        value={numeroTarjeta}
                        onChange={(e) => setNumeroTarjeta(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 placeholder-gray-400 text-black"
                        maxLength={16}
                    />
                    <input
                        type="text"
                        placeholder="Nombre del titular de la tarjeta"
                        value={nombreTitular}
                        onChange={(e) => setNombreTitular(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 placeholder-gray-400 text-black"
                        maxLength={50} // Puedes ajustar el maxLength si es necesario
                    />
                </div>

                {/* MM / YY / CVV */}
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="MM"
                        value={mesExpiracion}
                        onChange={(e) => setMesExpiracion(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 placeholder-gray-400 text-black"
                        maxLength={2}
                    />
                    <input
                        type="text"
                        placeholder="YY"
                        value={anioExpiracion}
                        onChange={(e) => setAnioExpiracion(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 placeholder-gray-400 text-black"
                        maxLength={2}
                    />
                    <input
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 placeholder-gray-400 text-black"
                        maxLength={3}
                    />
                </div>

                {/* Guardar método de pago */}
                <div className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        id="guardarMetodo"
                        checked={guardarMetodoPago}
                        onChange={(e) => setGuardarMetodoPago(e.target.checked)}
                        className="mr-2 accent-red-600"
                    />
                    <label htmlFor="guardarMetodo" className="text-black text-sm">Guardar metodo de pago</label>
                </div>
            </form>
        </div>
    );
}