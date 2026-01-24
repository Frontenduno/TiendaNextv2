"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Mapeo de rutas a nombres legibles
const routeLabels: Record<string, string> = {
  "legal": "Legal",
  "terminos-y-condiciones": "Términos y Condiciones",
  "politica-de-privacidad": "Política de Privacidad",
  "politica-de-cookies": "Política de Cookies",
  "politica-de-envio": "Política de Envío",
  "politica-de-devolucion": "Política de Devolución",
  "preguntas-frecuentes": "Preguntas Frecuentes",
  "guia-de-tallas": "Guía de Tallas",
  "tutoriales-de-compra": "Tutoriales de Compra",
  "customer-service": "Servicio al Cliente",
  "locations": "Tiendas",
  "product": "Producto",
  "footer": "footer"
};

// Rutas que no tienen página propia (solo son agrupadores)
const nonClickableRoutes = new Set(["legal", "customer-service", "locations", "footer"]);

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // No mostrar en la página de inicio
  if (pathname === "/" || pathname === "") {
    return null;
  }

  // Generar los items del breadcrumb basados en la ruta
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  
  const breadcrumbItems: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    
    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <ol className="flex items-center gap-1 py-3 text-sm overflow-x-auto">
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
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
                <span className={`truncate max-w-50 sm:max-w-none ${isLast ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-blue-600 transition-colors truncate max-w-37.5 sm:max-w-none"
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
