"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import { Categoria } from "@/interfaces/category";
import { ProductosDataJson, Producto } from "@/interfaces/products";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeLabels: Record<string, string> = {
  legal: "Legal",
  "terminos-y-condiciones": "Términos y Condiciones",
  "politica-de-privacidad": "Política de Privacidad",
  "politica-de-cookies": "Política de Cookies",
  "politica-de-envio": "Política de Envío",
  "politica-de-devolucion": "Política de Devolución",
  "preguntas-frecuentes": "Preguntas Frecuentes",
  "guia-de-tallas": "Guía de Tallas",
  "tutoriales-de-compra": "Tutoriales de Compra",
  "customer-service": "Servicio al Cliente",
  locations: "Tiendas",
  product: "Producto",
  categoria: "Categorías",
  search: "Búsqueda",
  cart: "Carrito",
  footer: "footer",
};

const nonClickableRoutes = new Set([
  "legal",
  "customer-service",
  "locations",
  "footer",
  "categoria",
]);

// Buscar categoría por nombre
const findCategoryByName = (categories: Categoria[], targetName: string): Categoria | null => {
  for (const cat of categories) {
    if (cat.nombre.toLowerCase() === targetName.toLowerCase()) return cat;
    if (cat.subcategorias?.length) {
      const found = findCategoryByName(cat.subcategorias, targetName);
      if (found) return found;
    }
  }
  return null;
};

// Buscar producto por slug o ID
const findProduct = (productos: Producto[], slugOrId: string): Producto | null => {
  const byId = productos.find((p) => String(p.idProducto) === slugOrId);
  if (byId) return byId;
  const decoded = decodeURIComponent(slugOrId).replace(/-/g, " ").toLowerCase();
  return productos.find((p) => p.nombre.toLowerCase() === decoded) || null;
};

const getReadableLabel = (segment: string, previousSegment?: string, searchTerm?: string): string => {
  if (routeLabels[segment]) return routeLabels[segment];

  if (previousSegment === "categoria") {
    const decoded = decodeURIComponent(segment).replace(/-/g, " ");
    const category = findCategoryByName(categoriesData.categorias, decoded);
    if (category) return category.nombre;
  }

  if (previousSegment === "product") {
    const product = findProduct((productsData as ProductosDataJson).productos, segment);
    if (product) return product.nombre;
  }

  if (segment === "search" && searchTerm) {
    return `Búsqueda: ${searchTerm}`;
  }

  const decoded = decodeURIComponent(segment).replace(/-/g, " ");
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || undefined;

  if (pathname === "/" || pathname === "") return null;

  const pathSegments = pathname.split("/").filter((s) => s !== "");

  const breadcrumbItems: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const prev = index > 0 ? pathSegments[index - 1] : undefined;
    const label = getReadableLabel(segment, prev, searchTerm);
    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <ol className="flex items-center gap-1 py-3 text-sm overflow-x-auto">
          <li className="flex items-center">
            <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          </li>

          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isNonClickable = nonClickableRoutes.has(pathSegments[index]);

            return (
              <li key={item.href} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1 shrink-0" />
                {isLast || isNonClickable ? (
                  <span className={`truncate max-w-[200px] sm:max-w-none ${isLast ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-blue-600 transition-colors truncate max-w-[150px] sm:max-w-none"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
