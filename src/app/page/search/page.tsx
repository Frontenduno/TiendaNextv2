'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/Category/ProductGrid';
import FilterMenu from '@/components/Category/FilterMenu';
import Pagination from '@/components/Category/Pagination';
import { useSearchAndFilterProducts } from '@/types/useSearchAndFilterProducts';

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const initialSearchQuery = searchParams.get('query') || '';

    const {
        currentProducts,
        totalPages,
        currentPage,
        currentFilters,
        handlePageChange,
        handleApplyFilters,
        totalMatchingProducts,
    } = useSearchAndFilterProducts(initialSearchQuery);

    return (
        <main className="flex flex-col md:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-6">
            <aside className="w-full md:w-1/4 flex-shrink-0">
                <FilterMenu onApplyFilters={handleApplyFilters} currentFilters={currentFilters} />
            </aside>

            <section className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Resultados para "{initialSearchQuery}" ({totalMatchingProducts} productos)
                </h1>

                {currentProducts.length > 0 ? (
                    <>
                        <ProductGrid products={currentProducts} categoryName="Resultados de Búsqueda" />

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-10 text-gray-500 text-lg">
                        No se encontraron productos que coincidan con su búsqueda y filtros.
                    </div>
                )}
            </section>
        </main>
    );
}