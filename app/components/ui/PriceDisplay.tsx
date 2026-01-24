// components/ui/PriceDisplay.tsx
'use client';

import React from 'react';
import { formatPrice, formatDiscount } from '@/utils/pricing';

interface PriceDisplayProps {
  finalPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  orientation?: 'horizontal' | 'vertical';
  showBadge?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    finalPrice: 'text-sm',
    originalPrice: 'text-xs',
    badge: 'text-[10px] px-1.5 py-0.5',
  },
  md: {
    finalPrice: 'text-lg',
    originalPrice: 'text-sm',
    badge: 'text-xs px-2 py-0.5',
  },
  lg: {
    finalPrice: 'text-xl',
    originalPrice: 'text-base',
    badge: 'text-sm px-2.5 py-1',
  },
  xl: {
    finalPrice: 'text-2xl sm:text-3xl',
    originalPrice: 'text-base sm:text-lg',
    badge: 'text-sm px-2 py-1',
  },
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  finalPrice,
  originalPrice,
  discountPercentage,
  size = 'md',
  orientation = 'vertical',
  showBadge = true,
  className = '',
}) => {
  const config = sizeConfig[size];
  const hasDiscount = originalPrice !== undefined && originalPrice > finalPrice;

  if (orientation === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`${config.finalPrice} font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
          {formatPrice(finalPrice)}
        </span>
        {hasDiscount && (
          <>
            {showBadge && discountPercentage && (
              <span className={`bg-red-500 text-white ${config.badge} rounded font-medium`}>
                {formatDiscount(discountPercentage)}
              </span>
            )}
            <span className={`${config.originalPrice} text-gray-500 line-through`}>
              {formatPrice(originalPrice)}
            </span>
          </>
        )}
      </div>
    );
  }

  // Vertical (default)
  return (
    <div className={className}>
      {hasDiscount ? (
        <>
          <div className="flex items-center gap-2 mb-1">
            <span className={`${config.finalPrice} font-bold text-red-600`}>
              {formatPrice(finalPrice)}
            </span>
            {showBadge && discountPercentage && (
              <span className={`bg-red-500 text-white ${config.badge} rounded font-medium`}>
                {formatDiscount(discountPercentage)}
              </span>
            )}
          </div>
          <p className={`${config.originalPrice} text-gray-500 line-through`}>
            {formatPrice(originalPrice)}
          </p>
        </>
      ) : (
        <span className={`${config.finalPrice} font-bold text-gray-900`}>
          {formatPrice(finalPrice)}
        </span>
      )}
    </div>
  );
};