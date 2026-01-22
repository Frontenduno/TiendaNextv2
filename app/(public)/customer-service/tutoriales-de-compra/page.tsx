'use client';

import React from 'react';
import Link from 'next/link';
import { HowToBuyData, PurchaseStep } from '@/interfaces/footer/customer-service/tutorials';
import tutorialsDataJson from '@/data/footer/customer-service/tutorials.json';

const data = tutorialsDataJson as HowToBuyData;

// Mapeo de iconos
const iconMap: Record<string, React.ReactNode> = {
  search: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  eye: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  options: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  cart: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  clipboard: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  location: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  truck: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  card: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  check: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// Componente de paso individual
function StepCard({ step, isLast }: { step: PurchaseStep; isLast: boolean }) {
  const isEven = step.step % 2 === 0;
  
  return (
    <div className="relative">
      {/* Línea conectora vertical */}
      {!isLast && (
        <div className="absolute left-1/2 top-full w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 hidden md:block" />
      )}
      
      <div className={`flex flex-col md:flex-row items-center gap-6 ${isEven ? 'md:flex-row-reverse' : ''}`}>
        {/* Contenido */}
        <div className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
          <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100`}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        </div>
        
        {/* Círculo con número e icono */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex flex-col items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <span className="text-2xl font-bold">{step.step}</span>
          </div>
          <div className="mt-2 p-2 bg-blue-100 rounded-lg text-blue-600">
            {iconMap[step.icon] || iconMap.search}
          </div>
        </div>
        
        {/* Espacio vacío para balance */}
        <div className="flex-1 hidden md:block" />
      </div>
    </div>
  );
}

export default function TutorialesDeCompraPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl p-8 sm:p-12 mb-12 text-white relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Guía paso a paso</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {data.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          </div>
        </section>

        {/* Timeline de pasos */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="space-y-8">
            {data.steps.map((step, index) => (
              <StepCard 
                key={step.step} 
                step={step} 
                isLast={index === data.steps.length - 1}
              />
            ))}
          </div>
        </section>

        {/* Banner de éxito */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Listo!</h2>
            <p className="text-white/90 max-w-md mx-auto">
              Tu pedido está en camino. Recibirás actualizaciones por email sobre el estado de tu envío.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
