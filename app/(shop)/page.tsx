// app/(public)/page.tsx
import React from 'react';
import { ProductCarousel } from '@/feature/carousel-product/ProductCarousel';
import { BannerCarousel } from '@/components/banner/BannerCarousel';
import bannersData from '@/data/banners.json';
import { BannersData } from '@/interfaces/banners';

export default function HomePage() {
  const data = bannersData as BannersData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Hero Principal - Diseño 1 */}
      <BannerCarousel 
        banners={data.banners}
        design={1}
        autoPlayInterval={5000}
        showArrows={true}
        showIndicators={true}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Sección de Productos Destacados */}
        <div className="space-y-12">
          
          {/* Productos Destacados */}
          <section>
            <ProductCarousel 
              titulo="Productos Destacados del Mes"
              filtro="mas-vendidos"
              cardSize="xl"
              imageAspect="tall"
              addToCartBehavior="always"
              maxTags={2}
            />
          </section>

          {/* Ofertas Especiales */}
          <section>
            <ProductCarousel 
              titulo="Ofertas Especiales"
              filtro="descuentos"
              cardSize="lg"
              imageAspect="portrait"
              addToCartBehavior="always"
            />
          </section>

          {/* Novedades */}
          <section>
            <ProductCarousel 
              titulo="Novedades"
              filtro="nuevos"
              cardSize="md"
              imageAspect="square"
              addToCartBehavior="hover"
              maxTags={3}
            />
          </section>
        </div>
      </div>

      {/* Banner Intermedio - Diseño 2 Personalizado */}
      <section className="my-12">
        <div className="container mx-auto px-4">
          <BannerCarousel 
            banners={data.banners.slice(0, 3)}
            design={2}
            autoPlayInterval={6000}
            showArrows={true}
            showIndicators={true}
            height="h-[300px] md:h-[400px] lg:h-[450px]"
            borderRadius="rounded-xl"
            padding="p-0"
          />
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="space-y-12">
          {/* Más Vendidos */}
          <section>
            <ProductCarousel 
              titulo="Más Vendidos"
              filtro="mas-vendidos"
              cardSize="md"
              imageAspect="portrait"
              addToCartBehavior="hover"
            />
          </section>

          {/* Compra Rápida - Layout Horizontal */}
          <section>
            <ProductCarousel 
              titulo="Compra Rápida"
              filtro="todos"
              layout="horizontal"
              cardSize="sm"
              showColors={false}
              addToCartBehavior="always"
            />
          </section>

          {/* Categorías Destacadas - Grid de Banners */}
          <section className="my-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Categorías Destacadas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BannerCarousel 
                banners={data.banners.slice(0, 2)}
                design={2}
                autoPlayInterval={7000}
                showArrows={true}
                showIndicators={false}
                height="h-[250px] md:h-[300px]"
                borderRadius="rounded-lg"
              />
              <BannerCarousel 
                banners={data.banners.slice(2, 4)}
                design={2}
                autoPlayInterval={8000}
                showArrows={true}
                showIndicators={false}
                height="h-[250px] md:h-[300px]"
                borderRadius="rounded-lg"
              />
            </div>
          </section>

          {/* También te puede gustar */}
          <section>
            <ProductCarousel 
              titulo="También te puede gustar"
              filtro="todos"
              cardSize="sm"
              imageAspect="square"
              showAddToCart={true}
              addToCartBehavior="hover"
              maxTags={1}
            />
          </section>
        </div>
      </div>

      {/* Banner Final - Diseño 2 */}
      <section className="mt-16 mb-8">
        <div className="container mx-auto px-4">
          <BannerCarousel 
            banners={data.banners.slice(4, 6)}
            design={2}
            autoPlayInterval={5000}
            showArrows={true}
            showIndicators={true}
            height="h-[280px] md:h-[350px] lg:h-[400px]"
            borderRadius="rounded-2xl"
            padding="p-0"
          />
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        {/* Últimas Oportunidades */}
        <section>
          <ProductCarousel 
            titulo="Últimas Oportunidades"
            filtro="descuentos"
            cardSize="lg"
            imageAspect="portrait"
            addToCartBehavior="always"
          />
        </section>
      </div>
    </div>
  );
}