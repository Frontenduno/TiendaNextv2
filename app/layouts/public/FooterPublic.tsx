"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShoppingBag, HelpCircle, FileText, Store } from "lucide-react";
import { LibroReclamaciones } from "./components/libro-reclamaciones";

// Componente de icono de WhatsApp personalizado
const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function FooterPublic() {
  const [isReclamacionesOpen, setIsReclamacionesOpen] = useState(false);

  const whatsappNumber = "51934151098";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

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
              <Link href="https://www.facebook.com/JYPPERIFERICOSSA/?locale=es_LA" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="https://www.instagram.com/jypsac/" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="https://x.com/jypsac" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href={whatsappLink} className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-5 h-5" />
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
                <a href="tel:+51934151098" className="hover:text-gray-300 transition-colors">
                  +51 934 151 098
                </a>
              </li>
              <li className="flex items-center gap-2">
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  +51 934 151 098
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

      <LibroReclamaciones
        isOpen={isReclamacionesOpen}
        onClose={() => setIsReclamacionesOpen(false)}
      />
    </footer>
  );
}