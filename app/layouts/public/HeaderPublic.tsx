"use client";

import Link from "next/link";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import RecoveryPasswordModal from "@/components/auth/RecoveryPasswordModal";
import MessagesBanner from "@/components/MessagesBanner";
import UserMenuDropdown from "@/components/UserMenuDropdown";
import { useState, useEffect, useRef } from "react";
import { Search, User, ShoppingCart, Menu } from "lucide-react";
import MenuSidebar from "../MenuSidebar";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart/cartStore";
import { useAuth } from "@/hooks/useAuth";

export default function HeaderPublic() {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const itemsCount = useCartStore((state) => state.getItemsCount());
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/search?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    router.push("/");
  };

  // Toggle del menú de usuario (solo para móviles)
  const toggleProfileMenu = () => {
    if (isMobile) {
      setShowProfileMenu(!showProfileMenu);
    }
  };

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cerrar menú al hacer scroll
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Cerrar menú al hacer click fuera (solo móviles)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu, isMobile]);

  return (
    <>
      {/* Contenedor fijo que incluye banner y header */}
      <div
        className={`w-full fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Banner de mensajes */}
        <MessagesBanner />
        
        {/* Header principal - padding bottom 10px solo en móviles */}
        <header className="w-full bg-[#2c1ff1] shadow-md font-sans pb-[10px] md:pb-0">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-2 sm:py-0">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <Link href="/" className="flex-shrink-0 cursor-pointer">
                <Image
                  src="/logo.png"
                  alt="MiTienda Logo"
                  width={260}
                  height={90}
                  className="h-14 sm:h-16 lg:h-20 w-auto"
                />
              </Link>

              <button
                onClick={() => setShowMenuSidebar(!showMenuSidebar)}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 lg:px-7 py-2 sm:py-2.5 lg:py-3 hover:bg-[#2416c9] transition-colors cursor-pointer"
              >
                <Menu className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-white" />
                <span className="hidden sm:inline text-base lg:text-xl font-semibold text-white">
                  Menú
                </span>
              </button>

              <div className="flex-1 hidden md:block md:ml-4 lg:ml-6 md:mr-4 lg:mr-6">
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
                    className="w-full px-4 py-2.5 lg:py-3 pr-12 border border-gray-300 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-700 placeholder-gray-400 text-sm lg:text-base shadow-sm"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-700 hover:bg-gray-800 flex items-center justify-center transition-colors"
                    aria-label="Buscar"
                  >
                    <Search className="text-white w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                {/* Menú de usuario no autenticado */}
                {!isAuthenticated && (
                  <div 
                    className="relative" 
                    ref={profileMenuRef}
                    onMouseEnter={() => !isMobile && setShowProfileMenu(true)}
                    onMouseLeave={() => !isMobile && setShowProfileMenu(false)}
                  >
                    <button
                      onClick={toggleProfileMenu}
                      className="flex items-center justify-center hover:bg-[#2416c9] transition-colors cursor-pointer p-2"
                    >
                      <User className="w-9 h-9 lg:w-11 lg:h-11 text-white" />
                    </button>

                    <UserMenuDropdown
                      isOpen={showProfileMenu}
                      onClose={() => setShowProfileMenu(false)}
                      onLoginClick={() => {
                        setIsRegister(false);
                        setIsRecovery(false);
                        setOpenAuthModal(true);
                        setShowProfileMenu(false);
                      }}
                      onRegisterClick={() => {
                        setIsRegister(true);
                        setIsRecovery(false);
                        setOpenAuthModal(true);
                        setShowProfileMenu(false);
                      }}
                    />
                  </div>
                )}

                {/* Menú de usuario autenticado */}
                {isAuthenticated && user && (
                  <div 
                    className="relative"
                    ref={profileMenuRef}
                    onMouseEnter={() => !isMobile && setShowProfileMenu(true)}
                    onMouseLeave={() => !isMobile && setShowProfileMenu(false)}
                  >
                    <button
                      onClick={toggleProfileMenu}
                      className="flex items-center justify-center hover:bg-[#2416c9] transition-colors cursor-pointer p-2"
                    >
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white flex items-center justify-center text-[#2c1ff1] font-bold text-xl lg:text-2xl">
                        {user.nombre.charAt(0).toUpperCase()}
                      </div>
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 top-full mt-0 w-52 sm:w-56 bg-white shadow-2xl overflow-hidden z-50 border-2 border-gray-200 animate-[fadeIn_0.2s_ease-out]">
                        <div className="px-4 py-3 bg-white border-b border-gray-200">
                          <p className="font-semibold text-sm text-blue-600">
                            ¡Hola {user.nombre}!
                          </p>
                        </div>
                        <div className="p-3 space-y-2">
                          <Link
                            href="/profile/datos-personales"
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <span className="text-blue-600">👤</span>
                            <span className="text-sm text-blue-600 font-medium">Mi perfil</span>
                          </Link>
                          <Link
                            href="/profile/historial-compras"
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <span className="text-blue-600">🛍️</span>
                            <span className="text-sm text-blue-600 font-medium">
                              Mis compras
                            </span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full mt-2 px-4 py-2.5 bg-[#ef233c] hover:bg-red-700 text-white font-medium text-center transition-colors text-sm cursor-pointer active:scale-95"
                          >
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Link
                  href="/cart"
                  className="flex items-center justify-center hover:bg-[#2416c9] transition-colors relative cursor-pointer p-2 ml-2 lg:ml-4"
                >
                  <ShoppingCart className="w-9 h-9 lg:w-11 lg:h-11 text-white" />
                  {hasHydrated && itemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md">
                      {itemsCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <div className="md:hidden px-0 pt-0.5">
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
                  className="w-full px-4 py-3 pr-14 border border-gray-300 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-700 placeholder-gray-400 text-sm shadow-sm"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-800 text-white rounded-full active:scale-95 transition"
                  aria-label="Buscar"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="h-43 sm:h-36 md:h-28 lg:h-32"></div>

      <MenuSidebar
        isOpen={showMenuSidebar}
        onClose={() => setShowMenuSidebar(false)}
      />

      <Modal isOpen={openAuthModal} onClose={() => setOpenAuthModal(false)}>
        {isRecovery ? (
          <RecoveryPasswordModal
            onSwitchLogin={() => {
              setIsRecovery(false);
              setIsRegister(false);
            }}
            onClose={() => setOpenAuthModal(false)}
          />
        ) : isRegister ? (
          <RegisterModal
            onSwitchLogin={() => {
              setIsRegister(false);
              setIsRecovery(false);
            }}
            onSwitchRecovery={() => {
              setIsRecovery(true);
              setIsRegister(false);
            }}
            onClose={() => setOpenAuthModal(false)}
          />
        ) : (
          <LoginModal
            onSwitchRegister={() => {
              setIsRegister(true);
              setIsRecovery(false);
            }}
            onSwitchRecovery={() => {
              setIsRecovery(true);
              setIsRegister(false);
            }}
            onClose={() => setOpenAuthModal(false)}
          />
        )}
      </Modal>
    </>
  );
}