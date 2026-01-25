// app/profile/pages/FavoritesPage.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFavoritesStore } from '@/store/favoriteProduc/favoritesStore';
import { ProductCard } from '@/components/product/ProductCard';
import EmptyState from '../components/EmptyState';
import productosData from '@/data/products.json';
import { ProductosDataJson, Producto } from '@/interfaces/products';

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Paginación: 2 columnas x 4 filas = 8 productos por página
  const ITEMS_PER_PAGE = 8;
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const loadFavorites = () => {
      const state = useFavoritesStore.getState();
      
      if (!state._hasHydrated) {
        setTimeout(loadFavorites, 50);
        return;
      }

      const data = productosData as ProductosDataJson;
      const products = data.productos.filter(p => 
        state.favorites.has(p.idProducto)
      );
      
      setFavoriteProducts(products);
      setIsLoading(false);
    };

    loadFavorites();

    const unsubscribe = useFavoritesStore.subscribe((state) => {
      if (state._hasHydrated) {
        const data = productosData as ProductosDataJson;
        const products = data.productos.filter(p => 
          state.favorites.has(p.idProducto)
        );
        setFavoriteProducts(products);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <EmptyState
        title="Sin favoritos"
        message="Guarda lo que más te guste."
        Icon={Heart}
        showButton={true}
      />
    );
  }

  // Calcular paginación
  const totalProducts = favoriteProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = favoriteProducts.slice(startIndex, endIndex);

  const handlePageChange = (pageNum: number) => {
    if (pageNum === 1) {
      router.push('/profile/favoritos');
    } else {
      router.push(`/profile/favoritos?page=${pageNum}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mis Favoritos</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>

      {/* Grid de productos - 2 columnas mobile y desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {paginatedProducts.map((producto) => (
          <ProductCard
            key={producto.idProducto}
            producto={producto}
            imageAspect="portrait"
            size="sm"
            showColors={false}
            showAddToCart={true}
            addToCartBehavior="always"
            maxTags={1}
            layout="vertical"
            showRating={true}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
          {/* Info de página */}
          <p className="text-xs sm:text-sm text-gray-600">
            Página {currentPage} de {totalPages} ({startIndex + 1}-{Math.min(endIndex, totalProducts)} de {totalProducts})
          </p>

          {/* Botones de navegación */}
          <div className="flex items-center gap-2">
            {/* Anterior */}
            {currentPage > 1 ? (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-semibold text-gray-400 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </div>
            )}

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Mostrar solo algunas páginas
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-colors
                        ${pageNum === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="text-gray-400 text-xs sm:text-sm">...</span>;
                }
                return null;
              })}
            </div>

            {/* Siguiente */}
            {currentPage < totalPages ? (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-semibold text-gray-400 cursor-not-allowed">
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}