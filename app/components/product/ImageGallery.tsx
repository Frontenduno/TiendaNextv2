// components/product/ImageGallery.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Imagen } from '@/interfaces/products';

interface ImageGalleryProps {
  imagenes: Imagen[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ imagenes }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingThumbs, setLoadingThumbs] = useState<{ [key: number]: boolean }>({});

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {loadingMain && (
          <div className="absolute inset-0 animate-pulse bg-gray-200">
            <div className="h-full w-full flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        <Image
          src={imagenes[selectedImage]?.url || '/placeholder.png'}
          alt={imagenes[selectedImage]?.descripcion || 'Producto'}
          fill
          className={`object-contain transition-opacity duration-300 ${
            loadingMain ? 'opacity-0' : 'opacity-100'
          }`}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setLoadingMain(false)}
        />
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {imagenes.map((imagen, index) => (
            <button
              key={imagen.idImagen}
              onClick={() => {
                setSelectedImage(index);
                setLoadingMain(true);
              }}
              className={`relative aspect-square rounded border-2 overflow-hidden transition ${
                selectedImage === index
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {loadingThumbs[index] !== false && (
                <div className="absolute inset-0 animate-pulse bg-gray-200"></div>
              )}
              <Image
                src={imagen.url}
                alt={imagen.descripcion}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  loadingThumbs[index] === false ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="100px"
                onLoad={() => setLoadingThumbs(prev => ({ ...prev, [index]: false }))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};