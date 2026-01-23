'use client';

import React from 'react';
import { FAQCategoryData } from '@/interfaces/footer/customer-service/faq';
import { FAQAccordion } from './FAQAccordion';
import { getIcon } from '../../components/Icons';

interface CategorySectionProps {
  category: FAQCategoryData;
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  openItems, 
  toggleItem 
}) => {
  return (
    <div id={category.id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          {getIcon(category.icon)}
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
};

export default CategorySection;
