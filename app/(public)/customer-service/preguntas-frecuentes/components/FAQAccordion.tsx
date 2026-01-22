'use client';

import React from 'react';
import { FAQItem } from '@/interfaces/footer/customer-service/faq';
import { ChevronDownIcon } from '@/components/ui/Icons';

interface FAQAccordionProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ item, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 px-4 flex items-center justify-between text-left hover:bg-blue-50 transition-colors duration-200"
      >
        <span className="font-medium text-gray-900 pr-4">{item.question}</span>
        <ChevronDownIcon 
          className={`w-5 h-5 text-blue-500 transform transition-transform duration-300 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
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
};

export default FAQAccordion;
