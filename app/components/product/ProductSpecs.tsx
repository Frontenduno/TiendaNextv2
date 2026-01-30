// components/product/ProductSpecs.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Producto } from '@/interfaces/products';

interface ProductSpecsProps {
  producto: Producto;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ producto }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Número de especificaciones a mostrar inicialmente
  const INITIAL_SPECS_COUNT = 6;
  const hasMoreSpecs = producto.especificaciones && producto.especificaciones.length > INITIAL_SPECS_COUNT;
  const displayedSpecs = showAllSpecs 
    ? producto.especificaciones 
    : producto.especificaciones?.slice(0, INITIAL_SPECS_COUNT) || [];

  return (
    <div className="space-y-4">
      {/* Descripción */}
      {producto.descripcion && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="w-full flex justify-between items-center py-4 px-6 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">Descripción</span>
            {isDescriptionOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
            )}
          </button>
          {isDescriptionOpen && (
            <div className="px-6 pb-6 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-900 leading-relaxed text-left">
                {producto.descripcion}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detalle */}
      {producto.detalle && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsDetalleOpen(!isDetalleOpen)}
            className="w-full flex justify-between items-center py-4 px-6 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">Detalle</span>
            {isDetalleOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
            )}
          </button>
          {isDetalleOpen && (
            <div className="px-6 pb-6 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-900 leading-relaxed text-left">
                {producto.detalle}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Especificaciones */}
      {producto.especificaciones && producto.especificaciones.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsSpecsOpen(!isSpecsOpen)}
            className="w-full flex justify-between items-center py-4 px-6 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">Especificaciones</span>
            {isSpecsOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
            )}
          </button>
          {isSpecsOpen && (
            <div className="border-t border-gray-200">
              {/* Lista de especificaciones */}
              {displayedSpecs.map((spec, index) => (
                <div
                  key={index}
                  className={`px-6 py-3 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 text-left">
                      {spec.nombre}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 text-left">
                      {spec.valor}
                    </p>
                  </div>
                </div>
              ))}

              {/* Botón "Mostrar Más" */}
              {hasMoreSpecs && (
                <div className="px-6 py-3 bg-white border-t border-gray-200">
                  <button
                    onClick={() => setShowAllSpecs(!showAllSpecs)}
                    className="text-sm text-gray-900 hover:text-gray-700 font-medium transition-colors"
                  >
                    {showAllSpecs ? 'Mostrar Menos' : 'Mostrar Más'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};