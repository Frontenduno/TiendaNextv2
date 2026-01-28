// components/shared/HeroBanner.tsx
import React from 'react';

export interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
  gradient?: string;
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  maxWidth?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  badge,
  gradient = 'from-blue-600 to-blue-800',
  backgroundColor,
  textColor = 'text-white',
  padding = 'p-6 sm:p-8',
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  maxWidth = 'max-w-4xl',
}) => {
  const bgClass = backgroundColor || `bg-gradient-to-br ${gradient}`;

  return (
    <section className={`${bgClass} ${padding} ${textColor} ${className}`}>
      <div className={`${maxWidth} mx-auto text-center`}>
        {badge && (
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 mb-6">
            {badge.icon}
            <span className="text-sm font-medium">{badge.text}</span>
          </div>
        )}
        
        {title && (
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${titleClassName}`}>
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p className={`text-lg md:text-xl opacity-90 ${subtitleClassName}`}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;