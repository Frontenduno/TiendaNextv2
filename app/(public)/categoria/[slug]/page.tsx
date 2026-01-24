import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // Se quitó SlidersHorizontal (ahora está en MobileFilterSidebar)
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryFilters } from "@/components/category/CategoryFilters";
import { MobileFilterSidebar } from "@/components/category/MobileFilterSidebar"; // <--- NUEVA IMPORTACIÓN
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import { ProductosDataJson } from "@/interfaces/products";
import { Categoria } from "@/interfaces/category";
import { getPriceInfo } from "@/utils/pricing";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// --- UTILIDADES HELPER ---

// 1. Función para normalizar texto a Slug
const normalizeSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "-");
};

// 2. Función recursiva para buscar una categoría por su slug
const findCategoryBySlug = (
  categories: Categoria[],
  targetSlug: string
): Categoria | null => {
  for (const cat of categories) {
    if (normalizeSlug(cat.nombre) === targetSlug) {
      return cat;
    }
    if (cat.subcategorias && cat.subcategorias.length > 0) {
      const found = findCategoryBySlug(cat.subcategorias, targetSlug);
      if (found) return found;
    }
  }
  return null;
};

// 3. Función para obtener todos los IDs de una categoría y sus descendientes
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
  // 1. Obtener parámetros
  const { slug } = await params;
  const { marca, min, max, sort, rating, almacenamiento } = await searchParams;

  // 2. Identificar la Categoría actual
  const currentCategory = findCategoryBySlug(categoriesData.categorias, slug);
  
  const categoryName = currentCategory 
    ? currentCategory.nombre 
    : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  const data = productsData as ProductosDataJson;

  // 3. Filtrado Inicial por Categoría Dinámica
  let filteredProducts = data.productos;

  if (currentCategory) {
    const targetIds = getAllCategoryIds(currentCategory);
    filteredProducts = filteredProducts.filter((p) =>
      p.categorias.some((c) => targetIds.includes(c.idCategoria))
    );
  } else {
    filteredProducts = []; 
  }

  // 4. Aplicar Filtros de URL

  // A) Marca
  if (marca) {
    const marcasSelected = (marca as string).split(",");
    filteredProducts = filteredProducts.filter((p) =>
      marcasSelected.includes(p.marca.nombre)
    );
  }

  // B) Precio
  if (min || max) {
    const minVal = min ? Number(min) : 0;
    const maxVal = max ? Number(max) : Infinity;
    filteredProducts = filteredProducts.filter((p) => {
      const { finalPrice } = getPriceInfo(p);
      return finalPrice >= minVal && finalPrice <= maxVal;
    });
  }

  // C) Rating
  if (rating) {
    const minRating = Number(rating);
    filteredProducts = filteredProducts.filter((p) => {
      const productRating = (p as any).rating || 4.5;
      return productRating >= minRating;
    });
  }

  // D) Almacenamiento
  if (almacenamiento) {
    const storageSelected = (almacenamiento as string).split(",");
    filteredProducts = filteredProducts.filter((p) => {
      const name = p.nombre.toLowerCase();
      const inName = storageSelected.some((s) => 
        name.includes(s.toLowerCase().replace(" ", "")) || name.includes(s.toLowerCase())
      );
      
      const inSpecs = p.especificaciones?.some(spec => 
        spec.nombre === "Almacenamiento" && storageSelected.includes(spec.valor)
      );

      return inName || inSpecs;
    });
  }

  // 5. Ordenamiento
  if (sort === "price_asc") {
    filteredProducts.sort((a, b) => getPriceInfo(a).finalPrice - getPriceInfo(b).finalPrice);
  } else if (sort === "price_desc") {
    filteredProducts.sort((a, b) => getPriceInfo(b).finalPrice - getPriceInfo(a).finalPrice);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        
        {/* Breadcrumbs Dinámicos */}
        <nav className="flex items-center text-xs sm:text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#2c1ff1]">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="font-semibold text-gray-900">{categoryName}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-sm text-gray-500">
            {filteredProducts.length} productos encontrados
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR DESKTOP (Oculto en móvil) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <CategoryFilters />
          </aside>

          {/* CONTENIDO */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              
              {/* BOTÓN DE FILTRO MÓVIL (Ahora funcional) */}
              <MobileFilterSidebar />

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-600 hidden sm:inline">Ordenar por:</span>
                <select className="text-sm font-semibold text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer" defaultValue="relevance">
                  <option value="relevance">Recomendados</option>
                  <option value="price_asc">Menor precio</option>
                  <option value="price_desc">Mayor precio</option>
                </select>
              </div>
            </div>

            {/* GRILLA */}
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
                  No hay productos en la categoría <strong>{categoryName}</strong> por el momento.
                </p>
                <Link href="/" className="text-[#2c1ff1] font-medium hover:underline mt-2 inline-block">
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