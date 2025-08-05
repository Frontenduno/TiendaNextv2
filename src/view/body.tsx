// src/view/body.tsx
"use client";

import React from 'react';
import Carousel from '@/components/Carousel/Carousel';
import ProductCard from '@/components/common/ProductCard';
import Adds from '@/components/Adds/adds';

// Importa los tipos y datos de tus archivos de datos
import {
    Product,
    mainCarouselImages,
    finalCarouselImages,
    AdItem,
    adItems,
    BrandLogoItem,
    brandLogoItems,
} from '@/data/products';

interface BodyProps {
    newProducts: Product[];
    discountedProducts: Product[];
}

export default function Body({ newProducts, discountedProducts }: BodyProps) {

    // Función para renderizar ProductCard para carruseles de productos
    const renderProductItem = (product: Product, index: number) => {
        return <ProductCard key={product.id || `prod-${index}`} product={product} />;
    };

    // Función para renderizar AdItem para carrusel de anuncios
    const renderAdItem = (ad: AdItem, index: number) => (
        <div
            key={ad.src || `ad-${index}`}
            // MODIFICACIÓN CRUCIAL AQUÍ: Añadida una altura fija (h-48) y simplificadas las clases de ancho.
            // Esto asegura que el contenedor del anuncio tenga una altura para que la imagen h-full se muestre.
            className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 /* Añade una altura responsiva */
                       overflow-hidden /* Esto es importante para que la imagen no se desborde */
                       group
                       mx-auto /* Centra la tarjeta si el espacio es mayor que max-w- */
                       "
        >
            <img
                src={ad.src}
                alt={ad.alt}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/300x300/cccccc/333333?text=Anuncio+No+Disponible';
                    e.currentTarget.alt = 'Imagen no disponible';
                }}
            />
            <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                {ad.buttonText || "Comprar aquí"}
            </button>
        </div>
    );

    return (
        <div className="font-inter">

            {/* Sección del Carrusel Principal (full-width banner con FADE) */}
            <div className="w-full mt-0">
                <Carousel
                    type="banner"
                    images={mainCarouselImages}
                    title=""
                    heightClass="h-auto aspect-[16/9] md:h-[30rem]"
                    showButton={true}
                    buttonText="COMPRAR"
                    buttonBgColor="bg-black"
                    showDots={true}
                    showArrows={true}
                    clickToNavigateImage={true}
                    autoplay={true}
                    autoplayInterval={3000}
                />
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8 bg-white shadow-sm">

                {/* Sección de Nuevos Productos (carrusel de productos con scroll nativo) */}
                <Carousel<Product>
                    type="items"
                    title="Nuevos productos"
                    data={newProducts}
                    renderItem={renderProductItem}
                    itemWidthReference={256}
                    gapWidth={24}
                    showArrows={true}
                    autoplay={false}
                    autoplayInterval={3000}
                    showDots={false}
                />

                {/* Si usas Adds, asegúrate de que esté correctamente definido */}
                <Adds />

                {/* Sección de Anuncios Destacados (carrusel de anuncios pequeños con scroll nativo) */}
                <Carousel<AdItem>
                    type="items"
                    title=""
                    data={adItems}
                    renderItem={renderAdItem}
                    itemWidthReference={288}
                    gapWidth={24}
                    showArrows={true}
                    autoplay={true}
                    autoplayInterval={3000}
                    showDots={false}
                />

                {/* Sección de Productos "Precios rebajados" (carrusel de productos con scroll nativo) */}
                <Carousel<Product>
                    type="items"
                    title="Precios rebajados"
                    data={discountedProducts}
                    renderItem={renderProductItem}
                    itemWidthReference={256}
                    gapWidth={24}
                    showArrows={true}
                    autoplay={true}
                    autoplayInterval={3000}
                    showDots={false}
                />
                

                {/* Carrusel de Marcas usando el tipo 'brands' (con react-slick) */}
                <Carousel
                    type="brands"
                    title="Nuestras Marcas"
                    images={brandLogoItems}
                    autoplay={true}
                    speed={5000}
                    slidesToShow={5}
                    heightClass="h-[120px]"
                    showArrows={false}
                    showDots={false}
                />

            </div> {/* Fin de max-w-7xl mx-auto */}

            {/* Sección: Carrusel Final de Total Sport (full-width banner con FADE) */}
                <Carousel
                    type="banner"
                    images={finalCarouselImages}
                    title=""
                    heightClass="aspect-[16/9] sm:h-[300px] md:h-[400px] lg:h-[480px]"
                    showButton={false}
                    showDots={false}
                    showArrows={false}
                    autoplay={true}
                    autoplayInterval={3000}
                />

        </div>
    );
}