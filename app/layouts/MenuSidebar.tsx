"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, X, Package, ChevronLeft } from "lucide-react";
import categoriesData from "@/data/categories.json";
import { Categoria } from "@/interfaces/category";

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type NavigationLevel = {
  type: "main" | "subcategory" | "element";
  category?: Categoria;
  parentCategory?: Categoria;
};

export default function MenuSidebar({ isOpen, onClose }: MenuSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<Categoria | null>(null);
  const [navigationStack, setNavigationStack] = useState<NavigationLevel[]>([
    { type: "main" },
  ]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentLevel = navigationStack[navigationStack.length - 1];

  const handleCategoryClick = (categoria: Categoria) => {
    if (isMobile) {
      // En móvil, navegar al siguiente nivel
      if (categoria.subcategorias && categoria.subcategorias.length > 0) {
        setNavigationStack([
          ...navigationStack,
          {
            type: "subcategory",
            category: categoria,
          },
        ]);
      }
    } else {
      // En desktop, mostrar hover
      setActiveCategory(categoria);
    }
  };

  const handleSubcategoryClick = (
    subcategoria: Categoria,
    parent: Categoria
  ) => {
    if (isMobile) {
      if (subcategoria.subcategorias && subcategoria.subcategorias.length > 0) {
        setNavigationStack([
          ...navigationStack,
          {
            type: "element",
            category: subcategoria,
            parentCategory: parent,
          },
        ]);
      }
    }
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(navigationStack.slice(0, -1));
    }
  };

  const handleClose = () => {
    setNavigationStack([{ type: "main" }]);
    onClose();
  };

  const renderMobileContent = () => {
    if (currentLevel.type === "main") {
      // Nivel 1: Categorías principales
      return (
        <>
          <div className="px-6 py-4 bg-gradient-to-r from-[#2c1ff1] to-[#4c3ff3]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Categorías</h2>
                <p className="text-sm text-white/90">Explora productos</p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X />
              </button>
            </div>
          </div>

          <div className="p-3 overflow-y-auto h-[calc(100vh-76px)]">
            {categoriesData.categorias.map((categoria) => (
              <div key={categoria.idCategoria}>
                <button
                  onClick={() => handleCategoryClick(categoria)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2c1ff1] to-[#4c3ff3] flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      {categoria.nombre}
                    </span>
                  </div>

                  {categoria.subcategorias &&
                    categoria.subcategorias.length > 0 && (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (currentLevel.type === "subcategory" && currentLevel.category) {
      // Nivel 2: Subcategorías
      return (
        <>
          <div className="px-6 py-4 bg-gradient-to-r from-[#2c1ff1] to-[#4c3ff3]">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft />
              </button>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  {currentLevel.category.nombre}
                </h2>
                <p className="text-sm text-white/90">
                  Selecciona una subcategoría
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X />
              </button>
            </div>
          </div>

          <div className="p-3 overflow-y-auto h-[calc(100vh-76px)]">
            {currentLevel.category.subcategorias?.map((subcategoria) => (
              <div key={subcategoria.idCategoria}>
                <button
                  onClick={() =>
                    handleSubcategoryClick(subcategoria, currentLevel.category!)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    {subcategoria.nombre}
                  </span>

                  {subcategoria.subcategorias &&
                    subcategoria.subcategorias.length > 0 && (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (currentLevel.type === "element" && currentLevel.category) {
      // Nivel 3: Elementos finales
      return (
        <>
          <div className="px-6 py-4 bg-gradient-to-r from-[#2c1ff1] to-[#4c3ff3]">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft />
              </button>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  {currentLevel.category.nombre}
                </h2>
                <p className="text-sm text-white/90">Selecciona un producto</p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X />
              </button>
            </div>
          </div>

          <div className="p-3 overflow-y-auto h-[calc(100vh-76px)]">
            {currentLevel.category.subcategorias?.map((elemento) => (
              <div key={elemento.idCategoria}>
                <Link
                  href={`/categoria/${elemento.nombre
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                  className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                  onClick={handleClose}
                >
                  <span className="text-gray-800">{elemento.nombre}</span>
                </Link>
              </div>
            ))}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}

      {/* Mobile Menu */}
      {isMobile ? (
        <aside
          className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 z-50 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderMobileContent()}
        </aside>
      ) : (
        /* Desktop Menu */
        <div
          className="fixed top-0 left-0 h-full z-50"
          onMouseLeave={() => setActiveCategory(null)}
        >
          {/* Sidebar nivel 1 */}
          <aside
            className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="px-6 py-6 bg-gradient-to-r from-[#2c1ff1] to-[#4c3ff3]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Categorías</h2>
                  <p className="text-sm text-white/90">Explora productos</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* Categorías principales - MODIFICADO AQUÍ */}
            <div className="p-3 overflow-y-auto h-[calc(100vh-88px)]">
              {categoriesData.categorias.map((categoria) => (
                <div
                  key={categoria.idCategoria}
                  onMouseEnter={() => setActiveCategory(categoria)}
                >
                  {/* Se reemplazó Link por div y se eliminó href y onClick */}
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2c1ff1] to-[#4c3ff3] flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-800">
                        {categoria.nombre}
                      </span>
                    </div>

                    {categoria.subcategorias &&
                      categoria.subcategorias.length > 0 && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* MEGA PANEL Desktop */}
          {activeCategory &&
            activeCategory.subcategorias &&
            activeCategory.subcategorias.length > 0 && (
              <div className="absolute top-0 left-[280px] h-full w-auto min-w-[600px] max-w-[calc(100vw-320px)] bg-white shadow-2xl">
                <div className="px-8 bg-gradient-to-r from-[#4c3ff3] to-[#5c4ff5] h-[88px] flex items-center">
                  <h3 className="text-white text-2xl font-bold">
                    {activeCategory.nombre}
                  </h3>
                </div>

                <div className="p-8 overflow-y-auto h-[calc(100%-88px)]">
                  <div
                    className="grid gap-x-12 gap-y-8 items-start"
                    style={{
                      gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
                      maxWidth: "100%",
                    }}
                  >
                    {activeCategory.subcategorias.map((subcat) => (
                      <div key={subcat.idCategoria} className="space-y-3">
                        <Link
                          href={`/categoria/${subcat.nombre
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                          className="block font-bold text-gray-900 text-base hover:text-[#2c1ff1] transition-colors mb-4"
                          onClick={handleClose}
                        >
                          {subcat.nombre}
                        </Link>

                        {subcat.subcategorias &&
                          subcat.subcategorias.length > 0 && (
                            <ul className="space-y-2.5">
                              {subcat.subcategorias.map((item) => (
                                <li key={item.idCategoria}>
                                  <Link
                                    href={`/categoria/${item.nombre
                                      .toLowerCase()
                                      .replace(/ /g, "-")}`}
                                    className="text-sm text-gray-600 hover:text-[#2c1ff1] transition-colors block"
                                    onClick={handleClose}
                                  >
                                    {item.nombre}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      )}
    </>
  );
}
