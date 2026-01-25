// app/(public)/product/[slug]/page.tsx
import React from 'react';
import { ProductDetailPage } from '@/components/product/ProductDetailPage';
import productosData from '@/data/products.json';
import { Producto, ProductosDataJson } from '@/interfaces/products';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Función para extraer el ID del slug
function extractIdFromSlug(slug: string): number | null {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart);
  return isNaN(id) ? null : id;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = productosData as ProductosDataJson;
  
  // Extraer el ID del slug
  const productId = extractIdFromSlug(slug);
  
  if (!productId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
      </div>
    );
  }

  const producto = data.productos.find(
    (p: Producto) => p.idProducto === productId
  );

  if (!producto) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
      </div>
    );
  }

  return <ProductDetailPage producto={producto} />;
}