"use client";

import { useState, useCallback, useMemo } from "react";
import returnsDataJson from "@/data/footer/customer-service/returns.json";
import { ReturnsData } from "@/interfaces/footer/customer-service/returns";
import { HeroSection, ImportantNotes } from "@/components/ui/index";
import { RefreshIcon } from "@/components/ui/Icons";
import { AccordionSection } from "./components";

const returnsData = returnsDataJson as ReturnsData;

export default function PoliticaDeDevolucionPage() {
  const [openSection, setOpenSection] = useState<string | null>(returnsData.sections[0]?.id || null);

  const handleToggle = useCallback((sectionId: string) => {
    setOpenSection(prev => prev === sectionId ? null : sectionId);
  }, []);

  const badgeIcon = useMemo(() => <RefreshIcon className="w-4 h-4" />, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8">
        <HeroSection
          title={returnsData.title}
          subtitle={returnsData.subtitle}
          lastUpdated={returnsData.lastUpdated}
          badgeText="Cambios y Devoluciones"
          badgeIcon={badgeIcon}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Accordion Sections */}
          <div className="space-y-4 mb-10">
            {returnsData.sections.map((section, index) => (
              <AccordionSection
                key={section.id}
                section={section}
                index={index}
                isOpen={openSection === section.id}
                onToggle={() => handleToggle(section.id)}
              />
            ))}
          </div>

          {/* Important Notes */}
          <ImportantNotes notes={returnsData.importantNotes} />
        </div>
      </div>
    </div>
  );
}
