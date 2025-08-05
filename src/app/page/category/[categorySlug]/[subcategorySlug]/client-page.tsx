// src/app/page/category/[categorySlug]/[subcategorySlug]/client-page.tsx
"use client"; // ¡IMPORTANTE! Este es un Client Component

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/Category/ProductGrid'; // Asegúrate de que esta ruta sea correcta
import FilterMenu from '@/components/Category/FilterMenu'; // Asegúrate de que esta ruta sea correcta
import Pagination from '@/components/Category/Pagination'; // Importa el nuevo componente de paginación
// Importa la función getFilteredProducts y la definición de Product desde el archivo de datos
import { getFilteredProducts, Product } from '@/data/products';


// Propiedades que el Client Component recibirá del Server Component
interface CategoryClientPageProps {
  initialProducts: Product[];
  initialTotalProducts: number;
  initialCurrentPage: number;
  initialCurrentFilters: {
    priceRange?: { min: number; max: number | null };
    brand?: string[];
    color?: string[];
    sortBy?: string;
  };
  categorySlug: string;
  subcategorySlug?: string;
  categoryName: string;
  subcategoryName?: string;
  productsPerPage: number;
}

/**
 * Componente de página de categoría interactivo (Client Component).
 * Recibe datos iniciales del Server Component y maneja la paginación y filtros.
 */
