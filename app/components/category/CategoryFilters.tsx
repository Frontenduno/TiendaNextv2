"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, Star, X } from "lucide-react";

export const CategoryFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- ESTADOS LOCALES ---
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

  // Sincronizar inputs si la URL cambia externamente
  useEffect(() => {
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  // --- LECTURA DE URL ---
  const selectedBrands = searchParams.get("marca")?.split(",") || [];
  const selectedStorage = searchParams.get("almacenamiento")?.split(",") || [];
  const currentRating = searchParams.get("rating");

  // Detectar si hay algún filtro activo para mostrar el botón "Limpiar"
  const hasFilters =
    selectedBrands.length > 0 ||
    selectedStorage.length > 0 ||
    !!currentRating ||
    !!searchParams.get("min") ||
    !!searchParams.get("max");

  // --- FUNCIONES DE ACTUALIZACIÓN ---

  // Función genérica para actualizar arrays (Marcas, Almacenamiento, etc.)
  const updateArrayFilter = (key: string, values: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (values.length === 0) {
      current.delete(key);
    } else {
      current.set(key, values.join(","));
    }
    
    current.delete("page"); // Siempre resetear paginación
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  // Función genérica para actualizar valores únicos (Rating)
  const updateSingleFilter = (key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    
    current.delete("page");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  // 1. Manejador de Marcas
  const handleBrandChange = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    updateArrayFilter("marca", newBrands);
  };

  // 2. Manejador de Almacenamiento
  const handleStorageChange = (storage: string) => {
    const newStorage = selectedStorage.includes(storage)
      ? selectedStorage.filter((s) => s !== storage)
      : [...selectedStorage, storage];
    updateArrayFilter("almacenamiento", newStorage);
  };

  // 3. Manejador de Rating
  const handleRatingChange = (rating: string) => {
    // Si ya está seleccionado, lo quitamos (toggle)
    if (currentRating === rating) {
      updateSingleFilter("rating", null);
    } else {
      updateSingleFilter("rating", rating);
    }
  };

  // 4. Manejador de Precio
  const applyPriceFilter = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (minPrice && !isNaN(Number(minPrice))) current.set("min", minPrice);
    else current.delete("min");

    if (maxPrice && !isNaN(Number(maxPrice))) current.set("max", maxPrice);
    else current.delete("max");

    current.delete("page");
    const search = current.toString();
    router.push(`${pathname}?${search}`, { scroll: false });
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applyPriceFilter();
  };

  // --- DATOS ESTÁTICOS (Mock) ---
  const brands = ["Apple", "Samsung", "Xiaomi", "Motorola", "Honor"];
  const storageOptions = ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"];

  return (
    <div className="w-full space-y-6">
      
      {/* HEADER: Título y Botón Limpiar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h2 className="font-bold text-lg text-gray-900">Filtros</h2>
        {hasFilters && (
          <button
            onClick={() => router.push(pathname)}
            className="text-xs text-[#2c1ff1] font-semibold hover:underline flex items-center gap-1 transition-all"
          >
            Limpiar todo <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 1. FILTRO: MARCAS */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex justify-between items-center cursor-pointer group">
          Marca
          <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-[#2c1ff1]" />
        </h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer group/item"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 rounded border-gray-300 text-[#2c1ff1] focus:ring-[#2c1ff1] cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover/item:text-[#2c1ff1] transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. FILTRO: PRECIO */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex justify-between items-center">
          Precio
          <ChevronUp className="w-4 h-4 text-gray-500" />
        </h3>
        <div className="flex gap-2 mt-3 items-center">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">S/</span>
            <input
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onKeyDown={handlePriceKeyDown}
              className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:border-[#2c1ff1] focus:ring-1 focus:ring-[#2c1ff1] outline-none"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">S/</span>
            <input
              type="number"
              placeholder="Máx"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onKeyDown={handlePriceKeyDown}
              className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:border-[#2c1ff1] focus:ring-1 focus:ring-[#2c1ff1] outline-none"
            />
          </div>
          <button
            onClick={applyPriceFilter}
            className="bg-[#2c1ff1] text-white rounded p-1.5 hover:bg-[#1a0fd1] transition-colors flex-shrink-0"
            aria-label="Aplicar filtro de precio"
          >
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      </div>

      {/* 3. FILTRO: CALIFICACIÓN (NUEVO) */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex justify-between items-center">
          Calificación
          <ChevronUp className="w-4 h-4 text-gray-500" />
        </h3>
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => handleRatingChange(stars.toString())}
              className={`flex items-center gap-2 text-sm w-full hover:bg-gray-50 p-1.5 rounded transition-colors ${
                currentRating === stars.toString() ? "bg-blue-50 ring-1 ring-blue-100" : ""
              }`}
            >
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14} // Tamaño controlado
                    className={`${
                      i < stars ? "fill-current" : "text-gray-300 fill-transparent"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs ${currentRating === stars.toString() ? "font-semibold text-[#2c1ff1]" : "text-gray-500"}`}>
                & más
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. FILTRO: ALMACENAMIENTO (NUEVO) */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex justify-between items-center">
          Almacenamiento
          <ChevronUp className="w-4 h-4 text-gray-500" />
        </h3>
        <div className="space-y-2">
          {storageOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedStorage.includes(option)}
                onChange={() => handleStorageChange(option)}
                className="w-4 h-4 rounded border-gray-300 text-[#2c1ff1] focus:ring-[#2c1ff1] cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#2c1ff1] transition-colors">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};