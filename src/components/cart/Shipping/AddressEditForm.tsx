'use client';

interface AddressEditFormProps {
    onCancel: () => void;
    onSave: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AddressEditForm({ onCancel, onSave }: AddressEditFormProps) {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-semibold">
                    <span className="text-2xl">📍</span>
                    <p>
                        Dirección actual - <span className="font-bold">SJL, campoy calle 6</span>
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-red-600 font-bold flex items-center gap-1 text-sm hover:text-red-800 transition-colors duration-200 cursor-pointer"
                >
                    Volver <span className="text-xl">↩️</span>
                </button>
            </div>

            {/* Formulario */}
            <form onSubmit={onSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold block mb-1 text-black">Departamento</label>
                        <select className="w-full border rounded-xl px-4 py-2 text-gray-500 focus:outline-none">
                            <option>Lima</option>
                            <option>Arequipa</option>
                            <option>Cusco</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold block mb-1 text-black">Provincia</label>
                        <select className="w-full border rounded-xl px-4 py-2 text-gray-500 focus:outline-none">
                            <option>Lima</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold block mb-1 text-black">Distrito</label>
                        <select className="w-full border rounded-xl px-4 py-2 text-gray-500 focus:outline-none">
                            <option>San Juan de Lurigancho</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold block mb-1 text-black">Dirección</label>
                        <input
                            type="text"
                            defaultValue="Campoy calle 6"
                            className="w-full border rounded-xl px-4 py-2 text-gray-700 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}
