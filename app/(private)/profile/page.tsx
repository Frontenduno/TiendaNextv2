"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, ShoppingBag, Heart, Clock, LogOut, 
  ShoppingCart 
} from 'lucide-react';
import usersData from '@/data/user.json'; 
import PersonalDataForm from './components/PersonalDataForm';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Datos personales');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      // Si no hay usuario en localStorage, redirigir al home
      router.push('/');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    // Limpiar localStorage al cerrar sesión
    localStorage.removeItem('user');
    router.push('/');
  };

  const menuOptions = [
    { name: 'Datos personales', icon: User },
    { name: 'Historial de compras', icon: ShoppingBag },
    { name: 'Mis favoritos', icon: Heart },
    { name: 'Compras en proceso', icon: Clock },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector('.active-tab');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab]);

  const renderEmptyState = (title: string, message: string, Icon: any, showButton: boolean = false) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-20 shadow-sm flex flex-col items-center justify-center">
      <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon className="text-gray-300 w-8 h-8 md:w-12 md:h-12" />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 text-center">{title}</h3>
      <p className="text-sm md:text-base text-gray-500 text-center max-w-sm mb-8">{message}</p>
      {showButton && (
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 w-full md:w-auto justify-center transition-colors">
          <ShoppingCart size={18} />
          Explorar productos
        </button>
      )}
    </div>
  );

  // Mostrar loading mientras se verifica la sesión
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

  // Si no hay usuario después de cargar, no mostrar nada (se redirigirá)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* === NAVEGACIÓN MÓVIL (TABS HORIZONTALES) === */}
      {/* mt-[80px] para que aparezca debajo de la barra de búsqueda */}
      <nav className="md:hidden relative mt-[80px] z-10 bg-white border-b border-gray-200">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar items-center px-4 py-4 gap-3 bg-white"
        >
          {menuOptions.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                activeTab === item.name
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm active-tab'
                  : 'text-gray-500 bg-gray-50 border-gray-100 hover:bg-gray-100'
              }`}
            >
              <item.icon size={14} />
              <span className="whitespace-nowrap">{item.name}</span>
            </button>
          ))}
          
          {/* Cerrar sesión en móvil al final del scroll */}
          <button 
            onClick={handleLogout}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-[#ef233c] border border-red-600 shadow-sm"
          >
            <LogOut size={14} />
            <span className="whitespace-nowrap">Cerrar sesión</span>
          </button>
        </div>
      </nav>

      {/* === SIDEBAR ESCRITORIO === */}
      <aside className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col sticky top-[80px] h-[calc(100vh-80px)] self-start z-20">
        <div className="p-6 flex flex-col h-full">
          <div className="space-y-1 flex-1">
            {menuOptions.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center px-5 py-3.5 text-sm font-semibold border-l-4 rounded-r-lg transition-colors ${
                  activeTab === item.name
                    ? 'bg-blue-50 text-blue-700 border-blue-700' 
                    : 'text-gray-600 border-transparent hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} className="mr-3" />
                {item.name}
              </button>
            ))}
          </div>
          
          {/* Cerrar sesión al final del sidebar */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-5 py-3.5 text-sm font-bold text-white bg-[#ef233c] hover:bg-red-700 rounded-md shadow-md transition-colors group"
            >
              <LogOut size={18} className="mr-3 group-hover:-translate-x-1 transition-transform" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      <main className="flex-1 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            {activeTab}
          </h1>

          <div className="pb-20">
            {activeTab === 'Datos personales' && <PersonalDataForm user={user} />}
            {activeTab === 'Historial de compras' && renderEmptyState("No tienes compras", "Aparecerán aquí después de tu primer pedido.", ShoppingBag)}
            {activeTab === 'Mis favoritos' && renderEmptyState("Sin favoritos", "Guarda lo que más te guste.", Heart, true)}
            {activeTab === 'Compras en proceso' && renderEmptyState("No hay pedidos en curso", "Sigue tus envíos aquí.", Clock)}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}