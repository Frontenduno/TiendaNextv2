// src/app/components/Header/Header.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    FaSearch,
    FaTruck,
    FaUndo,
    FaTag,
    FaUserCircle,
    FaUserPlus
} from "react-icons/fa";
import Categoria from "@/components/Category/categorias";
import { AnimatePresence, motion } from "framer-motion";
import CartIcon from "@/components/common/CartIcon";
import { getFilteredProducts, Product } from '@/data/products';
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
    const [index, setIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const anuncios = [
        { icon: <FaTruck />, texto: 'Realizamos envíos a todo el Perú' },
        { icon: <FaUndo />, texto: 'Cambios y devoluciones' },
        { icon: <FaTag />, texto: 'Descuentos especiales por campaña' },
        { icon: <FaTag />, texto: 'Diversidad en marcas y productos' }
    ];

    const usuarioLogeado = true;

    useEffect(() => {
        const intervalo = setInterval(() => {
            setIndex((prev) => (prev + 1) % anuncios.length);
        }, 4000);
        return () => clearInterval(intervalo);
    }, []);

    const fetchSearchResults = useCallback(async (query: string) => {
        if (query.length > 0) {
            setIsLoading(true);
            try {
                const { products: fetchedProducts } = await getFilteredProducts(
                    'busqueda',
                    query,
                    1,
                    {},
                    5
                );
                setSearchResults(fetchedProducts);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            fetchSearchResults(value);
        }, 300);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim().length > 0) {
            router.push(`/page/search?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
            setSearchResults([]);
            if (searchInputRef.current) {
                searchInputRef.current.blur();
            }
        }
    };

    const handleSuggestionClick = (productId: number) => {
        router.push(`/page/products/${productId}`);
        setSearchTerm('');
        setSearchResults([]);
        setIsSearchFocused(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node) &&
                searchResultsRef.current &&
                !searchResultsRef.current.contains(event.target as Node)
            ) {
                setIsSearchFocused(false);
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header>
            <div className="bg-black text-white text-sm py-3 px-4 flex items-center justify-center gap-4 h-12 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 30, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute flex items-center gap-3"
                    >
                        <span className="text-white text-lg">{anuncios[index].icon}</span>
                        <span className="text-center">{anuncios[index].texto}</span>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="bg-[#005B94] text-white py-0">
                <div className="max-w-screen-xl mx-auto px-2 flex flex-wrap items-center justify-between gap-2 md:gap-x-4 h-[70px]">
                    <div className="flex items-center gap-2 md:gap-x-4 flex-grow-0 h-full">
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="/trainer.png"
                                alt="Trainer Sport Logo"
                                width={110}
                                height={40}
                                className="cursor-pointer"
                            />
                        </Link>
                        <div className="relative flex-grow w-full max-w-2xl order-3 md:order-none">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar en Trainer Sport"
                                className="pl-4 pr-70 py-3 rounded-full text-gray-700 w-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchSubmit}
                                onFocus={() => setIsSearchFocused(true)}
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer" />

                            {isSearchFocused && searchTerm.length > 0 && (
                                <div ref={searchResultsRef} className="absolute z-30 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-3 text-center text-gray-500">Cargando...</div>
                                    ) : searchResults.length > 0 ? (
                                        searchResults.map(product => (
                                            <div
                                                key={product.id}
                                                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                                                onClick={() => handleSuggestionClick(product.id)}
                                            >
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-md object-cover"
                                                />
                                                <span className="text-gray-800 text-sm truncate">{product.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-gray-500 text-sm">
                                            No se encontraron productos.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="hidden lg:flex items-center gap-2">
                            <span className="text-white text-sm font-bold">Visita también:</span>
                            <Link href="https://totalsport.pe/" target="_blank" rel="noopener noreferrer">
                                <div className="leading-none font-extrabold cursor-pointer">
                                    <h1 className="text-[20px] tracking-tight font-[system-ui]">
                                        <span
                                            className="text-gray-300 drop-shadow-[2px_2px_1px_rgba(0,0,0,0.4)]"
                                            style={{
                                                fontFamily: '"Segoe UI", "Roboto", sans-serif',
                                                borderRadius: "6px",
                                                transform: "skewX(-10deg)",
                                                display: "inline-block"
                                            }}
                                        >
                                            TOTAL
                                        </span><br />
                                        <span
                                            className="text-orange-500 drop-shadow-[2px_2px_1px_rgba(0,0,0,0.4)]"
                                            style={{
                                                fontFamily: '"Segoe UI", "Roboto", sans-serif',
                                                borderRadius: "6px",
                                                transform: "skewX(-10deg)",
                                                display: "inline-block"
                                            }}
                                        >
                                            SPORT
                                        </span>
                                    </h1>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-lg">
                        {!usuarioLogeado ? (
                            <Link
                                href="/page/user/login"
                                className="flex items-center gap-1 hover:underline text-white cursor-pointer"
                            >
                                <FaUserPlus className="text-xl" />
                                <span className="hidden sm:inline">Iniciar sesión</span>
                            </Link>
                        ) : (
                            <Link
                                href="/page/user/profile"
                                className="flex items-center gap-1 hover:underline text-white cursor-pointer"
                            >
                                <FaUserCircle className="text-xl" />
                                <span className="hidden sm:inline">Mi cuenta</span>
                            </Link>
                        )}
                        <CartIcon iconSize="text-2xl" />
                    </div>
                </div>
            </div>
            <Categoria />
        </header>
    );
}