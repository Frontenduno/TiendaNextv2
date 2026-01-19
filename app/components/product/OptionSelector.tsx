// components/product/OptionSelector.tsx
'use client';

import React from 'react';
import { OpcionVariante } from '@/interfaces/products';

interface OptionSelectorProps {
  label: string;
  opciones: OpcionVariante[];
  selectedOpcion: OpcionVariante | null;
  onOpcionChange: (opcion: OpcionVariante) => void;
  tipo: 'color' | 'text';
  disabled?: boolean;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  label,
  opciones,
  selectedOpcion,
  onOpcionChange,
  tipo,
  disabled = false,
}) => {
  if (opciones.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-gray-900 mb-3">
        {label}: {selectedOpcion?.nombre || 'Selecciona una opción'}
      </p>
      <div className="flex gap-2 flex-wrap">
        {tipo === 'color' ? (
          opciones.map((opcion) => (
            <button
              key={opcion.id}
              onClick={() => !disabled && onOpcionChange(opcion)}
              disabled={disabled}
              className={`w-10 h-10 rounded-full border-2 transition ${
                selectedOpcion?.id === opcion.id
                  ? 'border-blue-500 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{ backgroundColor: opcion.valor }}
              title={opcion.nombre}
              aria-label={opcion.nombre}
            />
          ))
        ) : (
          opciones.map((opcion) => (
            <button
              key={opcion.id}
              onClick={() => !disabled && onOpcionChange(opcion)}
              disabled={disabled}
              className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                selectedOpcion?.id === opcion.id
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 text-gray-900 hover:border-gray-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {opcion.nombre}
            </button>
          ))
        )}
      </div>
    </div>
  );
};