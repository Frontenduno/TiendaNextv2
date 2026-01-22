"use client";

import { useState } from "react";

export interface AccordionSection {
  id: string;
  title: string;
  content: string[];
}

interface AccordionItemProps {
  section: AccordionSection;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ section, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-blue-50 transition-colors text-left"
      >
        <span className="font-semibold text-gray-900">{section.title}</span>
        <svg
          className={`w-5 h-5 text-blue-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 pt-0 bg-white border-t border-gray-100">
          <div className="space-y-3 pt-4">
            {section.content.map((paragraph, index) => (
              <p key={index} className="text-gray-600 leading-relaxed text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  sections: AccordionSection[];
}

export default function Accordion({ sections }: AccordionProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenSections(sections.map((s) => s.id));
  };

  const collapseAll = () => {
    setOpenSections([]);
  };

  return (
    <div>
      {/* Expand/Collapse All Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={expandAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Expandir todo
        </button>
        <button
          onClick={collapseAll}
          className="text-sm text-gray-600 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Colapsar todo
        </button>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            section={section}
            isOpen={openSections.includes(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </div>
    </div>
  );
}
