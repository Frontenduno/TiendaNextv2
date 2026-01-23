// components/product/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Producto } from '@/interfaces/products';
import { FavoriteButton } from '@/feature/favorite-button/FavoriteButton';
import { getPriceInfo } from '@/utils/pricing';

interface ProductCardProps {
  producto: Producto;
}

export const ProductCard: React.FC<ProductCardProps> = ({ producto }) => {
  const priceInfo = getPriceInfo(producto);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-full flex flex-col">
      <Link href={`/product/${producto.idProducto}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={producto.imagenes[0]?.url || '/placeholder.png'}
            alt={producto.nombre}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {producto.etiquetas.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {producto.etiquetas.slice(0, 2).map((etiqueta) => (
                <span
                  key={etiqueta.idEtiqueta}
                  className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                >
                  {etiqueta.descripcion}
                </span>
              ))}
            </div>
          )}

          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton 
              productId={producto.idProducto}
              initialFavorite={producto.esFavorito}
              size="md"
              variant="card"
            />
          </div>
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/product/${producto.idProducto}`} className="flex-1 flex flex-col">
          <p className="text-sm text-gray-600 mb-1">{producto.marca.nombre}</p>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition min-h-[3rem]">
            {producto.nombre}
          </h3>

          <div className="mb-3 mt-auto">
            {priceInfo.hasDiscount ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-bold text-red-600">
                  S/ {priceInfo.finalPrice.toFixed(2)}
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                  -{priceInfo.discountPercentage}%
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                S/ {priceInfo.finalPrice.toFixed(2)}
              </span>
            )}
            {priceInfo.hasDiscount && (
              <p className="text-sm text-gray-500 line-through mt-1">
                S/ {priceInfo.originalPrice.toFixed(2)}
              </p>
            )}
          </div>

          <p className="text-sm text-green-600 font-medium mb-2">
            {producto.tiempoEnvio}
          </p>

          {producto.disponibleRecojo && (
            <p className="text-sm text-green-600">
              Retira hoy
            </p>
          )}
          
          {producto.stockActual < 10 && producto.stockActual > 0 && (
            <p className="text-sm text-orange-600 mt-2">
              ¡Solo quedan {producto.stockActual}!
            </p>
          )}
        </Link>
      </div>
    </div>
  );
};