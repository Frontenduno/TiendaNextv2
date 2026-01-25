"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LucideIcon, ShoppingCart } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  Icon: LucideIcon;
  showButton?: boolean;
}

export default function EmptyState({ title, message, Icon, showButton = false }: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-20 shadow-sm flex flex-col items-center justify-center">
      <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon className="text-gray-300 w-8 h-8 md:w-12 md:h-12" />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 text-center">{title}</h3>
      <p className="text-sm md:text-base text-gray-500 text-center max-w-sm mb-8">{message}</p>
      {showButton && (
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 w-full md:w-auto justify-center transition-colors"
        >
          <ShoppingCart size={18} />
          Explorar productos
        </button>
      )}
    </div>
  );
}