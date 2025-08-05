// src/components/category/ProductGrid.tsx
import React from 'react';
// ¡IMPORTANTE! Importa tu componente ProductCard.tsx
import ProductCard from '@/components/common/ProductCard'; // Asegúrate de que esta ruta sea correcta
// Importa la interfaz Product desde '@/data/products' para consistencia
import { Product } from '@/data/products';

// No necesitamos FaShoppingCart y FaHeart aquí, ya que ProductCard los maneja.
// Tampoco necesitamos la definición de Product aquí, ya que se importa de '@/data/products'.

interface ProductGridProps {
  products: Product[];
  categoryName: string;
  subcategoryName?: string;
}

export default function ProductGrid({ products, categoryName, subcategoryName }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        No se encontraron productos para los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Mapea los productos y renderiza un ProductCard para cada uno */}
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}