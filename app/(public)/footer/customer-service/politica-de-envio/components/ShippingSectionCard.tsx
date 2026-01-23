import React from 'react';
import { ShippingSection } from '@/interfaces/footer/customer-service/shipping';
import { getIcon, CheckCircleIcon } from '../../components/Icons';

interface ShippingSectionCardProps {
  section: ShippingSection;
  index: number;
}

export const ShippingSectionCard: React.FC<ShippingSectionCardProps> = ({ section, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div 
      id={section.id}
      className="scroll-mt-24 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className={`p-6 sm:p-8 ${isEven ? 'bg-linear-to-r from-blue-50/50 to-white' : 'bg-white'}`}>
        {/* Header - Centrado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 text-white rounded-xl mb-4">
            {getIcon(section.icon)}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {section.title}
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {section.content}
          </p>
        </div>
        
        {/* Items Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {section.items.map((item, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-200 border border-transparent hover:border-blue-100"
            >
              <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingSectionCard;
