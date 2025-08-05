// src/data/products.ts

// --- Tipos de Datos ---

// Tipo para la estructura de un producto en la aplicación.
export interface Product {
    id: number;
    image: string;
    tag?: string;
    category: string;
    subcategory?: string;
    targetAudience: 'hombre' | 'mujer' | 'unisex' | 'niños';
    name: string;
    model: string;
    price: number;
    oldPrice?: number;
    brand: string;
    color?: string;
    stock: number;
    secondaryImages?: string[];
    sizes?: string[];
    availableColors?: string[];
    description: string;
}

// Interfaz para los colores globales.
export interface GlobalColor {
    id: string;
    name: string;
    hex: string;
}

// Interfaz para los items del carrusel de anuncios.
export interface AdItem {
    id: number;
    src: string;
    alt: string;
    buttonText: string;
    buttonLink?: string;
}

// Interfaz para los logotipos de marcas.
export interface BrandLogoItem {
    id: number;
    src: string;
    alt: string;
    href: string;
}

// Interfaz para los anuncios modales.
export interface ModalAd {
    type: 'login' | 'image';
    src?: string;
    alt?: string;
    title?: string;
}

// Interfaz para un item del carrito.
export interface CartItem {
    productId: number;
    quantity: number;
    selectedSize?: string;
    selectedColorId?: string;
}

// Interfaz para la estructura del carrito.
export interface Cart {
    items: CartItem[];
}

// Interfaz para la estructura de productos que viene de la API.
interface ApiProduct {
    id_art: number;
    cod_art: string;
    codigo: string;
    codprov: string;
    des_art: string;
    des_art2: string;
    precio: number;
    stock: number;
    linea: string;
    categoria: string;
    grupo: string;
    subgrupo: string;
    genero: string;
    tipotalla: string;
    marca: string;
    coleccion: string;
    temporada: string;
    origen: string;
    composicion: string;
    color: string;
    talla: string;
    des_umed: string;
    id_lin: number;
    id_div: number;
    id_fam: number;
    id_mod: number;
    id_gen: number;
    id_tam: number;
    id_mar: number;
    id_colec: number;
    id_temp: number;
    id_origen: number;
    id_comp: number;
    id_color: number;
    id_talla: number;
    id_umedb: number;
}

// --- Constantes Generales ---

export const PRODUCTS_PER_PAGE = 8;

export const availableGlobalColors: GlobalColor[] = [
    { id: "1", name: "Rojo", hex: "bg-red-500" },
    { id: "2", name: "Azul", hex: "bg-blue-500" },
    { id: "3", name: "Verde", hex: "bg-green-500" },
    { id: "4", name: "Amarillo", hex: "bg-yellow-500" },
    { id: "5", name: "Púrpura", hex: "bg-purple-500" },
    { id: "6", name: "Negro", hex: "bg-black" },
    { id: "7", "name": "Blanco", hex: "bg-white border border-gray-300" },
    { id: "8", name: "Gris", hex: "bg-gray-500" },
    { id: "9", name: "Azul Oscuro", hex: "bg-blue-800" },
    { id: "10", name: "Rosa", hex: "bg-pink-500" },
    { id: "11", name: "Granate", hex: "bg-red-900" },
    { id: "12", name: "Celeste", hex: "bg-blue-300" },
    { id: "13", name: "Naranja", hex: "bg-orange-500" },
];

// --- Funciones Auxiliares ---

const normalizeSlugToName = (slug: string) => {
    return decodeURIComponent(slug).replace(/-/g, ' ').toLowerCase();
};

const categoryMap: { [key: string]: (p: Product) => boolean } = {
    'lo-nuevo': (p: Product) => p.tag === 'Nuevo',
    'descuento': (p: Product) => p.tag === 'Oferta' && p.oldPrice !== undefined && p.oldPrice > p.price,
    'hombre': (p: Product) => p.targetAudience === 'hombre',
    'mujer': (p: Product) => p.targetAudience === 'mujer',
    'niños': (p: Product) => p.targetAudience === 'niños',
    'unisex': (p: Product) => p.targetAudience === 'unisex',
    'ropa': (p: Product) => p.category.toLowerCase() === 'ropa',
    'calzado': (p: Product) => p.category.toLowerCase() === 'calzado',
    'accesorios': (p: Product) => p.category.toLowerCase() === 'accesorios',
};

const getDefaultSizes = (category: string) => {
    if (category.toLowerCase() === 'ropa') {
        return ["XS", "S", "M", "L", "XL", "XXL"];
    }
    if (category.toLowerCase() === 'calzado') {
        return ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"];
    }
    if (category.toLowerCase() === 'accesorios') {
        return ["Única"];
    }
    return ["Única"];
};

