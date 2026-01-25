// components/cart/DeliveryMethodSelector.tsx
'use client';

import React from 'react';
import { Truck, Store } from 'lucide-react';
import { DeliveryMethod } from '@/interfaces/delivery';

interface DeliveryMethodSelectorProps {
  selectedMethod: DeliveryMethod;
  onMethodChange: (method: DeliveryMethod) => void;
}

export const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const methods = [
    {
      id: 'home' as DeliveryMethod,
      title: 'Envío a domicilio',
      description: 'Recibe tu pedido en la puerta de tu casa',
      icon: Truck,
    },
    {
      id: 'store' as DeliveryMethod,
      title: 'Recoger en tienda',
      description: 'Retira tu pedido en nuestra tienda más cercana',
      icon: Store,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Método de entrega</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all
                ${isSelected 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-lg
                  ${isSelected ? 'bg-blue-600' : 'bg-gray-100'}
                `}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className={`
                    font-semibold mb-1
                    ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                  `}>
                    {method.title}
                  </h3>
                  <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                    {method.description}
                  </p>
                </div>

                {/* Radio indicator */}
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'border-blue-600' : 'border-gray-300'}
                `}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};