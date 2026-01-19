// app/(public)/product/[id]/page.tsx
import React from 'react';
import { ProductDetailPage } from '@/components/product/ProductDetailPage';
import productosData from '@/data/products.json';
import { Producto, ProductosDataJson } from '@/interfaces/products';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const data = productosData as ProductosDataJson;
  
  const producto = data.productos.find(
    (p: Producto) => p.idProducto === parseInt(id)
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