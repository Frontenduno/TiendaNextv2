// src/components/category/Pagination.tsx
"use client";

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Iconos para Anterior/Siguiente

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = [];
  // Generar un rango de páginas para mostrar, centrado alrededor de la página actual
  const maxPagesToShow = 5; // Por ejemplo, mostrar 5 botones de página
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Ajustar el rango si estamos cerca del final
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center items-center space-x-2 my-6">
      {/* Botón de página anterior con icono de flecha */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
        aria-label="Página anterior"
      >
        <FaChevronLeft className="w-3 h-3" />
      </button>

      {/* Mostrar el número de la primera página si no está en el rango visible */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
          >
            1
          </button>
          {/* Mostrar puntos suspensivos si hay páginas intermedias ocultas */}
          {startPage > 2 && <span className="text-gray-500">...</span>}
        </>
      )}

      {/* Números de página */}
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 shadow-sm ${
            currentPage === number
              ? 'bg-gray-700 text-white border border-gray-700' // Activo: fondo gris oscuro, texto blanco, borde gris oscuro
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100' // Inactivo: fondo blanco, texto gris, borde gris claro
          }`}
        >
          {number}
        </button>
      ))}

      {/* Mostrar el número de la última página si no está en el rango visible */}
      {endPage < totalPages && (
        <>
          {/* Mostrar puntos suspensivos si hay páginas intermedias ocultas */}
          {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Botón de página siguiente con icono de flecha */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
        aria-label="Página siguiente"
      >
        <FaChevronRight className="w-3 h-3" />
      </button>
    </nav>
  );
}