export default function CategoryClientPage({
  initialProducts,
  initialTotalProducts,
  initialCurrentPage,
  initialCurrentFilters,
  categorySlug: rawCategorySlug, // Renombrado para diferenciar el slug crudo de la prop decodificada
  subcategorySlug: rawSubcategorySlug, // Renombrado
  categoryName, // Este ya es el nombre decodificado para la visualización
  subcategoryName, // Este ya es el nombre decodificado para la visualización
  productsPerPage,
}: CategoryClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados para los productos y la paginación, inicializados con props del servidor
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [currentFilters, setCurrentFilters] = useState<any>(initialCurrentFilters);
  const [isLoading, setIsLoading] = useState(false);

  // Decodificar y normalizar los slugs de la URL para la lógica de filtrado interna del cliente
  const decodedCategorySlug = decodeURIComponent(rawCategorySlug).replace(/-/g, ' ');
  const decodedSubcategorySlug = rawSubcategorySlug ? decodeURIComponent(rawSubcategorySlug).replace(/-/g, ' ') : undefined;


  // Función para cargar productos cuando cambian los filtros o la página
  const fetchProducts = useCallback(async (
    page: number,
    filters: {
      priceRange?: { min: number; max: number | null };
      brand?: string[];
      color?: string[];
      sortBy?: string;
    }
  ) => {
    setIsLoading(true);
    const data = await getFilteredProducts(
      rawCategorySlug, // Pasa los slugs crudos a la función de obtención de datos
      rawSubcategorySlug,
      page,
      filters,
      productsPerPage // Pasa productsPerPage a la función de obtención de datos
    );
    setProducts(data.products);
    setTotalProducts(data.totalProducts);
    setIsLoading(false);
  }, [rawCategorySlug, rawSubcategorySlug, productsPerPage]);


  // Efecto para cargar productos cuando cambian los parámetros de búsqueda de la URL
  // Este es el useEffect corregido para evitar el bucle.
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    
    // Reconstruye el objeto priceRange a partir de los searchParams
    let priceRangeFilterFromUrl: { min: number; max: number | null } | undefined;
    const priceRangeMinParam = searchParams.get('priceRangeMin');
    const priceRangeMaxParam = searchParams.get('priceRangeMax');

    if (priceRangeMinParam !== null && priceRangeMaxParam !== null) {
      const min = parseFloat(priceRangeMinParam);
      const max = priceRangeMaxParam === 'null' ? null : parseFloat(priceRangeMaxParam);
      priceRangeFilterFromUrl = { min, max };
    }

    const brandFromUrl = searchParams.getAll('brand');
    const colorFromUrl = searchParams.getAll('color');
    const sortByFromUrl = searchParams.get('sortBy') || 'relevance';

    const filtersFromUrl = {
      priceRange: priceRangeFilterFromUrl,
      brand: brandFromUrl.length > 0 ? brandFromUrl : undefined,
      color: colorFromUrl.length > 0 ? colorFromUrl : undefined,
      sortBy: sortByFromUrl,
    };

    // Actualiza los estados internos para reflejar la URL.
    // Estas actualizaciones causarán un re-render, pero el useEffect en sí
    // solo depende de searchParams y fetchProducts, previniendo un bucle directo.
    setCurrentPage(pageFromUrl);
    setCurrentFilters(filtersFromUrl);

    // Llama a fetchProducts con los parámetros de la URL directamente.
    // Esto asegura que la obtención de datos se dispare solo cuando la URL cambie.
    fetchProducts(pageFromUrl, filtersFromUrl);

  }, [searchParams, fetchProducts]); // Dependencias: solo searchParams y la callback estable fetchProducts.


  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', page.toString());
    const baseUrl = `/page/category/${rawCategorySlug}${rawSubcategorySlug ? `/${rawSubcategorySlug}` : ''}`;
    router.push(`${baseUrl}?${newSearchParams.toString()}`);
  };

  // Función para manejar la aplicación de filtros
  const handleApplyFilters = (filters: {
    priceRange?: { min: number; max: number | null };
    brand?: string[];
    color?: string[];
    sortBy?: string;
  }) => {
    const newSearchParams = new URLSearchParams();
    if (filters.priceRange) {
      newSearchParams.set('priceRangeMin', filters.priceRange.min.toString());
      newSearchParams.set('priceRangeMax', filters.priceRange.max === null ? 'null' : filters.priceRange.max.toString());
    }
    if (filters.brand && filters.brand.length > 0) {
      filters.brand.forEach((b: string) => newSearchParams.append('brand', b));
    }
    if (filters.color && filters.color.length > 0) {
      filters.color.forEach((c: string) => newSearchParams.append('color', c));
    }
    if (filters.sortBy && filters.sortBy !== 'relevance') {
      newSearchParams.set('sortBy', filters.sortBy);
    } else {
        newSearchParams.delete('sortBy');
    }
    newSearchParams.set('page', '1'); // Siempre resetear a la primera página al aplicar filtros

    const baseUrl = `/page/category/${rawCategorySlug}${rawSubcategorySlug ? `/${rawSubcategorySlug}` : ''}`;
    router.push(`${baseUrl}?${newSearchParams.toString()}`);
  };

  return (
    // Contenedor principal centrado y con espacio entre el menú y los productos
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6 min-h-[70vh]">
      {/* Menú de Filtros (Client Component) */}
      {/* Se ha ajustado el ancho del menú de filtros para que sea más amplio y no se encoja */}
      <div className="md:w-80 md:flex-shrink-0"> {/* Ancho fijo en md y pantallas más grandes (320px), y no se encoge */}
        <FilterMenu onApplyFilters={handleApplyFilters} currentFilters={currentFilters} />
      </div>

      {/* Contenido principal: Título, Paginación superior y Cuadrícula de Productos */}
      <div className="flex-grow flex flex-col">
        {/* Título de la categoría/subcategoría */}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 text-center md:text-left">
          {subcategoryName ? (
            <>
              {subcategoryName.charAt(0).toUpperCase() + subcategoryName.slice(1)}{' '}
              <span className="text-blue-600">de</span>{' '}
              {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
            </>
          ) : (
            `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}`
          )}
        </h1>

        {/* Paginación superior */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Cuadrícula de Productos (Client Component) */}
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center h-64 text-gray-500 text-lg">Cargando productos...</div>
        ) : (
          <ProductGrid
            products={products}
            categoryName={categoryName}
            subcategoryName={subcategoryName}
          />
        )}

        {/* Paginación inferior (opcional, si se desea mantener también abajo) */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
