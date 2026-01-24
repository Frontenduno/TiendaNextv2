// components/layout/HeaderPublic.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Search, User, ShoppingCart, Menu } from "lucide-react";
import MenuSidebar from "../MenuSidebar";
import { Usuario } from "@/interfaces/user";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart/cartStore";

export default function HeaderPublic() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  
  // Solución al error de hidratación: solo mostrar el contador después de la hidratación
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/search?search=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setShowProfileMenu(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <>
      <header
        className={`w-full bg-[#2c1ff1] shadow-md font-sans fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-5">
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <Link href="/" className="flex-shrink-0 cursor-pointer">
              <Image
                src="/logo.png"
                alt="MiTienda Logo"
                width={260}
                height={90}
                className="h-16 sm:h-20 lg:h-24 w-auto"
              />
            </Link>

            <button
              onClick={() => setShowMenuSidebar(!showMenuSidebar)}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-md cursor-pointer"
            >
              <Menu className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2c1ff1]" />
              <span className="hidden sm:inline text-sm lg:text-base font-semibold text-[#2c1ff1]">
                Menú
              </span>
            </button>

            <div className="flex-1 max-w-2xl hidden md:block md:ml-8 lg:ml-12">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-2.5 lg:py-3 pr-12 rounded-lg border-2 border-white bg-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-700 placeholder-gray-400 text-sm lg:text-base"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <Search className="text-gray-400 w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-8 lg:gap-12 ml-auto md:ml-8 lg:ml-12">
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-md cursor-pointer"
                >
                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-[#2c1ff1]" />
                </button>

                {showProfileMenu && !isLoggedIn && (
                  <div className="absolute right-0 top-full mt-3 w-48 sm:w-52 bg-white rounded-lg shadow-2xl overflow-hidden z-50">
                    <div className="p-3 sm:p-4 space-y-2">
                      <Link
                        href="/login"
                        className="block w-full px-4 py-2.5 bg-[#2c1ff1] hover:bg-[#2416d4] text-white font-medium rounded text-center transition-colors text-sm cursor-pointer"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full px-4 py-2.5 bg-white hover:bg-gray-50 text-[#2c1ff1] font-medium rounded text-center transition-colors border border-[#2c1ff1] text-sm cursor-pointer"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Registrarse
                      </Link>
                    </div>
                  </div>
                )}

                {showProfileMenu && isLoggedIn && user && (
                  <div className="absolute right-0 top-full mt-3 w-52 sm:w-56 bg-white rounded-lg shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 bg-[#2c1ff1] text-white border-b">
                      <p className="font-semibold text-sm">
                        ¡Hola {user.nombre}!
                      </p>
                    </div>
                    <div className="p-3 space-y-2">
                      <Link
                        href="/mis-compras"
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <span className="text-[#2c1ff1]">🛍️</span>
                        <span className="text-sm text-gray-700">
                          Mis compras
                        </span>
                      </Link>
                      <Link
                        href="/mi-cuenta"
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <span className="text-[#2c1ff1]">👤</span>
                        <span className="text-sm text-gray-700">Mi cuenta</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsLoggedIn(false);
                          setUser(null);
                          setShowProfileMenu(false);
                        }}
                        className="w-full mt-2 px-4 py-2.5 bg-[#2c1ff1] hover:bg-[#2416d4] text-white font-medium rounded text-center transition-colors text-sm cursor-pointer"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/cart"
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-white hover:bg-gray-50 transition-colors relative shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-[#2c1ff1]" />
                {/* Solo mostrar el badge después de la hidratación para evitar errores */}
                {hasHydrated && itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {itemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="md:hidden px-0 pt-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Buscar productos..."
                className="w-full px-4 py-2.5 pr-14 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400 text-sm"
              />

              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 text-gray-500 active:scale-95 hover:bg-gray-200 transition"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-24 sm:h-28 md:h-32 lg:h-36"></div>

      <MenuSidebar
        isOpen={showMenuSidebar}
        onClose={() => setShowMenuSidebar(false)}
      />
    </>
  );
}