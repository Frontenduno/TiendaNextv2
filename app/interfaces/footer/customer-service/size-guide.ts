// Tipos de género disponibles
export type GenderType = "hombre" | "mujer" | "unisex" | "nino" | "nina";

// Interface para las pestañas de género
export interface GenderTab {
  id: GenderType;
  label: string;
  icon: string;
}

// Interface para subcategorías (ej: accesorios)
export interface SizeSubCategory {
  name: string;
  sizes: Record<string, string>[];
  headers: string[];
}

// Interface para categorías de tallas
export interface SizeCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  sizes?: Record<string, string>[];
  headers?: string[];
  subCategories?: SizeSubCategory[];
}

// Interface para datos de género
export interface GenderSizeData {
  categories: SizeCategory[];
}

// Interface para tips de medición
export interface MeasurementTip {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Interface principal del JSON
export interface SizeGuideData {
  genderTabs: GenderTab[];
  sizeData: Record<GenderType, GenderSizeData>;
  measurementTips: MeasurementTip[];
}

// Colores por género para UI
export interface GenderColorConfig {
  gradient: string;
  bg: string;
  text: string;
  light: string;
  activeTab: string;
  inactiveTab: string;
}

export const genderColorMap: Record<GenderType, GenderColorConfig> = {
  hombre: {
    gradient: "bg-linear-to-br from-blue-600 via-blue-700 to-blue-800",
    bg: "bg-blue-500",
    text: "text-blue-600",
    light: "bg-blue-50",
    activeTab: "bg-blue-600 text-white",
    inactiveTab: "bg-gray-100 text-gray-700 hover:bg-blue-50",
  },
  mujer: {
    gradient: "bg-linear-to-br from-pink-500 via-pink-600 to-pink-700",
    bg: "bg-pink-500",
    text: "text-pink-600",
    light: "bg-pink-50",
    activeTab: "bg-pink-500 text-white",
    inactiveTab: "bg-gray-100 text-gray-700 hover:bg-pink-50",
  },
  unisex: {
    gradient: "bg-linear-to-br from-purple-600 via-purple-700 to-purple-800",
    bg: "bg-purple-600",
    text: "text-purple-600",
    light: "bg-purple-50",
    activeTab: "bg-purple-600 text-white",
    inactiveTab: "bg-gray-100 text-gray-700 hover:bg-purple-50",
  },
  nino: {
    gradient: "bg-linear-to-br from-green-500 via-green-600 to-green-700",
    bg: "bg-green-500",
    text: "text-green-600",
    light: "bg-green-50",
    activeTab: "bg-green-600 text-white",
    inactiveTab: "bg-gray-100 text-gray-700 hover:bg-green-50",
  },
  nina: {
    gradient: "bg-linear-to-br from-rose-400 via-rose-500 to-rose-600",
    bg: "bg-rose-500",
    text: "text-rose-600",
    light: "bg-rose-50",
    activeTab: "bg-rose-500 text-white",
    inactiveTab: "bg-gray-100 text-gray-700 hover:bg-rose-50",
  },
};
