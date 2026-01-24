import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

// Buscar categoría por su nombre exactamente como aparece en el JSON
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
  const { marca, min, max, sort, rating, almacenamiento } = resolvedSearchParams;

  // Buscar categoría usando el nombre original (sin slugify)
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

  // Filtro: Marca
  if (marca && typeof marca === "string") {
    const marcasSelected = marca.split(",");
    filteredProducts = filteredProducts.filter((p) =>
      marcasSelected.includes(p.marca.nombre)
    );
  }

  // Filtro: Precio
  if (min || max) {
    const minVal = min && typeof min === "string" ? Number(min) : 0;
    const maxVal = max && typeof max === "string" ? Number(max) : Infinity;
    filteredProducts = filteredProducts.filter((p) => {
      const { finalPrice } = getPriceInfo(p);
      return finalPrice >= minVal && finalPrice <= maxVal;
    });
  }

  // Filtro: Rating
  if (rating && typeof rating === "string") {
    const minRating = Number(rating);
    filteredProducts = filteredProducts.filter((p) => {
      const productRating = p.calificacion || 0;
      return productRating >= minRating;
    });
  }

  // Filtro: Almacenamiento
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
            {filteredProducts.length} productos encontrados
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
