'use client';

import React from 'react';

interface NavItem {
  id: string;
  title: string;
}

interface StickyNavProps {
  items: NavItem[];
  activeId: string | null;
  onItemClick: (id: string | null) => void;
  showAllOption?: boolean;
  allOptionLabel?: string;
  maxWidth?: string;
}

export const StickyNav: React.FC<StickyNavProps> = ({ 
  items, 
  activeId,
  onItemClick,
  showAllOption = false,
  allOptionLabel = "Todas",
  maxWidth = "max-w-5xl"
}) => {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className={`${maxWidth} mx-auto`}>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex justify-center py-3 gap-2 px-4 min-w-max">
            {showAllOption && (
              <button
                onClick={() => onItemClick(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeId === null
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {allOptionLabel}
              </button>
            )}
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeId === item.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyNav;