const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
    let targetAudience: Product['targetAudience'];
    const generoApi = apiProduct.genero?.toLowerCase() || '';

    if (generoApi.includes('hombre')) {
        targetAudience = 'hombre';
    } else if (generoApi.includes('mujer')) {
        targetAudience = 'mujer';
    } else if (generoApi.includes('niños') || generoApi.includes('niño')) {
        targetAudience = 'niños';
    } else {
        targetAudience = 'unisex';
    }

    const primaryColor = availableGlobalColors.find(
        (color) => color.name.toLowerCase() === apiProduct.color?.toLowerCase()
    );
    const availableColors = primaryColor ? [primaryColor.id] : [];
    const mainCategory = apiProduct.linea || apiProduct.categoria;

    return {
        id: apiProduct.id_art,
        image: '/products/user-icon.jpg',
        tag: undefined,
        category: apiProduct.linea || 'General',
        subcategory: apiProduct.grupo || apiProduct.subgrupo || undefined,
        targetAudience: targetAudience,
        name: apiProduct.des_art2 || apiProduct.des_art || 'Sin Nombre',
        model: apiProduct.codigo || apiProduct.cod_art || 'N/A',
        price: apiProduct.precio,
        oldPrice: undefined,
        brand: apiProduct.marca || 'Genérica',
        color: apiProduct.color,
        stock: apiProduct.stock,
        secondaryImages: ['/products/user-icon.jpg', '/products/user-icon.jpg'],
        sizes: getDefaultSizes(mainCategory),
        availableColors: availableColors,
        description: apiProduct.des_art || 'Sin descripción',
    };
};

export const createProductSlug = (name: string, id: number): string => {
    const normalizedName = name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
    return `${normalizedName}-${id}`;
};

export const sampleProducts: Product[] = [];

// --- Datos para los Carruseles del Body ---

export const mainCarouselImages: string[] = ['/banner/banner.webp'];
export const adItems: AdItem[] = [
    { id: 1, src: '/anuncios/add_3.jpg', alt: 'Anuncio de Nike', buttonText: 'Comprar' },
    { id: 2, src: '/anuncios/add_4.jpg', alt: 'Anuncio de Pelotas', buttonText: 'Comprar' },
    { id: 3, src: '/anuncios/add_2.jpg', alt: 'Anuncio de Ropa', buttonText: 'Comprar' },
    { id: 4, src: '/anuncios/add_5.jpg', alt: 'Anuncio de Oferta', buttonText: 'Comprar' },
    { id: 5, src: '/anuncios/add_6.jpg', alt: 'Anuncio de Envío Gratis', buttonText: 'Comprar' },
    { id: 6, src: '/anuncios/add_7.jpg', alt: 'Anuncio de Nueva Temporada', buttonText: 'Comprar' },
    { id: 7, src: '/anuncios/add_1.jpg', alt: 'Anuncio de Nike', buttonText: 'Comprar' },
];
export const brandLogoItems: BrandLogoItem[] = [
    { id: 1, src: '/brands/Nike.png', alt: 'Logo de Nike', href: 'https://www.nike.com' },
    { id: 2, src: '/brands/Puma.png', alt: 'Logo de Puma', href: 'https://us.puma.com' },
    { id: 3, src: '/brands/NewBalance.png', alt: 'Logo de New Balance', href: 'https://www.newbalance.com' },
    { id: 4, src: '/brands/Asics.png', alt: 'Logo de Asics', href: 'https://www.asics.com' },
    { id: 5, src: '/brands/adidas.jpg', alt: 'Logo de Adidas', href: 'https://www.adidas.com' },
    { id: 6, src: '/brands/Under.jpeg', alt: 'Logo de Under Armour', href: 'https://www.underarmour.com' },
    { id: 7, src: '/brands/Umbro.jpg', alt: 'Logo de Umbro', href: 'https://www.umbro.com/' },
    { id: 8, src: '/brands/Jordan.jpg', alt: 'Logo de Jordan', href: 'https://www.nike.com/jordan' },
];
export const finalCarouselImages: string[] = [
    '/banner/banner_1.jpg',
    '/banner/banner_3.jpg',
    '/banner/banner_4.jpg',
    '/banner/banner_5.jpg',
    '/banner/banner_6.jpg'
];
export const modalAds: ModalAd[] = [
    { type: 'login' },
    { type: 'image', src: '/anuncios/add_1.jpg', alt: 'Oferta Especial de Verano' },
];

// --- DATOS INICIALES PARA EL CARRITO DE COMPRAS ---

export const initialCart: Cart = {
    items: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 4 },
        { productId: 3, quantity: 3 },
        { productId: 4, quantity: 1 }
    ]
};

// --- Funciones de Lógica de Negocio ---

/**
 * Obtiene productos de la API, aplicando filtros y paginación.
 * @param {string} categorySlug - El slug de la categoría.
 * @param {string | undefined} subcategorySlug - El slug de la subcategoría.
 * @param {number} page - El número de página actual.
 * @param {object} filters - Los filtros de precio, marca, etc.
 * @param {number} productsPerPage - El número de productos a mostrar por página.
 * @returns {Promise<{ products: Product[]; totalProducts: number }>} Los productos filtrados y el total de productos.
 */
