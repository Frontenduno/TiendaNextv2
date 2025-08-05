// src/app/page/category/[categorySlug]/[subcategorySlug]/page.tsx
// Daytoy ket maysa a Server Component babaen ti default (awan "use client" na)

import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image'; // Aunque no lo uses directamente aquí, si lo tienes, déjalo.
import CategoryClientPage from './client-page'; // I-import ti baro a Client Component
// I-import ti function a getFilteredProducts ken PRODUCTS_PER_PAGE manipud iti baro a data file
import { getFilteredProducts, Product, PRODUCTS_PER_PAGE } from '@/data/products';

// Dagiti parametro ti URL para iti category page
interface CategoryPageParams {
  params: {
    categorySlug: string;
    subcategorySlug?: string;
  };
  searchParams: {
    page?: string;
    priceRangeMin?: string; // Itan ipasa ti min ken max a sabsabali
    priceRangeMax?: string; // Null para iti S/500+
    brand?: string | string[];
    color?: string | string[];
    sortBy?: string;
  };
}

// Función auxiliar para normalizar slugs a nombres legibles (ej. "lo-nuevo" -> "Lo nuevo")
const normalizeSlugToName = (slug: string) => {
  return decodeURIComponent(slug).replace(/-/g, ' ')
         .split(' ')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ');
};

// El componente Page principal que Next.js espera como exportación por defecto
export default async function CategoryPage({ params, searchParams }: CategoryPageParams) {
  const { categorySlug, subcategorySlug } = params;

  // Extraer la página de los searchParams
  const currentPage = parseInt(searchParams.page || '1', 10);

  // Extraer filtros de los searchParams para la carga inicial del servidor
  let initialPriceRange: { min: number; max: number | null } | undefined;
  const priceRangeMinParam = searchParams.priceRangeMin;
  const priceRangeMaxParam = searchParams.priceRangeMax;

  if (priceRangeMinParam !== undefined && priceRangeMaxParam !== undefined) {
    const min = parseFloat(priceRangeMinParam);
    const max = priceRangeMaxParam === 'null' ? null : parseFloat(priceRangeMaxParam);
    initialPriceRange = { min, max };
  }

  const initialBrand = searchParams.brand ? (Array.isArray(searchParams.brand) ? searchParams.brand : [searchParams.brand]) : undefined;
  const initialColor = searchParams.color ? (Array.isArray(searchParams.color) ? searchParams.color : [searchParams.color]) : undefined;
  const initialSortBy = searchParams.sortBy || 'relevance';

  const initialFilters = {
    priceRange: initialPriceRange,
    brand: initialBrand,
    color: initialColor,
    sortBy: initialSortBy,
  };

  // Obtener los productos iniciales usando la función del servidor
  const { products: initialProducts, totalProducts: initialTotalProducts } = await getFilteredProducts(
    categorySlug,
    subcategorySlug,
    currentPage,
    initialFilters,
    PRODUCTS_PER_PAGE // Asegúrate de que PRODUCTS_PER_PAGE esté definido en '@/data/products'
  );

  // Normalizar los slugs a nombres para la visualización en el cliente
  const categoryName = normalizeSlugToName(categorySlug);
  const subcategoryName = subcategorySlug ? normalizeSlugToName(subcategorySlug) : undefined;

  // Renderiza el Client Component y le pasa todos los datos iniciales
  return (
    <CategoryClientPage
      initialProducts={initialProducts}
      initialTotalProducts={initialTotalProducts}
      initialCurrentPage={currentPage}
      initialCurrentFilters={initialFilters}
      categorySlug={categorySlug} // Pasa el slug crudo para la URL de enrutamiento
      subcategorySlug={subcategorySlug} // Pasa el slug crudo para la URL de enrutamiento
      categoryName={categoryName} // Pasa el nombre amigable para la visualización
      subcategoryName={subcategoryName} // Pasa el nombre amigable para la visualización
      productsPerPage={PRODUCTS_PER_PAGE}
    />
  );
}

// Opcional: Generación de metadatos si lo necesitas
export async function generateMetadata({ params }: CategoryPageParams): Promise<Metadata> {
  const categoryName = normalizeSlugToName(params.categorySlug);
  const subcategoryName = params.subcategorySlug ? normalizeSlugToName(params.subcategorySlug) : undefined;

  const title = subcategoryName
    ? `${subcategoryName} de ${categoryName}`
    : `${categoryName}`;

  const description = subcategoryName
    ? `Explora nuestra colección de ${subcategoryName} de ${categoryName}.`
    : `Descubre todos nuestros productos en la categoría de ${categoryName}.`;

  return {
    title: title,
    description: description,
  };
}