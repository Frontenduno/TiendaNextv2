"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { CategoryFilters, FilterState } from "./CategoryFilters";

export const MobileFilterSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Estado local "Borrador" para los filtros
  const [tempFilters, setTempFilters] = useState<FilterState>({
    marca: [],
    min: "",
    max: "",
    rating: null,
    almacenamiento: [],
  });

  // Cuando se abre el sidebar, sincronizamos el estado local con la URL actual
  useEffect(() => {
    if (isOpen) {
      setTempFilters({
        marca: searchParams.get("marca")?.split(",") || [],
        min: searchParams.get("min") || "",
        max: searchParams.get("max") || "",
        rating: searchParams.get("rating"),
        almacenamiento: searchParams.get("almacenamiento")?.split(",") || [],
      });
      // Bloquear scroll del body
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen, searchParams]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (tempFilters.marca.length > 0) params.set("marca", tempFilters.marca.join(","));
    if (tempFilters.almacenamiento.length > 0) params.set("almacenamiento", tempFilters.almacenamiento.join(","));
    if (tempFilters.rating) params.set("rating", tempFilters.rating);
    if (tempFilters.min) params.set("min", tempFilters.min);
    if (tempFilters.max) params.set("max", tempFilters.max);

    // Resetear paginación y empujar URL
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setTempFilters({
      marca: [],
      min: "",
      max: "",
      rating: null,
      almacenamiento: [],
    });
  };

  return (
    <>
      {/* Botón Disparador */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-900 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtrar
      </button>

      {/* --- SIDEBAR CONTAINER --- */}
      {/* Usamos visibilidad y transform para animar la entrada/salida suavemente */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-visibility duration-300 ${
            isOpen ? "visible" : "invisible delay-300"
        }`}
      >
        
        {/* 1. BACKDROP (Fondo Oscuro) */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* 2. PANEL DESLIZANTE (Desde la IZQUIERDA) */}
        <div
          className={`absolute inset-y-0 left-0 w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-5">
            <CategoryFilters 
                manualState={tempFilters} 
                onManualChange={setTempFilters} 
            />
          </div>

          {/* Footer Fijo */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3">
            <button
                onClick={handleClearFilters}
                className="flex-1 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
            >
                Limpiar
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-[2] bg-[#2c1ff1] text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/30"
            >
              Ver resultados
            </button>
          </div>
        </div>
      </div>
    </>
  );
};