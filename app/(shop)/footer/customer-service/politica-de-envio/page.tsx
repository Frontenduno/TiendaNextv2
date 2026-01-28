"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import shippingDataJson from "@/data/footer/customer-service/shipping.json";
import { ShippingData } from "@/interfaces/footer/customer-service/shipping";
import { ImportantNotes, StickyNav, TruckIcon } from "../components";
import { ShippingSectionCard } from "./components/ShippingSectionCard";
import { HeroBanner } from "@/components/shared/HeroBanner";

const shippingData = shippingDataJson as ShippingData;

export default function PoliticaDeEnvioPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Detectar sección activa al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = shippingData.sections.map((s) => ({
        id: s.id,
        element: document.getElementById(s.id),
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleNavClick = useCallback((id: string | null) => {
    if (id) scrollToSection(id);
  }, [scrollToSection]);

  const badgeIcon = useMemo(() => <TruckIcon className="w-4 h-4" />, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroBanner
          title={shippingData.title}
          subtitle={shippingData.subtitle}
          badge={{
            text: "Información de Envíos",
            icon: badgeIcon
          }}
          padding="p-8 sm:p-12 mb-8"
        />

        {/* Section Navigation */}
        <StickyNav
          items={shippingData.sections}
          activeId={activeSection}
          onItemClick={handleNavClick}
        />

        {/* Main Content */}
        <div className="max-w-5xl mx-auto py-8">
          {/* Shipping Sections */}
          <div className="space-y-6 mb-8">
            {shippingData.sections.map((section, index) => (
              <ShippingSectionCard
                key={section.id}
                section={section}
                index={index}
              />
            ))}
          </div>

          {/* Important Notes */}
          <ImportantNotes notes={shippingData.importantNotes} />
        </div>
      </div>
    </div>
  );
}