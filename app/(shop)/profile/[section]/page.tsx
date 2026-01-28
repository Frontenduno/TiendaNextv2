// app/profile/[section]/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import PersonalDataForm from '../pages/PersonalDataForm';
import PurchaseHistoryPage from '../pages/PurchaseHistoryPage';
import FavoritesPage from '../pages/FavoritesPage';
import OrdersInProgressPage from '../pages/OrdersInProgressPage';
import LocationsPage from '../pages/LocationsPage';
import CompaniesPage from '../pages/CompaniesPage';

const SECTIONS = {
  'datos-personales': {
    title: 'Datos personales',
  },
  'historial-compras': {
    title: 'Historial de compras',
  },
  'favoritos': {
    title: 'Mis favoritos',
  },
  'pedidos': {
    title: 'Compras en proceso',
  },
  'ubicaciones': {
    title: 'Mis ubicaciones',
  },
  'empresas': {
    title: 'Mis empresas',
  },
} as const;

type SectionKey = keyof typeof SECTIONS;

export default function ProfileSectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const section = params.section as SectionKey;

  // Redirigir si la sección no existe
  useEffect(() => {
    if (section && !SECTIONS[section]) {
      router.push('/profile/datos-personales');
    }
  }, [section, router]);

  // Si la sección no existe o no hay usuario, no renderizar
  if (!SECTIONS[section] || !user) {
    return null;
  }

  const currentSection = SECTIONS[section];

  return (
    <main className="flex-1 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          {currentSection.title}
        </h1>

        <div className="pb-20">
          {/* Renderizar componente según la sección */}
          {section === 'datos-personales' && <PersonalDataForm user={user} />}
          {section === 'historial-compras' && <PurchaseHistoryPage />}
          {section === 'favoritos' && <FavoritesPage />}
          {section === 'pedidos' && <OrdersInProgressPage />}
          {section === 'ubicaciones' && <LocationsPage />}
          {section === 'empresas' && <CompaniesPage />}
        </div>
      </div>
    </main>
  );
}