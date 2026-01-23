// layouts/public/FooterPublic.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShoppingBag, HelpCircle, FileText, Store } from "lucide-react";
import { LibroReclamaciones } from "./feature/libro-reclamaciones";

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
            <p className="text-sm text-gray-200 mb-4 text-left">
              Tu tienda online de confianza para encontrar los mejores productos.
            </p>
            <div className="flex gap-3 justify-start">
              <Link href="https://www.facebook.com/JYPPERIFERICOSSA/?locale=es_LA" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="https://www.instagram.com/jypsac/" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="https://x.com/jypsac" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-left">
              <HelpCircle className="w-5 h-5" />
              Servicio al cliente
            </h3>
            <ul className="space-y-2 text-sm text-left">
              <li>
                <Link href="/footer/customer-service/preguntas-frecuentes" className="hover:text-gray-300 transition-colors hover:underline">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/footer/customer-service/guia-de-tallas" className="hover:text-gray-300 transition-colors hover:underline">
                  Guía de tallas
                </Link>
              </li>
              <li>
                <Link href="/footer/customer-service/tutoriales-de-compra" className="hover:text-gray-300 transition-colors hover:underline">
                  Tutoriales de compra
                </Link>
              </li>
              <li>
                <Link href="/footer/customer-service/politica-de-envio" className="hover:text-gray-300 transition-colors hover:underline">
                  Política de envío
                </Link>
              </li>
              <li>
                <Link href="/footer/customer-service/politica-de-devolucion" className="hover:text-gray-300 transition-colors hover:underline">
                  Política de devolución
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-left">
              <Mail className="w-5 h-5" />
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-left">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Av. Principal 123, Lima, Perú</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 shrink-0" />
                <a href="tel:+51999999999" className="hover:text-gray-300 transition-colors">
                  +51 999 999 999
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 shrink-0" />
                <a href="mailto:contacto@mitienda.com" className="hover:text-gray-300 transition-colors">
                  contacto@mitienda.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-left">
              <Store className="w-5 h-5" />
              Nuestras tiendas
            </h3>
            <ul className="space-y-2 text-sm text-left">
              <li>
                <Link href="/footer/locations/lima-centro" className="hover:text-gray-300 transition-colors hover:underline">
                  Lima Centro
                </Link>
              </li>
              <li>
                <Link href="/footer/locations/miraflores" className="hover:text-gray-300 transition-colors hover:underline">
                  Miraflores
                </Link>
              </li>
              <li>
                <Link href="/footer/locations/san-isidro" className="hover:text-gray-300 transition-colors hover:underline">
                  San Isidro
                </Link>
              </li>
              <li>
                <Link href="/footer/locations/surco" className="hover:text-gray-300 transition-colors hover:underline">
                  Surco
                </Link>
              </li>
              <li>
                <Link href="/footer/locations/todos" className="hover:text-gray-300 transition-colors hover:underline font-semibold">
                  Ver todas las tiendas →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-left">
              <FileText className="w-5 h-5" />
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-left">
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
                <Link href="/footer/legal/terminos-y-condiciones" className="hover:text-gray-300 transition-colors hover:underline">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/footer/legal/politica-de-privacidad" className="hover:text-gray-300 transition-colors hover:underline">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/footer/legal/politica-de-cookies" className="hover:text-gray-300 transition-colors hover:underline">
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