"use client";

import { useState, useCallback, useMemo } from "react";
import faqDataJson from "@/data/footer/customer-service/faq.json";
import { FAQData } from "@/interfaces/footer/customer-service/faq";
import { StickyNav, ClipboardListIcon } from "../components";
import { CategorySection } from "./components/CategorySection";
import { HeroBanner } from "@/components/shared/HeroBanner";

const faqData = faqDataJson as FAQData;

export default function PreguntasFrecuentesPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = useCallback((itemId: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const filteredData = useMemo(() => 
    faqData.categorias.filter((category) => 
      activeCategory ? category.id === activeCategory : true
    ),
    [activeCategory]
  );

  const handleCategoryClick = useCallback((categoryId: string | null) => {
    if (categoryId === null) {
      setActiveCategory(null);
    } else {
      setActiveCategory(prev => prev === categoryId ? null : categoryId);
      const element = document.getElementById(categoryId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const badgeIcon = useMemo(() => <ClipboardListIcon className="w-4 h-4" />, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroBanner
          title="Preguntas Frecuentes"
          subtitle="Encuentra respuestas a las dudas más comunes sobre pedidos, envíos, pagos y más. ¿No encuentras lo que buscas? Contáctanos."
          badge={{
            text: "Centro de Ayuda",
            icon: badgeIcon
          }}
          padding="p-8 sm:p-12 mb-8"
        />

        {/* Category Navigation */}
        <StickyNav
          items={faqData.categorias}
          activeId={activeCategory}
          onItemClick={handleCategoryClick}
          showAllOption={true}
          allOptionLabel="Todas"
        />

        {/* FAQ Content */}
        <div className="max-w-5xl mx-auto px-4 py-12">
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
        </div>
      </div>
    </div>
  );
}