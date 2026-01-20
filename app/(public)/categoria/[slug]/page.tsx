import React from "react";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryFilters } from "@/components/category/CategoryFilters";
import productsData from "@/data/products.json";
import { Producto, ProductosDataJson } from "@/interfaces/products";
import { getPriceInfo } from "@/utils/pricing";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  // 1. Obtener parámetros de URL y Ruta
  const { slug } = await params;
  // Extraemos todos los parámetros posibles, incluyendo los nuevos
  const { marca, min, max, sort, rating, almacenamiento } = await searchParams;

  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  const data = productsData as ProductosDataJson;

  // 2. Filtrado Inicial por Categoría (Slug)
  let filteredProducts = data.productos;

  if (slug.includes("smartphones") || slug.includes("celulares")) {
    filteredProducts = filteredProducts.filter((p) =>
      p.categorias.some((c) => c.idCategoria === 11 || c.idCategoria === 111)
    );
  } else {
    // Lógica para otras categorías...
  }

  // 3. Aplicar Filtros de URL

  // A) Filtro por Marca
  if (marca) {
    const marcasSelected = (marca as string).split(",");
    filteredProducts = filteredProducts.filter((p) =>
      marcasSelected.includes(p.marca.nombre)
    );
  }

  // B) Filtro por Precio (Precio Final con Descuento)
  if (min || max) {
    const minVal = min ? Number(min) : 0;
    const maxVal = max ? Number(max) : Infinity;

    filteredProducts = filteredProducts.filter((p) => {
      const { finalPrice } = getPriceInfo(p);
      return finalPrice >= minVal && finalPrice <= maxVal;
    });
  }

  // C) Filtro por Calificación (NUEVO)
  if (rating) {
    const minRating = Number(rating);
    filteredProducts = filteredProducts.filter((p) => {
      // NOTA: Asegúrate de que tu interfaz 'Producto' y tu JSON tengan una propiedad para la calificación.
      // Si no la tienes, puedes simularla aleatoriamente o usar una propiedad existente.
      // Aquí asumimos que existe 'p.calificacion' o 'p.rating'. Si no, usamos 0 por defecto.
      const productRating = (p as any).calificacion || (p as any).rating || 4.5; // Fallback a 4.5 para demo si no existe dato
      return productRating >= minRating;
    });
  }

  // D) Filtro por Almacenamiento (NUEVO)
  if (almacenamiento) {
    const storageSelected = (almacenamiento as string).split(",");

    filteredProducts = filteredProducts.filter((p) => {
      // Estrategia: Buscamos el texto (ej: "128 GB") en el nombre del producto
      // Esto funciona bien si tus productos se llaman "iPhone 13 128GB", etc.
      const name = p.nombre.toLowerCase();

      return storageSelected.some((storage) => {
        const cleanStorage = storage.toLowerCase().replace(" ", ""); // "128gb"
        return (
          name.includes(cleanStorage) || name.includes(storage.toLowerCase())
        );
      });
    });
  }

  // 4. Ordenamiento
  if (sort === "price_asc") {
    filteredProducts.sort((a, b) => {
      const priceA = getPriceInfo(a).finalPrice;
      const priceB = getPriceInfo(b).finalPrice;
      return priceA - priceB;
    });
  } else if (sort === "price_desc") {
    filteredProducts.sort((a, b) => {
      const priceA = getPriceInfo(a).finalPrice;
      const priceB = getPriceInfo(b).finalPrice;
      return priceB - priceA;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs sm:text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#2c1ff1]">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <Link href="#" className="hover:text-[#2c1ff1]">
            Tecnología
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="font-semibold text-gray-900">{categoryName}</span>
        </nav>

        {/* Título y Contadores */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-sm text-gray-500 flex flex-wrap gap-2 items-center">
            <span>{filteredProducts.length} productos encontrados</span>

            {/* Etiquetas informativas de filtros activos */}
            {marca && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                Marca: {marca}
              </span>
            )}
            {(min || max) && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                Precio ajustado
              </span>
            )}
            {rating && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                {rating}+ Estrellas
              </span>
            )}
            {almacenamiento && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                {almacenamiento}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <CategoryFilters />
          </aside>

          {/* CONTENIDO PRINCIPAL */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <button className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-900 border border-gray-300 rounded-full px-4 py-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtrar
              </button>

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

            {/* GRILLA DE PRODUCTOS */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((producto) => (
                  <div key={producto.idProducto} className="h-full">
                    <ProductCard producto={producto} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">
                  No encontramos productos con esos filtros.
                </p>
                <Link
                  href={`/categoria/${slug}`}
                  className="text-[#2c1ff1] font-medium hover:underline mt-2 inline-block"
                >
                  Limpiar filtros
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
