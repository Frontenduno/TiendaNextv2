// app/(public)/page.tsx
import React from 'react';
import { ProductCarousel } from '@/feature/carousel-product/ProductCarousel';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 sm:p-12 mb-8 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Bienvenido a Nuestra Tienda
          </h1>
          <p className="text-lg sm:text-xl mb-6 text-white">
            Descubre las mejores ofertas y productos
          </p>
        </div>

        {/* Carruseles de productos con diferentes tamaños */}
        <div className="space-y-12">

          {/* 1. DESTACADOS - Tarjetas Extra Grandes (XL) */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas XL • Aspecto Tall • Botón siempre visible</p>
            <ProductCarousel 
              titulo="Productos Destacados del Mes"
              filtro="mas-vendidos"
              cardSize="xl"
              imageAspect="tall"
              addToCartBehavior="always"
              maxTags={2}
            />
          </section>

          {/* 2. OFERTAS - Tarjetas Grandes (LG) */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas LG • Aspecto Portrait • Botón siempre visible</p>
            <ProductCarousel 
              titulo="Ofertas Especiales"
              filtro="descuentos"
              cardSize="lg"
              imageAspect="portrait"
              addToCartBehavior="always"
            />
          </section>

          {/* 3. NUEVOS - Tarjetas Medianas (MD) */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas MD • Aspecto Square • Botón en hover</p>
            <ProductCarousel 
              titulo="Novedades"
              filtro="nuevos"
              cardSize="md"
              imageAspect="square"
              addToCartBehavior="hover"
              maxTags={3}
            />
          </section>

          {/* 4. COMPRA RÁPIDA */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas SM • Layout Horizontal • Sin colores</p>
            <ProductCarousel 
              titulo="Compra Rápida"
              filtro="todos"
              layout="horizontal"
              cardSize="sm"
              showColors={false}
              addToCartBehavior="always"
            />
          </section>

          {/* 5. MÁS VENDIDOS */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas SM • Aspecto Portrait • Botón en hover</p>
            <ProductCarousel 
              titulo="Más Vendidos"
              filtro="mas-vendidos"
              cardSize="sm"
              imageAspect="portrait"
              addToCartBehavior="hover"
            />
          </section>

          {/* 6. PANORÁMICA */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas MD • Aspecto Wide (16:9) • Con colores</p>
            <ProductCarousel 
              titulo="Vista Panorámica"
              filtro="todos"
              cardSize="md"
              imageAspect="wide"
              showColors={true}
              maxTags={1}
            />
          </section>

          {/* 7. MINI CARRUSEL */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas XS • Aspecto Square • Sin botón de carrito</p>
            <ProductCarousel 
              titulo="También te puede gustar"
              filtro="todos"
              cardSize="xs"
              imageAspect="square"
              showAddToCart={false}
              maxTags={1}
            />
          </section>

          {/* 8. LANDSCAPE */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas LG • Aspecto Landscape (4:3) • Botón siempre visible</p>
            <ProductCarousel 
              titulo="Productos en Landscape"
              filtro="nuevos"
              cardSize="lg"
              imageAspect="landscape"
              addToCartBehavior="always"
              showColors={true}
            />
          </section>

          {/* 9. DEFAULT */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas MD (default) • Aspecto Portrait (default) • Configuración estándar</p>
            <ProductCarousel 
              titulo="Todos los Productos"
              filtro="todos"
            />
          </section>

          {/* 10. ANCHO PERSONALIZADO */}
          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tarjetas MD • Ancho personalizado 350px • Aspecto Tall</p>
            <ProductCarousel 
              titulo="Ancho Personalizado"
              filtro="mas-vendidos"
              cardSize="md"
              itemWidth="350px"
              imageAspect="tall"
            />
          </section>

        </div>

        {/* Sección informativa */}
        <div className="mt-16 bg-white rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuraciones Disponibles</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Tamaños de Tarjeta</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><code className="bg-gray-100 px-2 py-1 rounded">xs</code> - Mini (180-200px)</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">sm</code> - Pequeña (220-240px)</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">md</code> - Mediana (260-300px) <span className="text-blue-600">Default</span></li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">lg</code> - Grande (300-340px)</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">xl</code> - Extra Grande (340-380px)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Proporciones de Imagen</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><code className="bg-gray-100 px-2 py-1 rounded">square</code> - Cuadrado (1:1)</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">portrait</code> - Vertical (3:4) <span className="text-blue-600">Default</span></li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">landscape</code> - Horizontal (4:3)</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">tall</code> - Muy vertical (2:3)</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">wide</code> - Panorámico (16:9)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Layouts</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><code className="bg-gray-100 px-2 py-1 rounded">vertical</code> - Diseño normal <span className="text-blue-600">Default</span></li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">horizontal</code> - Diseño compacto lado a lado</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Comportamiento del Botón</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><code className="bg-gray-100 px-2 py-1 rounded">hover</code> - Solo visible en hover <span className="text-blue-600">Default</span></li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">always</code> - Siempre visible</li>
              </ul>
            </div>

          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              Combina diferentes configuraciones para crear una experiencia de usuario única.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
