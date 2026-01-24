'use client';

import React from 'react';
import { ReturnSection } from '@/interfaces/footer/customer-service/returns';
import { getIcon, ChevronDownIcon, ArrowRightIcon } from '../../components/Icons';

interface AccordionSectionProps {
  section: ReturnSection;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ 
  section, 
  index, 
  isOpen, 
  onToggle 
}) => {
  const stepNumber = index + 1;
  
  return (
    <div 
      id={section.id}
      className={`group rounded-2xl border-2 transition-all duration-300 ${
        isOpen 
          ? 'border-blue-500 bg-white shadow-lg shadow-blue-100' 
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center gap-4 text-left"
      >
        {/* Step Number */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-colors duration-300 ${
          isOpen 
            ? 'bg-blue-600 text-white' 
            : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
        }`}>
          {stepNumber}
        </div>
        
        {/* Icon & Title */}
        <div className="flex-1 flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors duration-300 ${
            isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
          }`}>
            {getIcon(section.icon, 'w-5 h-5')}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {section.title}
            </h3>
            {!isOpen && (
              <p className="text-sm text-gray-500 line-clamp-1">
                {section.content}
              </p>
            )}
          </div>
        </div>
        
        {/* Chevron */}
        <ChevronDownIcon 
          className={`w-6 h-6 text-gray-400 transition-transform duration-300 shrink-0 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`} 
        />
      </button>
      
      {/* Content */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6">
          {/* Description */}
          <p className="text-gray-600 mb-6 pl-16">
            {section.content}
          </p>
          
          {/* Items */}
          <div className="space-y-3 pl-16">
            {section.items.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <ArrowRightIcon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {item.label}
                  </h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionSection;
