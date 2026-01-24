// components/product/ProductCardLayouts.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Producto } from '@/interfaces/products';
import { FavoriteButton } from '@/feature/favorite-button/FavoriteButton';
import { SizeConfiguration, renderStars } from './product-card.config';

interface LayoutProps {
  producto: Producto;
  config: SizeConfiguration;
  aspectRatio: string;
  contentPadding: string;
  priceInfo: {
    finalPrice: number;
    originalPrice: number;
    hasDiscount: boolean;
    discountPercentage: number;
  };
  coloresDisponibles: Array<{ id: number; nombre: string; valor: string }>;
  handleAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showColors: boolean;
  showAddToCart: boolean;
  showRating: boolean;
  addToCartBehavior: 'hover' | 'always';
  maxTags: number;
}

export const HorizontalLayout: React.FC<LayoutProps> = ({
  producto,
  config,
  aspectRatio,
  contentPadding,
  priceInfo,
  handleAddToCart,
  showAddToCart,
  showRating,
}) => {
  const stars = renderStars(producto.calificacion || 0, config.starSize);

  return (
    <div className="bg-white rounded-lg overflow-hidden group h-full flex border border-gray-200 hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${producto.idProducto}`} className="relative w-32 flex-shrink-0">
        <div className={`relative ${aspectRatio} overflow-hidden bg-gray-50`}>
          <Image
            src={producto.imagenes[0]?.url || '/placeholder.png'}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="128px"
          />
          
          {producto.etiquetas.length > 0 && (
            <div className="absolute top-1 left-1 z-10">
              <span className={`bg-blue-600 text-white ${config.tag} rounded font-medium block`}>
                {producto.etiquetas[0].descripcion}
              </span>
            </div>
          )}

          {priceInfo.hasDiscount && (
            <div className={`absolute bottom-1 left-1 bg-red-500 text-white font-bold ${config.discount} rounded z-10`}>
              -{priceInfo.discountPercentage}%
            </div>
          )}

          <div className="absolute top-1 right-1 z-10">
            <FavoriteButton 
              productId={producto.idProducto}
              size={config.favoriteSize}
              variant="card"
            />
          </div>
        </div>
      </Link>

      <div className={`${contentPadding} flex-1 flex flex-col justify-between`}>
        <Link href={`/product/${producto.idProducto}`} className="flex-1">
          <p className={`${config.brand} text-gray-500 mb-0.5`}>{producto.marca.nombre}</p>
          
          <h3 className={`${config.title} font-medium text-gray-900 hover:text-blue-600 transition`}>
            {producto.nombre}
          </h3>

          {showRating && producto.calificacion && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                {stars.map((star) => (
                  <Star
                    key={star.key}
                    className={`${star.className} ${
                      star.filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {producto.totalReviews && (
                <span className={`${config.ratingText} text-gray-600`}>
                  ({producto.totalReviews})
                </span>
              )}
            </div>
          )}
        </Link>

        <div className="flex items-center justify-between gap-2 mt-2">
          <div>
            {priceInfo.hasDiscount ? (
              <div className="flex flex-col">
                <span className={`${config.price} font-bold text-gray-900`}>
                  S/ {priceInfo.finalPrice.toFixed(2)}
                </span>
                <p className="text-[10px] text-gray-400 line-through">
                  S/ {priceInfo.originalPrice.toFixed(2)}
                </p>
              </div>
            ) : (
              <span className={`${config.price} font-bold text-gray-900`}>
                S/ {priceInfo.finalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              className={`bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center ${config.button} px-2`}
              aria-label="Agregar al carrito"
            >
              <ShoppingCart className={config.icon} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const VerticalLayout: React.FC<LayoutProps> = ({
  producto,
  config,
  aspectRatio,
  contentPadding,
  priceInfo,
  coloresDisponibles,
  handleAddToCart,
  showColors,
  showAddToCart,
  showRating,
  addToCartBehavior,
  maxTags,
}) => {
  const stars = renderStars(producto.calificacion || 0, config.starSize);

  return (
    <div className="bg-white rounded-lg overflow-hidden group h-full flex flex-col border border-gray-200 hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${producto.idProducto}`}>
        <div className={`relative ${aspectRatio} overflow-hidden bg-gray-50`}>
          <Image
            src={producto.imagenes[0]?.url || '/placeholder.png'}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {producto.etiquetas.length > 0 && !priceInfo.hasDiscount && (
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {producto.etiquetas.slice(0, maxTags).map((etiqueta) => (
                <span
                  key={etiqueta.idEtiqueta}
                  className={`bg-blue-600 text-white ${config.tag} rounded font-medium`}
                >
                  {etiqueta.descripcion}
                </span>
              ))}
            </div>
          )}

          {priceInfo.hasDiscount && (
            <>
              <div className={`absolute top-2 left-2 bg-red-500 text-white font-bold ${config.discount} rounded z-10`}>
                -{priceInfo.discountPercentage}%
              </div>
              
              {producto.etiquetas.length > 0 && (
                <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-10">
                  {producto.etiquetas.slice(0, maxTags).map((etiqueta) => (
                    <span
                      key={etiqueta.idEtiqueta}
                      className={`bg-blue-600 text-white ${config.tag} rounded font-medium`}
                    >
                      {etiqueta.descripcion}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton 
              productId={producto.idProducto}
              size={config.favoriteSize}
              variant="card"
            />
          </div>
        </div>
      </Link>

      <div className={`${contentPadding} flex-1 flex flex-col`}>
        <Link href={`/product/${producto.idProducto}`} className="flex-1 flex flex-col">
          <p className={`${config.brand} text-gray-500 mb-1`}>{producto.marca.nombre}</p>
          
          <h3 className={`${config.title} font-medium text-gray-900 mb-2 hover:text-blue-600 transition`}>
            {producto.nombre}
          </h3>

          {showRating && producto.calificacion && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {stars.map((star) => (
                  <Star
                    key={star.key}
                    className={`${star.className} ${
                      star.filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {producto.totalReviews && (
                <span className={`${config.ratingText} text-gray-600`}>
                  ({producto.totalReviews})
                </span>
              )}
            </div>
          )}

          <div className="mb-2 mt-auto">
            {priceInfo.hasDiscount ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className={`${config.price} font-bold text-gray-900`}>
                    S/ {priceInfo.finalPrice.toFixed(2)}
                  </span>
                </div>
                <p className={`${config.brand} text-gray-400 line-through`}>
                  S/ {priceInfo.originalPrice.toFixed(2)}
                </p>
              </>
            ) : (
              <span className={`${config.price} font-bold text-gray-900`}>
                S/ {priceInfo.finalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {producto.mensajeEnvio && (
            <p className={`${config.brand} text-green-600 font-medium mb-2`}>
              {producto.mensajeEnvio}
            </p>
          )}

          {showColors && coloresDisponibles.length > 1 && (
            <div className="flex items-center gap-1 mb-2">
              {coloresDisponibles.map((color) => (
                <div
                  key={color.id}
                  className={`rounded-full border border-gray-300 ${
                    config.container === 'text-xs' ? 'w-3 h-3' : 
                    config.container === 'text-sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
                  }`}
                  style={{ backgroundColor: color.valor }}
                  title={color.nombre}
                />
              ))}
            </div>
          )}
        </Link>

        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className={`w-full bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 ${config.button} ${
              addToCartBehavior === 'hover' ? 'lg:opacity-0 lg:group-hover:opacity-100' : ''
            }`}
          >
            <ShoppingCart className={config.icon} />
            <span>Agregar</span>
          </button>
        )}
      </div>
    </div>
  );
};