"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  Clock,
  MapPin,
  LogOut,
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  url?: string;
  action?: () => void;
}

interface ProfileMobileNavProps {
  activeTab: string;
  onLogout: () => void;
  user: {
    nombre: string;
    apellido: string;
  };
}

export default function ProfileMobileNav({
  activeTab,
  onLogout,
  user,
}: ProfileMobileNavProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const initials = `${user.nombre[0]}${user.apellido[0]}`.toUpperCase();

  const menuOptions: MenuItem[] = [
    { name: "Datos personales", icon: User, url: "/profile/datos-personales" },
    { name: "Historial de compras", icon: ShoppingBag, url: "/profile/historial-compras" },
    { name: "Mis favoritos", icon: Heart, url: "/profile/favoritos" },
    { name: "Compras en proceso", icon: Clock, url: "/profile/pedidos" },
    { name: "Mis ubicaciones", icon: MapPin, url: "/profile/ubicaciones" },
    { name: "Cerrar sesión", icon: LogOut, action: onLogout },
  ];

  useEffect(() => {
    const el = scrollRef.current?.querySelector(".active-tab");
    el?.scrollIntoView({ inline: "center" });
  }, [activeTab]);

  return (
    <nav className="md:hidden mt-[80px] bg-white border-b">
      {/* USER */}
      <div className="flex flex-col items-center py-5 border-b">
        <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
          {initials}
        </div>
        <p className="mt-2 text-sm font-bold">
          {user.nombre} {user.apellido}
        </p>
      </div>

      {/* MENU */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 px-4 py-3 no-scrollbar"
      >
        {menuOptions.map((item) => {
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => item.url ? router.push(item.url) : item.action?.()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 active-tab"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <item.icon size={16} />
              <span className="whitespace-nowrap">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
