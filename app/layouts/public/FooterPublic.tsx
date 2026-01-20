// layouts/public/FooterPublic.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShoppingBag, HelpCircle, FileText, Store } from "lucide-react";
import { LibroReclamaciones } from "./components/libro-reclamaciones";

export default function FooterPublic() {
  const [isReclamacionesOpen, setIsReclamacionesOpen] = useState(false);

  return (
    <footer className="w-full bg-[#2c1ff1] text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image 
                src="/logo.png" 
                alt="MiTienda Logo" 
                width={180} 
                height={60}
                className="h-16 w-auto brightness-0 invert hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-sm text-gray-200 mb-4">
              Tu tienda online de confianza para encontrar los mejores productos.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Servicio al cliente
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/preguntas-frecuentes" className="hover:text-gray-300 transition-colors hover:underline">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/guias-tallas" className="hover:text-gray-300 transition-colors hover:underline">
                  Guías de tallas
                </Link>
              </li>
              <li>
                <Link href="/tutoriales" className="hover:text-gray-300 transition-colors hover:underline">
                  Tutoriales de compra
                </Link>
              </li>
              <li>
                <Link href="/politica-envios" className="hover:text-gray-300 transition-colors hover:underline">
                  Política de envíos
                </Link>
              </li>
              <li>
                <Link href="/politica-devolucion" className="hover:text-gray-300 transition-colors hover:underline">
                  Política de devolución
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Av. Principal 123, Lima, Perú</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+51999999999" className="hover:text-gray-300 transition-colors">
                  +51 999 999 999
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:contacto@mitienda.com" className="hover:text-gray-300 transition-colors">
                  contacto@mitienda.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Store className="w-5 h-5" />
              Nuestras tiendas
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/locations/lima-centro" className="hover:text-gray-300 transition-colors hover:underline">
                  Lima Centro
                </Link>
              </li>
              <li>
                <Link href="/locations/miraflores" className="hover:text-gray-300 transition-colors hover:underline">
                  Miraflores
                </Link>
              </li>
              <li>
                <Link href="/locations/san-isidro" className="hover:text-gray-300 transition-colors hover:underline">
                  San Isidro
                </Link>
              </li>
              <li>
                <Link href="/locations/surco" className="hover:text-gray-300 transition-colors hover:underline">
                  Surco
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-gray-300 transition-colors hover:underline font-semibold">
                  Ver todas las tiendas →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => setIsReclamacionesOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-semibold"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Libro de reclamaciones
                </button>
              </li>
              <li className="pt-2">
                <Link href="/terminos-condiciones" className="hover:text-gray-300 transition-colors hover:underline">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="hover:text-gray-300 transition-colors hover:underline">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/politica-cookies" className="hover:text-gray-300 transition-colors hover:underline">
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-gray-200">
          <p>&copy; {new Date().getFullYear()} MiTienda. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Modal de Libro de Reclamaciones */}
      <LibroReclamaciones
        isOpen={isReclamacionesOpen}
        onClose={() => setIsReclamacionesOpen(false)}
      />
    </footer>
  );
}