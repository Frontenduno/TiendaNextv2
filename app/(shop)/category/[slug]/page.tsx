// app/category/[slug]/page.tsx
import React from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryFilters } from "@/components/category/CategoryFilters";
import { MobileFilterSidebar } from "@/components/category/MobileFilterSidebar";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import { ProductosDataJson, Producto } from "@/interfaces/products";
import { Categoria } from "@/interfaces/category";
import { getPriceInfo } from "@/utils/pricing";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const findCategoryByName = (
  categories: Categoria[],
  targetName: string
): Categoria | null => {
  for (const cat of categories) {
    if (cat.nombre.toLowerCase() === targetName.toLowerCase()) {
      return cat;
    }
    if (cat.subcategorias && cat.subcategorias.length > 0) {
      const found = findCategoryByName(cat.subcategorias, targetName);
      if (found) return found;
    }
  }
  return null;
};

const getAllCategoryIds = (category: Categoria): number[] => {
  let ids = [category.idCategoria];
  if (category.subcategorias) {
    category.subcategorias.forEach((sub) => {
      ids = [...ids, ...getAllCategoryIds(sub)];
    });
  }
  return ids;
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const { marca, min, max, sort, rating, almacenamiento, page } = resolvedSearchParams;

  // Paginación: 2 columnas x 6 filas = 12 productos por página
  const ITEMS_PER_PAGE = 12;
  const currentPage = page && typeof page === 'string' ? parseInt(page) : 1;

  const decodedSlug = decodeURIComponent(slug).replace(/-/g, " ");
  const currentCategory = findCategoryByName(categoriesData.categorias, decodedSlug);

  const categoryName = currentCategory
    ? currentCategory.nombre
    : decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);

  const data = productsData as ProductosDataJson;

  let filteredProducts: Producto[] = data.productos;

  if (currentCategory) {
    const targetIds = getAllCategoryIds(currentCategory);
    filteredProducts = filteredProducts.filter((p) =>
      p.categorias.some((c) => targetIds.includes(c.idCategoria))
    );
  } else {
    filteredProducts = [];
  }

  // Filtros
  if (marca && typeof marca === "string") {
    const marcasSelected = marca.split(",");
    filteredProducts = filteredProducts.filter((p) =>
      marcasSelected.includes(p.marca.nombre)
    );
  }

  if (min || max) {
    const minVal = min && typeof min === "string" ? Number(min) : 0;
    const maxVal = max && typeof max === "string" ? Number(max) : Infinity;
    filteredProducts = filteredProducts.filter((p) => {
      const { finalPrice } = getPriceInfo(p);
      return finalPrice >= minVal && finalPrice <= maxVal;
    });
  }

  if (rating && typeof rating === "string") {
    const minRating = Number(rating);
    filteredProducts = filteredProducts.filter((p) => {
      const productRating = p.calificacion || 0;
      return productRating >= minRating;
    });
  }

  if (almacenamiento && typeof almacenamiento === "string") {
    const storageSelected = almacenamiento.split(",");
    filteredProducts = filteredProducts.filter((p) => {
      if (p.tipoOpcionAdicional === "Almacenamiento" && p.opcionAdicional) {
        return storageSelected.includes(p.opcionAdicional.valor);
      }
      const inSpecs = p.especificaciones?.some(
        (spec) =>
          spec.nombre === "Almacenamiento" &&
          storageSelected.includes(spec.valor)
      );
      return inSpecs;
    });
  }

  // Ordenamiento
  if (sort === "price_asc") {
    filteredProducts.sort(
      (a, b) => getPriceInfo(a).finalPrice - getPriceInfo(b).finalPrice
    );
  } else if (sort === "price_desc") {
    filteredProducts.sort(
      (a, b) => getPriceInfo(b).finalPrice - getPriceInfo(a).finalPrice
    );
  }

  // Calcular paginación
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Construir URL para paginación
  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (marca) params.set('marca', marca.toString());
    if (min) params.set('min', min.toString());
    if (max) params.set('max', max.toString());
    if (sort) params.set('sort', sort.toString());
    if (rating) params.set('rating', rating.toString());
    if (almacenamiento) params.set('almacenamiento', almacenamiento.toString());
    if (pageNum > 1) params.set('page', pageNum.toString());
    
    const queryString = params.toString();
    return `/category/${slug}${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <nav className="flex items-center text-xs sm:text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#2c1ff1]">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="font-semibold text-gray-900">{categoryName}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-sm text-gray-500">
            {totalProducts} productos encontrados
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <CategoryFilters />
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <MobileFilterSidebar />

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Ordenar por:
                </span>
                <select
                  className="text-sm font-semibold text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer"
                  defaultValue="relevance"
                >
                  <option value="relevance">Recomendados</option>
                  <option value="price_asc">Menor precio</option>
                  <option value="price_desc">Mayor precio</option>
                </select>
              </div>
            </div>

            {paginatedProducts.length > 0 ? (
              <>
                {/* Grid de productos - 2 columnas mobile, 3-4 desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {paginatedProducts.map((producto) => (
                    <div key={producto.idProducto} className="h-full">
                      <ProductCard producto={producto} />
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Info de página */}
                    <p className="text-sm text-gray-600">
                      Página {currentPage} de {totalPages} ({startIndex + 1}-{Math.min(endIndex, totalProducts)} de {totalProducts} productos)
                    </p>

                    {/* Botones de navegación */}
                    <div className="flex items-center gap-2">
                      {/* Anterior */}
                      {currentPage > 1 ? (
                        <Link
                          href={buildPageUrl(currentPage - 1)}
                          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-400 cursor-not-allowed">
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </div>
                      )}

                      {/* Números de página */}
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          // Mostrar solo algunas páginas
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <Link
                                key={pageNum}
                                href={buildPageUrl(pageNum)}
                                className={`
                                  w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors
                                  ${pageNum === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }
                                `}
                              >
                                {pageNum}
                              </Link>
                            );
                          } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                          ) {
                            return <span key={pageNum} className="text-gray-400">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      {/* Siguiente */}
                      {currentPage < totalPages ? (
                        <Link
                          href={buildPageUrl(currentPage + 1)}
                          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Siguiente
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-400 cursor-not-allowed">
                          Siguiente
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">
                  No hay productos en la categoría{" "}
                  <strong>{categoryName}</strong> por el momento.
                </p>
                <Link
                  href="/"
                  className="text-[#2c1ff1] font-medium hover:underline mt-2 inline-block"
                >
                  Volver al inicio
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}