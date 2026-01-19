// components/product/ProductSpecs.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Producto } from '@/interfaces/products';

interface ProductSpecsProps {
  producto: Producto;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ producto }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="w-full flex justify-between items-center py-4 hover:bg-gray-50 px-4"
        >
          <span className="font-semibold text-gray-900">Descripción</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-900 transition-transform ${
              isDescriptionOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {isDescriptionOpen && (
          <div className="px-4 pb-4">
            <p className="text-gray-700">{producto.detalle}</p>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsSpecsOpen(!isSpecsOpen)}
          className="w-full flex justify-between items-center py-4 hover:bg-gray-50 px-4"
        >
          <span className="font-semibold text-gray-900">Especificaciones</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-900 transition-transform ${
              isSpecsOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {isSpecsOpen && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {producto.especificaciones.map((spec, index) => (
                <div key={index} className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">{spec.nombre}:</span>
                  <span className="font-semibold text-gray-900">{spec.valor}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};