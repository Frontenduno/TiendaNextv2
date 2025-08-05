// app/page.tsx
"use client"; // Marca este componente como un Client Component

import React from 'react';
import Body from '@/view/body'; // Asegúrate de que la ruta sea correcta
import { Product, sampleProducts } from '@/data/products'; // Importa la interfaz y los datos de ejemplo

/**
 * Componente principal de la página de inicio.
 * Se encarga de preparar los datos y pasarlos al componente Body.
 */
export default function Home() {
  // Filtra los productos para las secciones "Nuevos productos" y "Precios rebajados"
  const newProducts: Product[] = sampleProducts.filter(product => product.tag === 'Nuevo');
  const discountedProducts: Product[] = sampleProducts.filter(product => product.oldPrice);

  return (
    // Renderiza el componente Body, pasándole los productos filtrados
    <Body
      newProducts={newProducts}
      discountedProducts={discountedProducts}
    />
  );
}
