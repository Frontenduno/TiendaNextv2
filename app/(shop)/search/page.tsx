"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import productosData from "@/data/products.json";
import { ProductosDataJson, Producto } from "@/interfaces/products";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroBanner } from "@/components/shared/HeroBanner";

const ITEMS_PER_PAGE = 30;

export default function ProductosPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const data = productosData as ProductosDataJson;

  const productosFiltrados: Producto[] = data.productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(search),
  );

  const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const productosPaginados = productosFiltrados.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroBanner
          title="Resultados de Búsqueda"
          subtitle={`${productosFiltrados.length} ${productosFiltrados.length === 1 ? 'producto encontrado' : 'productos encontrados'}`}
          gradient="from-blue-600 to-blue-800"
          padding="p-6 sm:p-8 mb-8"
          titleClassName="text-2xl sm:text-3xl"
          subtitleClassName="text-base sm:text-lg"
        />

        {productosFiltrados.length === 0 && (
          <p className="text-gray-500 text-center py-12">No se encontraron productos</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {productosPaginados.map((producto) => (
            <ProductCard key={producto.idProducto} producto={producto} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-4">
            <Link
              href={`/search?search=${search}&page=${Math.max(1, currentPage - 1)}`}
              className={`px-4 py-2 border font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
              aria-disabled={currentPage === 1}
            >
              ← Anterior
            </Link>

            <span className="text-gray-700 font-medium">
              Página {currentPage} de {totalPages}
            </span>

            <Link
              href={`/search?search=${search}&page=${Math.min(totalPages, currentPage + 1)}`}
              className={`px-4 py-2 border font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
              aria-disabled={currentPage === totalPages}
            >
              Siguiente →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}