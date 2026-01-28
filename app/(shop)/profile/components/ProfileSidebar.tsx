"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  Clock,
  MapPin,
  Building2,
  LogOut,
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  url?: string;
  action?: () => void;
}

interface ProfileSidebarProps {
  activeTab: string;
  onLogout: () => void;
  user: {
    nombre: string;
    apellido: string;
  };
}

export default function ProfileSidebar({
  activeTab,
  onLogout,
  user,
}: ProfileSidebarProps) {
  const router = useRouter();
  const initials = `${user.nombre[0]}${user.apellido[0]}`.toUpperCase();

  const menuOptions: MenuItem[] = [
    { name: "Datos personales", icon: User, url: "/profile/datos-personales" },
    { name: "Historial de compras", icon: ShoppingBag, url: "/profile/historial-compras" },
    { name: "Mis favoritos", icon: Heart, url: "/profile/favoritos" },
    { name: "Compras en proceso", icon: Clock, url: "/profile/pedidos" },
    { name: "Mis ubicaciones", icon: MapPin, url: "/profile/ubicaciones" },
    { name: "Mis empresas", icon: Building2, url: "/profile/empresas" },
    { name: "Cerrar sesión", icon: LogOut, action: onLogout },
  ];

  return (
    <aside className="
        hidden md:flex
        flex-col
        flex-shrink-0
        w-[260px] lg:w-[300px]
        bg-white
        border border-gray-200
        rounded-xl
        sticky top-28
        h-fit
        mt-[40px]
    ">
      <div className="p-6">

        {/* USER */}
        <div className="flex flex-col items-center gap-3 pb-6 border-b">
          <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>
          <p className="text-base font-bold text-gray-800 text-center">
            {user.nombre} {user.apellido}
          </p>
        </div>

        {/* MENU */}
        <nav className="mt-5 space-y-1">
          {menuOptions.map((item) => {
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => item.url ? router.push(item.url) : item.action?.()}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}