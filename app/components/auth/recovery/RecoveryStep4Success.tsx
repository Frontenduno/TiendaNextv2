"use client";

import { CheckCircle } from "lucide-react";

interface Props {
  onSwitchLogin: () => void;
  onClose: () => void;
}

export default function RecoveryStep4Success({ onSwitchLogin}: Props) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">¡Contraseña actualizada!</h2>
        <p className="text-gray-600 mb-8">
          Tu contraseña ha sido cambiada exitosamente.
        </p>
        
        <button
          onClick={onSwitchLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 active:scale-[0.98]"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}