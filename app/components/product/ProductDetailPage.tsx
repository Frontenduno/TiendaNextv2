// components/product/ProductDetailPage.tsx
'use client';

import React from 'react';
import { Producto } from '@/interfaces/products';
import { ImageGallery } from './ImageGallery';
import { ProductInfo } from './ProductInfo';
import { ProductSpecs } from './ProductSpecs';

interface ProductDetailPageProps {
  producto: Producto;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ producto }) => {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <nav className="text-sm text-gray-600 mb-6">
          <span>Home</span>
          {producto.categorias.map((cat) => (
            <span key={cat.idCategoria}>
              {' > '}
              <span>{cat.nombre}</span>
            </span>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ImageGallery imagenes={producto.imagenes} />
          <ProductInfo producto={producto} />
        </div>

        <ProductSpecs producto={producto} />
      </div>
    </div>
  );
};