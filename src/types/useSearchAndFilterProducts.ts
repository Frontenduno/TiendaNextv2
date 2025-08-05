import { useState, useEffect, useCallback } from 'react';
import { Product, getFilteredProducts, availableGlobalColors } from '@/data/products';

interface Filters {
    priceRange?: { min: number; max: number | null };
    brand?: string[];
    color?: string[];
    sortBy?: string;
}

interface UseSearchAndFilterProductsResult {
    filteredAndSortedProducts: Product[];
    currentProducts: Product[];
    totalPages: number;
    currentPage: number;
    currentFilters: Filters;
    handlePageChange: (pageNumber: number) => void;
    handleApplyFilters: (filters: Filters) => void;
    totalMatchingProducts: number;
    loading: boolean;
}

const PRODUCTS_PER_PAGE = 8;

// Este hook maneja la lógica de la página de resultados de búsqueda.
export function useSearchAndFilterProducts(initialSearchQuery: string): UseSearchAndFilterProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalMatchingProducts, setTotalMatchingProducts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState<Filters>({});
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { products: fetchedProducts, totalProducts } = await getFilteredProducts(
                'busqueda', 
                initialSearchQuery, 
                currentPage,
                currentFilters,
                PRODUCTS_PER_PAGE
            );
            setProducts(fetchedProducts);
            setTotalMatchingProducts(totalProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
            setTotalMatchingProducts(0);
        } finally {
            setLoading(false);
        }
    }, [initialSearchQuery, currentPage, currentFilters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePageChange = useCallback((pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleApplyFilters = useCallback((filters: Filters) => {
        setCurrentFilters(filters);
        setCurrentPage(1);
    }, []);

    const totalPages = Math.ceil(totalMatchingProducts / PRODUCTS_PER_PAGE);

    return {
        filteredAndSortedProducts: products,
        currentProducts: products,
        totalPages,
        currentPage,
        currentFilters,
        handlePageChange,
        handleApplyFilters,
        totalMatchingProducts,
        loading,
    };
}