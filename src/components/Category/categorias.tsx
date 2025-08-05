'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

const categorias = [
  { name: "Lo nuevo", sub: ["Zapatillas", "Ropa", "Accesorios"] },
  { name: "Hombre", sub: ["Zapatillas", "Sandalias", "Camisetas", "Pantalones", "Poleras", "Shorts", "Buzos"] },
  { name: "Mujer", sub: ["Zapatillas", "Sandalias", "Tops", "Poleras", "Leggings", "Bolsos"] },
  { name: "Niños", sub: ["Zapatillas", "Sandalias", "Camisetas", "Poleras", "Buzos"] },
  { name: "Descuento", sub: ["Ofertas del día", "2x1", "Outlet"] },
  { name: "Marcas", sub: ["Nike", "Adidas", "Puma", "Jordan", "Skechers", "Under Armour"] },
  { name: "Deporte", sub: ["Running", "Gym", "Fútbol", "Voley", "Basquet"] },
];

export default function Categoria() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setHoveredIndex(null);
      }
    };
    document.addEventListener('mousemove', handleMouseLeave);
    return () => document.removeEventListener('mousemove', handleMouseLeave);
  }, []);

  const getSubcategoryUrl = (categoryName: string, subitemName: string) => {
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");
    const subitemSlug = subitemName.toLowerCase().replace(/\s+/g, "-");
    return `/page/category/${categorySlug}/${subitemSlug}`;
  };

  return (
    <nav ref={navRef} className="bg-white shadow border-t border-gray-200 relative z-20">
      <ul className="hidden md:flex justify-center items-center text-sm font-semibold text-gray-800 py-5 flex-wrap">
        {categorias.map((item, idx) => (
          <div
            key={item.name}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHoveredIndex(idx)}
          >
            <div className="flex items-center">
              <li className="mx-4 list-none">
                <span className="text-lg lg:text-xl text-black font-semibold cursor-pointer hover:text-blue-600 flex items-center gap-2">
                  {item.name}
                  {item.sub && (
                    <FaChevronDown
                      className={`transition-transform duration-200 ${hoveredIndex === idx ? 'rotate-180' : ''}`}
                    />
                  )}
                </span>
              </li>
              {idx !== categorias.length - 1 && (<div className="h-5 border-l border-gray-300 mx-2" />)}
            </div>
          </div>
        ))}
      </ul>

      {hoveredIndex !== null && categorias[hoveredIndex]?.sub && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg py-8 z-30">
          <div className="w-full px-12 flex flex-wrap justify-center gap-12">
            {/* Mostramos todas las subcategorías como si fueran títulos de columna */}
            {categorias[hoveredIndex].sub.map((subitem) => (
              <div key={subitem} className="flex flex-col min-w-[150px]">
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  <Link href={getSubcategoryUrl(categorias[hoveredIndex].name, subitem)} className="hover:text-blue-600">
                    {subitem}
                  </Link>
                </h3>
                {/* Espacio reservado para posibles filtros */}
                <ul className="space-y-1 text-sm text-gray-500 opacity-0 select-none">
                  <li>-</li>
                  <li>-</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
