// src/components/common/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaShoppingCart } from 'react-icons/fa';
// La función createProductSlug se importará desde '@/data/products'
import { Product, createProductSlug } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const { addItem } = useCart();

    const handleAddToCart = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        addItem(product.id, 1, undefined, undefined);
        console.log(`¡"${product.name}" añadido al carrito!`);
    };

    const toggleFavorite = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setIsFavorite(prev => !prev);
    };

    const currentPriceValue = product.price;
    const oldPriceValue = product.oldPrice ?? null;
    const hasDiscount = oldPriceValue !== null && oldPriceValue > currentPriceValue;

    // Se genera el slug para la URL de manera amigable para SEO
    const productSlug = createProductSlug(product.name, product.id);

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md relative group flex flex-col w-full min-h-[500px] border border-gray-200 hover:border-gray-300 transition-colors duration-200">
            {/* Se corrige el enlace para usar el slug en lugar de solo el ID */}
            <Link href={`/page/products/${productSlug}`} passHref className="relative w-full h-64 flex-shrink-0 flex items-center justify-center bg-green-50 overflow-hidden cursor-pointer">
                {product.tag && (
                    <span className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold z-10
                        ${product.tag === 'Nuevo' ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
                        {product.tag}
                    </span>
                )}
                <button
                    onClick={toggleFavorite}
                    className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm text-gray-600 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-200 z-10 cursor-pointer"
                    aria-label="Añadir a favoritos"
                >
                    {isFavorite ? (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                            2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 
                            3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 
                            3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 
                            0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 
                            7.78l1.06 1.06L12 21.23l7.78-7.78 
                            1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                    )}
                </button>
                <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="transition-transform duration-300 group-hover:scale-105"
                />
            </Link>
            <div className="p-4 flex flex-col flex-grow overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-800 leading-tight mb-1 line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-sm text-gray-600 mb-auto line-clamp-1">{product.model}</p>
                <div className="flex items-baseline mt-4">
                    <span className="text-xl font-bold text-gray-900 mr-2">
                        S/ {currentPriceValue.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                            S/ {oldPriceValue?.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
            <div className="px-4 pb-4">
                <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center bg-black text-white py-3 px-4 rounded-md shadow-sm transition duration-200 text-sm font-medium opacity-100 translate-y-0 md:opacity-0 md:group-hover:opacity-100 md:translate-y-full md:group-hover:translate-y-0 md:hover:bg-gray-800 cursor-pointer flex items-center justify-center"
                >
                    <FaShoppingCart className="mr-2" /> Agregar al Carro
                </button>
            </div>
        </div>
    );
}