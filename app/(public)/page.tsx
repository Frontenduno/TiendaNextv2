// app/(public)/page.tsx
import React from 'react';
import { ProductCarousel } from '@/components/product/ProductCarousel';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - Opcional */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 sm:p-12 mb-8 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Bienvenido a Nuestra Tienda
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            Descubre las mejores ofertas y productos
          </p>
        </div>

        {/* Carruseles de productos */}
        <div className="space-y-12">
          {/* Más vendidos */}
          <ProductCarousel 
            titulo="Más Vendidos" 
            filtro="mas-vendidos"
          />
          
          {/* Productos nuevos */}
          <ProductCarousel 
            titulo="Novedades" 
            filtro="nuevos"
          />
          
          {/* Productos en oferta */}
          <ProductCarousel 
            titulo="Ofertas Especiales" 
            filtro="descuentos"
          />

          {/* Todos los productos */}
          <ProductCarousel 
            titulo="Todos los Productos" 
            filtro="todos"
          />
        </div>
      </div>
    </div>
  );
}