// app/(shop)/profile/layout.tsx
"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileMobileNav from './components/ProfileMobileNav';

const SECTIONS = {
  '/profile/datos-personales': 'Datos personales',
  '/profile/historial-compras': 'Historial de compras',
  '/profile/favoritos': 'Mis favoritos',
  '/profile/pedidos': 'Compras en proceso',
  '/profile/ubicaciones': 'Mis ubicaciones',
} as const;

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getActiveTab = () => {
    return SECTIONS[pathname as keyof typeof SECTIONS] || 'Datos personales';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-gray-800">

      {/* NAV MOBILE */}
      <ProfileMobileNav
        activeTab={getActiveTab()}
        onLogout={handleLogout}
        user={{
          nombre: user.nombre,
          apellido: user.apellido,
        }}
      />

      {/* CONTENEDOR GENERAL CENTRADO */}
      <div className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-6 flex flex-col md:flex-row gap-6">

          {/* SIDEBAR DESKTOP */}
          <ProfileSidebar
            activeTab={getActiveTab()}
            onLogout={handleLogout}
            user={{
              nombre: user.nombre,
              apellido: user.apellido,
            }}
          />

          {/* CONTENIDO */}
          <main className="flex-1 min-w-0 bg-transparent">
            {children}
          </main>

        </div>
      </div>

    </div>
  );
}
