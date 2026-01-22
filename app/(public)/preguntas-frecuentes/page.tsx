"use client";

import { useState } from "react";
import faqDataJson from "@/data/footer/service-customer/faq.json";
import { FAQData, FAQItem, FAQCategoryData } from "@/interfaces/footer/service-customer/faq";

const faqData = faqDataJson as FAQData;

// Mapeo de iconos por nombre
const iconMap: Record<string, React.ReactNode> = {
  "clipboard-list": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  "package": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  "credit-card": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  "cube": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  "refresh": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  "user": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  "tag": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
};

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 px-4 flex items-center justify-between text-left hover:bg-blue-50 transition-colors duration-200"
      >
        <span className="font-medium text-gray-900 pr-4">{item.question}</span>
        <svg
          className={`w-5 h-5 text-blue-500 transform transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-4 pb-4 text-gray-600 leading-relaxed">{item.answer}</p>
      </div>
    </div>
  );
}

function CategorySection({ category, openItems, toggleItem }: { 
  category: FAQCategoryData; 
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}) {
  return (
    <div id={category.id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          {iconMap[category.icon] || iconMap["clipboard-list"]}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {category.items.map((item, index) => {
          const itemId = `${category.id}-${index}`;
          return (
            <FAQAccordion
              key={itemId}
              item={item}
              isOpen={openItems.has(itemId)}
              onToggle={() => toggleItem(itemId)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function PreguntasFrecuentesPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const filteredData = faqData.categorias.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => 
    activeCategory ? category.id === activeCategory : category.items.length > 0
  );

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-lg p-8 sm:p-12 mb-8 text-white">
                <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Preguntas Frecuentes
                </h1>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                    Encuentra respuestas a las dudas más comunes sobre pedidos, envíos, pagos y más.
                    ¿No encuentras lo que buscas? Contáctanos.
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto">
                    <input
                    type="text"
                    placeholder="Buscar una pregunta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-4 pl-12 rounded-xl text-gray-800 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                    />
                    <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                    </svg>
                </div>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                <div className="flex overflow-x-auto py-3 gap-2 scrollbar-hide">
                    <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeCategory === null
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                    }`}
                    >
                    Todas
                    </button>
                    {faqData.categorias.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => scrollToCategory(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeCategory === category.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                        }`}
                    >
                        {category.title}
                    </button>
                    ))}
                </div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-5xl mx-auto px-4 py-12">
                {filteredData.length > 0 ? (
                <div className="space-y-10">
                    {filteredData.map((category) => (
                    <CategorySection
                        key={category.id}
                        category={category}
                        openItems={openItems}
                        toggleItem={toggleItem}
                    />
                    ))}
                </div>
                ) : (
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No encontramos resultados</h3>
                    <p className="text-gray-500 mb-6">
                    No hay preguntas que coincidan con &quot;{searchTerm}&quot;
                    </p>
                    <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                    Limpiar búsqueda
                    </button>
                </div>
                )}
            </div>
        </div>
    </div>
  );
}
