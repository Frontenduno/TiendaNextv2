// src/components/category/FilterMenu.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Iconos para desplegar/colapsar

// Definición de tipos para los filtros
interface Filters {
  priceRange?: { min: number; max: number | null };
  brand?: string[];
  color?: string[];
  sortBy?: string; // Nuevo filtro para el ordenamiento
}

interface FilterMenuProps {
  onApplyFilters: (filters: Filters) => void;
  currentFilters: Filters;
}

export default function FilterMenu({ onApplyFilters, currentFilters }: FilterMenuProps) {
  const [minPrice, setMinPrice] = useState<string>(currentFilters.priceRange?.min?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(currentFilters.priceRange?.max?.toString() || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentFilters.brand || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(currentFilters.color || []);
  const [selectedSortBy, setSelectedSortBy] = useState<string>(currentFilters.sortBy || 'relevance');

  // Estados para controlar la visibilidad de los dropdowns, CERRADOS AL INICIO
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);


  // Sincronizar los estados internos con las props externas (si la URL cambia)
  // Este useEffect es importante para que los filtros en el menú se actualicen
  // cuando la URL cambia (por ejemplo, si el usuario navega con el botón de atrás/adelante del navegador)
  useEffect(() => {
    setMinPrice(currentFilters.priceRange?.min?.toString() || '');
    setMaxPrice(currentFilters.priceRange?.max?.toString() || '');
    setSelectedBrands(currentFilters.brand || []);
    setSelectedColors(currentFilters.color || []);
    setSelectedSortBy(currentFilters.sortBy || 'relevance');
  }, [currentFilters]);

  const brands = ['Nike', 'Adidas', 'Puma', 'Jordan', 'Skechers', 'Under Armour'];
  const colors = ['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Gris', 'Rosa'];

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleApplyClick = () => {
    const filtersToApply: Filters = {};

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min) || !isNaN(max)) {
      filtersToApply.priceRange = {
        min: isNaN(min) ? 0 : min,
        max: isNaN(max) ? null : max,
      };
    }

    if (selectedBrands.length > 0) {
      filtersToApply.brand = selectedBrands;
    }

    if (selectedColors.length > 0) {
      filtersToApply.color = selectedColors;
    }

    if (selectedSortBy !== 'relevance') {
      filtersToApply.sortBy = selectedSortBy;
    }

    onApplyFilters(filtersToApply);
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSortBy('relevance');
    onApplyFilters({});
  };

  // Componente reutilizable para cada sección de filtro
  const FilterSection: React.FC<{
    title: string;
    isOpen: boolean;
    toggleOpen: () => void;
    children: React.ReactNode;
  }> = ({ title, isOpen, toggleOpen, children }) => (
    <div className="mb-2 border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-base font-medium text-gray-700 focus:outline-none transition-colors duration-200"
        onClick={toggleOpen}
      >
        {title}
        {isOpen ? <FaChevronUp className="w-3 h-3 text-gray-500" /> : <FaChevronDown className="w-3 h-3 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );


  return (
    // Eliminado md:sticky y md:top-24 para que el menú de filtros se desplace con la página
    <div className="w-full p-4 bg-white rounded-lg shadow-md md:h-fit">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Filtros</h2>

      {/* Ordenar por (ahora primero, como en la imagen) */}
      <FilterSection title="Ordenar por" isOpen={isSortByOpen} toggleOpen={() => setIsSortByOpen(!isSortByOpen)}>
        <div className="space-y-2">
          <label className="flex items-center text-gray-600 text-sm cursor-pointer">
            <input
              type="radio"
              name="sortBy"
              value="relevance"
              checked={selectedSortBy === 'relevance'}
              onChange={(e) => setSelectedSortBy(e.target.value)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Más Relevante</span>
          </label>
          <label className="flex items-center text-gray-600 text-sm cursor-pointer">
            <input
              type="radio"
              name="sortBy"
              value="price-asc"
              checked={selectedSortBy === 'price-asc'}
              onChange={(e) => setSelectedSortBy(e.target.value)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Precio: Bajo a Alto</span>
          </label>
          <label className="flex items-center text-gray-600 text-sm cursor-pointer">
            <input
              type="radio"
              name="sortBy"
              value="price-desc"
              checked={selectedSortBy === 'price-desc'}
              onChange={(e) => setSelectedSortBy(e.target.value)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Precio: Alto a Bajo</span>
          </label>
        </div>
      </FilterSection>

      {/* Marcas */}
      <FilterSection title="Marca" isOpen={isBrandOpen} toggleOpen={() => setIsBrandOpen(!isBrandOpen)}>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center text-gray-600 text-sm cursor-pointer">
              <input
                type="checkbox"
                value={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rango de Precios */}
      <FilterSection title="Precio" isOpen={isPriceOpen} toggleOpen={() => setIsPriceOpen(!isPriceOpen)}>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </FilterSection>

      {/* Colores */}
      <FilterSection title="Color" isOpen={isColorOpen} toggleOpen={() => setIsColorOpen(!isColorOpen)}>
        <div className="space-y-2">
          {colors.map(color => (
            <label key={color} className="flex items-center text-gray-600 text-sm cursor-pointer">
              <input
                type="checkbox"
                value={color}
                checked={selectedColors.includes(color)}
                onChange={() => handleColorChange(color)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2">{color}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Botones de acción */}
      <div className="flex flex-col space-y-3 mt-6">
        <button
          onClick={handleApplyClick}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 text-base font-medium"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={handleClearFilters}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200 text-base font-medium"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}
