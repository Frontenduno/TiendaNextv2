'use client';

import React from 'react';
import { MeasurementTip } from '@/interfaces/footer/customer-service/size-guide';
import { getMeasurementIcon } from './Icons';

interface MeasurementTipCardProps {
  tip: MeasurementTip;
}

export const MeasurementTipCard: React.FC<MeasurementTipCardProps> = ({ tip }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
        <span className="text-blue-600">
          {getMeasurementIcon(tip.icon, "w-6 h-6")}
        </span>
      </div>
      <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">
        {tip.title}
      </h4>
      <p className="text-gray-600 text-sm text-center">{tip.description}</p>
    </div>
  );
};

export default MeasurementTipCard;
