"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronUp, X, Star } from "lucide-react";

// Definimos la estructura del estado de los filtros
export interface FilterState {
  marca: string[];
  min: string;
  max: string;
  rating: string | null;
  almacenamiento: string[];
}

interface CategoryFiltersProps {
  // Props opcionales para control manual (Modo Móvil)
  manualState?: FilterState;
  onManualChange?: (newState: FilterState) => void;
}

export const CategoryFilters = ({ manualState, onManualChange }: CategoryFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- 1. DETERMINAR LA FUENTE DE LA VERDAD ---
  const isManual = !!manualState;

  // Valores actuales (calculados)
  const currentValues: FilterState = manualState || {
    marca: searchParams.get("marca")?.split(",") || [],
    min: searchParams.get("min") || "",
    max: searchParams.get("max") || "",
    rating: searchParams.get("rating"),
    almacenamiento: searchParams.get("almacenamiento")?.split(",") || [],
  };

  // Estados locales solo para los inputs de texto (con valores iniciales directos)
  const [localMin, setLocalMin] = useState(currentValues.min);
  const [localMax, setLocalMax] = useState(currentValues.max);

  // --- 2. LÓGICA DE ACTUALIZACIÓN ---

  const applyChange = (newState: FilterState) => {
    if (isManual && onManualChange) {
      // MODO MÓVIL: Solo actualizamos el estado en memoria del padre
      onManualChange(newState);
    } else {
      // MODO DESKTOP: Actualizamos la URL directamente
      const params = new URLSearchParams(Array.from(searchParams.entries()));

      // Actualizar array de Marcas
      if (newState.marca.length > 0) params.set("marca", newState.marca.join(","));
      else params.delete("marca");

      // Actualizar array de Almacenamiento
      if (newState.almacenamiento.length > 0) params.set("almacenamiento", newState.almacenamiento.join(","));
      else params.delete("almacenamiento");

      // Actualizar Rating
      if (newState.rating) params.set("rating", newState.rating);
      else params.delete("rating");

      // Actualizar Precios
      if (newState.min) params.set("min", newState.min); 
      else params.delete("min");
      if (newState.max) params.set("max", newState.max); 
      else params.delete("max");

      params.delete("page"); // Reset paginación
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  // --- HANDLERS ESPECÍFICOS ---

  const handleBrandChange = (brand: string) => {
    const newBrands = currentValues.marca.includes(brand)
      ? currentValues.marca.filter((b) => b !== brand)
      : [...currentValues.marca, brand];
    
    applyChange({ ...currentValues, marca: newBrands });
  };

  const handleStorageChange = (storage: string) => {
    const newStorage = currentValues.almacenamiento.includes(storage)
      ? currentValues.almacenamiento.filter((s) => s !== storage)
      : [...currentValues.almacenamiento, storage];

    applyChange({ ...currentValues, almacenamiento: newStorage });
  };

  const handleRatingChange = (rating: string) => {
    const newRating = currentValues.rating === rating ? null : rating;
    applyChange({ ...currentValues, rating: newRating });
  };

  const applyPriceFilter = () => {
    applyChange({ ...currentValues, min: localMin, max: localMax });
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applyPriceFilter();
  };

  const hasFilters = 
    currentValues.marca.length > 0 || 
    currentValues.almacenamiento.length > 0 || 
    !!currentValues.rating || 
    !!currentValues.min || 
    !!currentValues.max;

  const clearAll = () => {
    setLocalMin("");
    setLocalMax("");
    if (isManual && onManualChange) {
      onManualChange({ marca: [], min: "", max: "", rating: null, almacenamiento: [] });
    } else {
      router.push(pathname);
    }
  };

  // --- MARCAS Y OPCIONES BASADAS EN EL JSON REAL ---
  const brands = ["Apple", "Samsung", "Xiaomi", "Motorola", "Sony", "LG", "Razer", "ASUS", "Nike", "Levi's"];
  const storageOptions = ["256GB", "512GB", "1TB"];

  return (
    <div className="w-full space-y-6">
      
      {/* Header Desktop */}
      {!isManual && (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">Filtros</h2>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-[#2c1ff1] font-semibold hover:underline flex items-center gap-1">
              Limpiar todo <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* 1. FILTRO: MARCAS */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex justify-between items-center">
          Marca <ChevronUp className="w-4 h-4 text-gray-500" />
        </h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentValues.marca.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 rounded border-gray-300 text-[#2c1ff1] focus:ring-[#2c1ff1] cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#2c1ff1] transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. FILTRO: PRECIO */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex justify-between items-center">
          Precio <ChevronUp className="w-4 h-4 text-gray-500" />
        </h3>
        <div className="flex gap-2 mt-3 items-center">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">S/</span>
            <input
              type="number"
              placeholder="Mín"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              onBlur={applyPriceFilter}
              onKeyDown={handlePriceKeyDown}
              className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:border-[#2c1ff1] outline-none"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">S/</span>
            <input
              type="number"
              placeholder="Máx"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              onBlur={applyPriceFilter}
              onKeyDown={handlePriceKeyDown}
              className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:border-[#2c1ff1] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. FILTRO: CALIFICACIÓN */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex justify-between items-center">
          Calificación <ChevronUp className="w-4 h-4 text-gray-500" />
        </h3>
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => handleRatingChange(stars.toString())}
              className={`flex items-center gap-2 text-sm w-full hover:bg-gray-50 p-1.5 rounded transition-colors ${
                currentValues.rating === stars.toString() ? "bg-blue-50 ring-1 ring-blue-100" : ""
              }`}
            >
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={`${i < stars ? "fill-current" : "text-gray-300 fill-transparent"}`} />
                ))}
              </div>
              <span className={`text-xs ${currentValues.rating === stars.toString() ? "font-semibold text-[#2c1ff1]" : "text-gray-500"}`}>
                & más
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. FILTRO: ALMACENAMIENTO */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex justify-between items-center">
          Almacenamiento <ChevronUp className="w-4 h-4 text-gray-500" />
        </h3>
        <div className="space-y-2">
          {storageOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentValues.almacenamiento.includes(option)}
                onChange={() => handleStorageChange(option)}
                className="w-4 h-4 rounded border-gray-300 text-[#2c1ff1] focus:ring-[#2c1ff1] cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#2c1ff1] transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};