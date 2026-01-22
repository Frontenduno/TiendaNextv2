import React, { ReactNode } from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  badgeText?: string;
  badgeIcon?: ReactNode;
  children?: ReactNode;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  subtitle,
  lastUpdated,
  badgeText,
  badgeIcon,
  children
}) => {
  return (
    <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl p-8 sm:p-12 mb-8 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {badgeText && (
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            {badgeIcon}
            {badgeText}
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {title}
        </h1>
        <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        {children}
        
        {lastUpdated && (
          <p className="text-blue-200 text-sm">
            Última actualización: {formatDate(lastUpdated)}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
