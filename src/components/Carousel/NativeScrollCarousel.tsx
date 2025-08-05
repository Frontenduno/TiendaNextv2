// src/components/Carousel/NativeScrollCarousel.tsx
'use client';

import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import classNames from 'classnames';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/data/products';
import { CarouselItem, DataCarouselProps } from './Carousel';

interface NativeCarouselChildProps<T extends CarouselItem>
  extends Omit<DataCarouselProps<T>, 'showArrows' | 'showDots' | 'autoplay' | 'autoplayInterval' | 'type'> {
  type: 'items';
  showArrows: boolean;
  showDots: boolean;
  autoplay: boolean;
  autoplayInterval: number;
}

export default function NativeScrollCarousel<T extends CarouselItem>(props: NativeCarouselChildProps<T>) {
  const {
    data = [],
    itemWidthReference = 0,
    gapWidth = 0,
    showArrows,
    showDots,
    autoplay,
    autoplayInterval,
    title,
    renderItem,
  } = props;

  const scrollRef = useRef<HTMLDivElement>(null);
  const isJumpingRef = useRef(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const [activeDot, setActiveDot] = useState(0);

  const NUM_CLONES = 4;
  const effectiveWidth = itemWidthReference + gapWidth;

  const displayedData = useMemo(() => {
    if (data.length <= 1 || !effectiveWidth) return data;
    return [...data.slice(-NUM_CLONES), ...data, ...data.slice(0, NUM_CLONES)];
  }, [data, effectiveWidth]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          left: (NUM_CLONES + index) * effectiveWidth,
          behavior: 'smooth',
        });
      }
    },
    [effectiveWidth]
  );

  const initializeScroll = useCallback(() => {
    if (scrollRef.current && data.length > 1) {
      scrollRef.current.scrollLeft = NUM_CLONES * effectiveWidth;
      setActiveDot(0);
    }
  }, [effectiveWidth, data.length]);

  const getDotIndex = useCallback(() => {
    if (!scrollRef.current || data.length <= 1 || !effectiveWidth) return 0;
    const offset = scrollRef.current.scrollLeft - NUM_CLONES * effectiveWidth;
    return ((Math.round(offset / effectiveWidth) % data.length + data.length) % data.length);
  }, [data.length, effectiveWidth]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isJumpingRef.current || data.length <= 1 || !effectiveWidth) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const min = NUM_CLONES * effectiveWidth;
    const max = (NUM_CLONES + data.length) * effectiveWidth;

    if (scrollLeft >= max) {
      isJumpingRef.current = true;
      scrollRef.current.style.scrollBehavior = 'auto';
      scrollRef.current.scrollLeft = min + (scrollLeft - max);
      requestAnimationFrame(() => {
        scrollRef.current!.style.scrollBehavior = 'smooth';
        isJumpingRef.current = false;
      });
    } else if (scrollLeft <= 0) {
      isJumpingRef.current = true;
      scrollRef.current.style.scrollBehavior = 'auto';
      scrollRef.current.scrollLeft = max + scrollLeft;
      requestAnimationFrame(() => {
        scrollRef.current!.style.scrollBehavior = 'smooth';
        isJumpingRef.current = false;
      });
    }

    setActiveDot(getDotIndex());
  }, [data.length, effectiveWidth, getDotIndex]);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (autoplay && data.length > 1 && effectiveWidth) {
      autoplayRef.current = setInterval(() => {
        if (scrollRef.current && !isJumpingRef.current) {
          scrollRef.current.scrollBy({ left: effectiveWidth, behavior: 'smooth' });
        }
      }, autoplayInterval);
    }
  }, [autoplay, autoplayInterval, data.length, effectiveWidth]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    initializeScroll();
    startAutoplay();

    const ref = scrollRef.current;
    const handleInteraction = () => stopAutoplay();

    ref?.addEventListener('scroll', handleScroll);
    ref?.addEventListener('wheel', handleInteraction, { passive: true });
    ref?.addEventListener('mousedown', handleInteraction);
    ref?.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      ref?.removeEventListener('scroll', handleScroll);
      ref?.removeEventListener('wheel', handleInteraction);
      ref?.removeEventListener('mousedown', handleInteraction);
      ref?.removeEventListener('touchstart', handleInteraction);
      stopAutoplay();
    };
  }, [initializeScroll, startAutoplay, handleScroll, stopAutoplay]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current && !isJumpingRef.current && data.length > 1 && effectiveWidth) {
      stopAutoplay();
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -effectiveWidth : effectiveWidth,
        behavior: 'smooth',
      });
    }
  };

  const actualRenderItem = renderItem || ((item: CarouselItem, index: number) => {
    if (typeof item === 'object' && item !== null && 'id' in item && 'name' in item) {
      return <ProductCard key={item.id || `product-${index}`} product={item as Product} />;
    }
    return (
      <div className="w-64 h-80 bg-gray-200 flex items-center justify-center text-gray-500">
        Item inválido
      </div>
    );
  });

  if (!data || data.length === 0) return null;

  const shouldShowControls = data.length > 1;

  return (
    <div className="relative">
      {showArrows && shouldShowControls && (
        <>
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-md border border-gray-300 rounded-full p-3 shadow-lg hover:scale-105 transition-all z-10"
            aria-label={`Desplazar ${title || 'carrusel'} a la izquierda`}
          >
            <FaChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-md border border-gray-300 rounded-full p-3 shadow-lg hover:scale-105 transition-all z-10"
            aria-label={`Desplazar ${title || 'carrusel'} a la derecha`}
          >
            <FaChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className={classNames(
          'flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar',
          `gap-${gapWidth / 4}`
        )}
      >
        {displayedData.map((item, i) => (
          <div
            key={i}
            className="flex-none box-border"
            style={{ width: `${itemWidthReference}px` }}
          >
            {actualRenderItem(item as T, i)}
          </div>
        ))}
      </div>

      {showDots && shouldShowControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 mt-4">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={classNames(
                'w-3 h-3 rounded-full border-2 border-white transition-colors duration-300',
                activeDot === i ? 'bg-blue-600' : 'bg-gray-400 hover:bg-gray-300'
              )}
              aria-label={`Ir a la diapositiva ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
