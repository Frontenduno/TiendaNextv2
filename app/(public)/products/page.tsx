"use client";

// Hook para leer los parámetros de búsqueda
import { useSearchParams } from "next/navigation";
// Componente Link de Next.js para la navegación
import Link from "next/link";
// Importamos los productos desde el archivo JSON
import productosData from "@/data/products.json";
// Importamos las interfaces necesarias
import { ProductosDataJson, Producto } from "@/interfaces/products";
// Componente para mostrar cada tarjeta de producto
import { ProductCard } from "@/components/product/ProductCard";

// Número de productos por página
const ITEMS_PER_PAGE = 30; // 5 columnas x 6 filas

// Componente principal de la página de productos
export default function ProductosPage() {
  // Obtenemos los parámetros de la URL
  const searchParams = useSearchParams();
  // Obtenemos el texto de busqueda
  // Si no hay texto, usamos una cadena vacía
  const search = searchParams.get("search")?.toLowerCase() || "";

  // Obtenemos la pagina actual
  // Si no existe, por defecto será la página 1
  const currentPage = Number(searchParams.get("page")) || 1;

  // Convertimos el JSON al tipo esperado
  const data = productosData as ProductosDataJson;

  // Filtramos los productos según el texto buscado
  // Comparamos con el nombre del producto en minúsculas
  const productosFiltrados: Producto[] = data.productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(search),
  );

  // Calculamos cuantas paginas habra en total
  const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);

  // Calculamos los índices de inicio y fin para la paginación
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // Calculamos hasta qué producto mostrar
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Obtenemos solo los productos de la pagina actual
  const productosPaginados = productosFiltrados.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Título con el texto buscado */}
        <h1 className="text-2xl font-bold mb-6">Resultados para: "{search}"</h1>

        {/* Mensaje cuando no hay productos */}
        {productosFiltrados.length === 0 && (
          <p className="text-gray-500">No se encontraron productos</p>
        )}

        {/* Grid de productos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {productosPaginados.map((producto) => (
            <ProductCard key={producto.idProducto} producto={producto} />
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/products?search=${search}&page=${page}`}
              className={`px-3 py-1 rounded border text-sm ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
