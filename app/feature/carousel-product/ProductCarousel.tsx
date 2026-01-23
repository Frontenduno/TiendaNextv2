'use client';

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Producto, ProductosDataJson } from '@/interfaces/products';
import { ProductCard } from '../../components/product/ProductCard';
import productosData from '@/data/products.json';

const PAGE_SIZE = 6;

interface ProductCarouselProps {
  titulo: string;
  filtro?: 'mas-vendidos' | 'nuevos' | 'descuentos' | 'todos';  
  productoActualId?: number;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  titulo,
  filtro = 'todos',
  productoActualId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [page] = useState(1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const data = productosData as ProductosDataJson;

  const productosFiltrados: Producto[] = useMemo(() => {
    let productos = data.productos;

    if (productoActualId) {
      productos = productos.filter(
        p => p.idProducto !== productoActualId
      );
    }

    switch (filtro) {
      case 'mas-vendidos':
        return productos.filter(p =>
          p.etiquetas.some(e => e.descripcion === 'Más vendido')
        );

      case 'nuevos':
        return productos.filter(p =>
          p.etiquetas.some(e => e.descripcion === 'Nuevo')
        );

      case 'descuentos':
        return productos.filter(p =>
          p.etiquetas.some(e => e.descripcion === 'Oferta')
        );

      default:
        return productos;
    }
  }, [data.productos, filtro, productoActualId]);

  const items: Producto[] = useMemo(() => {
    return productosFiltrados.slice(0, page * PAGE_SIZE);
  }, [productosFiltrados, page]);

  const updateScrollButtons = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (
      (direction === 'left' && !canScrollLeft) ||
      (direction === 'right' && !canScrollRight)
    ) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const amount = container.offsetWidth * 0.8;

    container.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (!items.length) return null;

  return (
    <div className="py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {titulo}
        </h2>

        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full transition
              ${canScrollLeft
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full transition
              ${canScrollRight
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CARRUSEL */}
      <div className="relative -mx-4 px-4">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide select-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {items.map(producto => (
            <div
              key={producto.idProducto}
              className="flex-none w-[260px] sm:w-[280px] md:w-[300px]"
            >
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      </div>

      {/* OCULTAR SCROLLBAR */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
