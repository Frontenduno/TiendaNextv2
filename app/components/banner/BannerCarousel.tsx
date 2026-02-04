// components/banner/BannerCarousel.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerCarouselProps } from '@/interfaces/banners';

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  design = 1,
  autoPlayInterval = 5000,
  showArrows = true,
  showIndicators = true,
  // Props para design 2
  height,
  aspectRatio,
  borderRadius,
  padding,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeBanners = banners.filter(banner => banner.activo);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
    );
  }, [activeBanners.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? activeBanners.length - 1 : prevIndex - 1
    );
  }, [activeBanners.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!isHovered && autoPlayInterval > 0) {
      const interval = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isHovered, autoPlayInterval, goToNext]);

  if (activeBanners.length === 0) {
    return null;
  }

  if (design === 1) {
    return <Design1Carousel 
      banners={activeBanners}
      currentIndex={currentIndex}
      showArrows={showArrows}
      showIndicators={showIndicators}
      goToNext={goToNext}
      goToPrevious={goToPrevious}
      goToSlide={goToSlide}
      setIsHovered={setIsHovered}
    />;
  }

  return <Design2Carousel 
    banners={activeBanners}
    currentIndex={currentIndex}
    showArrows={showArrows}
    showIndicators={showIndicators}
    goToNext={goToNext}
    goToPrevious={goToPrevious}
    goToSlide={goToSlide}
    setIsHovered={setIsHovered}
    height={height}
    aspectRatio={aspectRatio}
    borderRadius={borderRadius}
    padding={padding}
  />;
};

interface CarouselLayoutProps {
  banners: Array<{
    idBanner: number;
    titulo: string;
    subtitulo?: string;
    descripcion?: string;
    imagen: {
      url: string;
      alt: string;
    };
    idCategoria: number;
  }>;
  currentIndex: number;
  showArrows: boolean;
  showIndicators: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  goToSlide: (index: number) => void;
  setIsHovered: (value: boolean) => void;
  height?: string;
  aspectRatio?: string;
  borderRadius?: string;
  padding?: string;
}

const Design1Carousel: React.FC<CarouselLayoutProps> = ({
  banners,
  currentIndex,
  showArrows,
  showIndicators,
  goToNext,
  goToPrevious,
  goToSlide,
  setIsHovered,
}) => {
  const currentBanner = banners[currentIndex];

  return (
    <div 
      className="relative w-full overflow-hidden bg-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Container */}
      <div className="relative w-full">
        {/* Aspect Ratio Container - Responsive */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <Link 
            href={`/categoria/${currentBanner.idCategoria}`}
            className="block w-full h-full"
          >
            <Image
              src={currentBanner.imagen.url}
              alt={currentBanner.imagen.alt}
              fill
              priority={currentIndex === 0}
              className="object-cover"
              sizes="100vw"
            />
            
            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            
            {/* Contenido del banner */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl lg:max-w-2xl">
                  {currentBanner.subtitulo && (
                    <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 mb-2 md:mb-3 uppercase tracking-wide">
                      {currentBanner.subtitulo}
                    </p>
                  )}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-4 lg:mb-6 leading-tight">
                    {currentBanner.titulo}
                  </h2>
                  {currentBanner.descripcion && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 md:mb-6 lg:mb-8">
                      {currentBanner.descripcion}
                    </p>
                  )}
                  <button className="bg-white text-gray-900 px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-3.5 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform">
                    Ver Ofertas
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Flechas de navegación */}
        {showArrows && banners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToPrevious();
              }}
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-10 group"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-10 group"
              aria-label="Siguiente banner"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Indicadores */}
        {showIndicators && banners.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
            {banners.map((banner, index) => (
              <button
                key={banner.idBanner}
                onClick={(e) => {
                  e.preventDefault();
                  goToSlide(index);
                }}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-8 sm:w-10 md:w-12 bg-white' 
                    : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir al banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Design2Carousel: React.FC<CarouselLayoutProps> = ({
  banners,
  currentIndex,
  showArrows,
  showIndicators,
  goToNext,
  goToPrevious,
  goToSlide,
  setIsHovered,
  height = 'h-[400px]',
  aspectRatio,
  borderRadius = 'rounded-lg',
  padding = 'p-0',
}) => {
  const currentBanner = banners[currentIndex];

  return (
    <div 
      className={`relative w-full ${padding}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative w-full overflow-hidden ${borderRadius} shadow-xl`}>
        {/* Container con altura personalizable */}
        <div className={`relative w-full ${aspectRatio || height}`}>
          <Link 
            href={`/categoria/${currentBanner.idCategoria}`}
            className="block w-full h-full"
          >
            <Image
              src={currentBanner.imagen.url}
              alt={currentBanner.imagen.alt}
              fill
              priority={currentIndex === 0}
              className="object-cover"
              sizes="100vw"
            />
            
            {/* Overlay minimalista */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            
            {/* Contenido minimalista en la parte inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="max-w-2xl">
                {currentBanner.subtitulo && (
                  <p className="text-xs sm:text-sm md:text-base font-medium text-white/90 mb-1 sm:mb-2 uppercase tracking-wider">
                    {currentBanner.subtitulo}
                  </p>
                )}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
                  {currentBanner.titulo}
                </h2>
                {currentBanner.descripcion && (
                  <p className="text-sm sm:text-base md:text-lg text-white/90 mb-3 sm:mb-4 md:mb-5">
                    {currentBanner.descripcion}
                  </p>
                )}
                <button className="bg-white text-gray-900 px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-md font-semibold text-xs sm:text-sm md:text-base hover:bg-gray-100 transition-all shadow-md hover:shadow-lg">
                  Explorar
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Flechas de navegación - Diseño 2 */}
        {showArrows && banners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToPrevious();
              }}
              className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 md:p-3 rounded-md transition-all z-10 backdrop-blur-sm"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
              className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 md:p-3 rounded-md transition-all z-10 backdrop-blur-sm"
              aria-label="Siguiente banner"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Indicadores - Diseño 2 */}
        {showIndicators && banners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-4 sm:right-6 md:right-8 flex gap-1.5 sm:gap-2 z-10">
            {banners.map((banner, index) => (
              <button
                key={banner.idBanner}
                onClick={(e) => {
                  e.preventDefault();
                  goToSlide(index);
                }}
                className={`h-1 sm:h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-6 sm:w-8 md:w-10 bg-white' 
                    : 'w-1 sm:w-1.5 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir al banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};