export async function getFilteredProducts(
    categorySlug: string,
    subcategorySlug: string | undefined,
    page: number,
    filters: {
        priceRange?: { min: number; max: number | null };
        brand?: string[];
        color?: string[];
        sortBy?: string;
    },
    productsPerPage: number
): Promise<{ products: Product[]; totalProducts: number }> {
    const isSearch = categorySlug === 'busqueda';
    const searchValue = isSearch ? subcategorySlug : '';
    const BASE_API_URL = 'http://localhost:3001/api/listarArticulos';
    
    const API_URL = `${BASE_API_URL}?busqueda=${encodeURIComponent(searchValue || '')}`;
    
    const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJpZF91c3UiOjk5OSwiaWRfYXV4Ijo5OTksInVzZXJuYW1lIjoiREVWX1VTRVIiLCJwZXJzb25hbCI6IkRFVkVMT1BFUiJ9LCJpYXQiOjE3NTQyNzU4NTAsImV4cCI6MTc1NDM2MjI1MH0.zhIZ1IlT6YMDc0XkrMoOb9rktsqufZh2IeHe18YFbnc';

    let apiProducts: ApiProduct[] = [];
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData.message || "Error desconocido");
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        apiProducts = data.data || [];
    } catch (error) {
        console.error("Error al obtener productos de la API:", error);
        return { products: [], totalProducts: 0 };
    }

    let currentProducts: Product[] = apiProducts.map(mapApiProductToProduct);

    if (isSearch && searchValue) {
        currentProducts = currentProducts.filter(p => 
            p.name.toLowerCase().includes(searchValue.toLowerCase()) || 
            p.brand.toLowerCase().includes(searchValue.toLowerCase()) || 
            p.category.toLowerCase().includes(searchValue.toLowerCase())
        );
    } else {
        const normalizedCategorySlug = normalizeSlugToName(categorySlug);
        const normalizedSubcategorySlug = subcategorySlug ? normalizeSlugToName(subcategorySlug) : undefined;
        
        currentProducts = currentProducts.filter(p => {
            if (categoryMap[normalizedCategorySlug]) {
                return categoryMap[normalizedCategorySlug](p);
            }
            if (normalizedCategorySlug === 'marcas') {
                return normalizedSubcategorySlug ? p.brand.toLowerCase() === normalizedSubcategorySlug : true;
            }
            if (normalizedCategorySlug === 'deporte') {
                const pNameLower = p.name.toLowerCase();
                if (normalizedSubcategorySlug) {
                    switch (normalizedSubcategorySlug) {
                        case 'running': return pNameLower.includes('correr') || pNameLower.includes('run') || p.subcategory?.toLowerCase() === 'zapatillas';
                        case 'fitness': return pNameLower.includes('gym') || pNameLower.includes('entrenamiento') || p.subcategory?.toLowerCase() === 'leggings' || p.subcategory?.toLowerCase() === 'tops';
                        case 'futbol': return pNameLower.includes('fútbol') || pNameLower.includes('botines');
                        case 'voley': return pNameLower.includes('voley');
                        case 'basquet': return pNameLower.includes('basquet') || pNameLower.includes('baloncesto');
                        default: return false;
                    }
                }
                return ['running', 'fitness', 'fútbol', 'voley', 'basquet'].some(s => pNameLower.includes(s));
            }

            let categoryMatch = p.category.toLowerCase() === normalizedCategorySlug;
            let subcategoryMatch = true;
            if (normalizedSubcategorySlug) {
                subcategoryMatch = p.subcategory?.toLowerCase() === normalizedSubcategorySlug || p.name.toLowerCase().includes(normalizedSubcategorySlug);
            }
            return categoryMatch && subcategoryMatch;
        });
    }

    if (filters.priceRange && (filters.priceRange.min !== 0 || filters.priceRange.max !== null)) {
        const min = filters.priceRange.min || 0;
        const max = filters.priceRange.max === null ? Infinity : filters.priceRange.max;
        currentProducts = currentProducts.filter((p) => p.price >= min && p.price <= max);
    }
    if (filters.brand && filters.brand.length > 0) {
        currentProducts = currentProducts.filter((p) =>
            filters.brand!.some((b) => p.brand.toLowerCase() === b.toLowerCase())
        );
    }
    if (filters.color && filters.color.length > 0) {
        currentProducts = currentProducts.filter((p) =>
            p.color && filters.color!.some((c) => p.color!.toLowerCase() === c.toLowerCase())
        );
    }

    if (filters.sortBy) {
        currentProducts.sort((a, b) => {
            if (filters.sortBy === 'price-asc') {
                return a.price - b.price;
            } else if (filters.sortBy === 'price-desc') {
                return b.price - a.price;
            }
            return 0;
        });
    }

    const totalProducts = currentProducts.length;
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsForPage = currentProducts.slice(startIndex, endIndex);

    return { products: productsForPage, totalProducts: totalProducts };
}
