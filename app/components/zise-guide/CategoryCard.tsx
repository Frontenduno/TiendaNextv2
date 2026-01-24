'use client';

import React from 'react';
import { SizeCategory, SizeSubCategory } from '@/interfaces/footer/customer-service/size-guide';
import { getCategoryIcon } from './Icons';
import SizeTable from './SizeTable';

interface CategoryCardProps {
  category: SizeCategory;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 px-6 py-4">
        <div className="flex items-center justify-center gap-3 text-white">
          {getCategoryIcon(category.icon, "w-6 h-6")}
          <h3 className="text-xl font-bold">{category.title}</h3>
        </div>
        <p className="text-white/80 text-sm text-center mt-1">{category.description}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {category.subCategories ? (
          <div className="space-y-6">
            {category.subCategories.map((subCategory: SizeSubCategory, index: number) => (
              <SizeTable
                key={index}
                title={subCategory.name}
                headers={subCategory.headers}
                sizes={subCategory.sizes}
              />
            ))}
          </div>
        ) : (
          <SizeTable
            headers={category.headers || []}
            sizes={category.sizes || []}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryCard;