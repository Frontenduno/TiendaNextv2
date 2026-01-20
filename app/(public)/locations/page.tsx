// app/(public)/locations/page.tsx
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { LocationsGrid } from "@/components/location/LocationsGrid";
import locationsData from "@/data/locations.json";
import { LocationsDataJson } from "@/interfaces/location";

export const metadata = {
  title: "Nuestras Tiendas | JYP",
  description: "Encuentra la tienda JYP más cercana a ti. Conoce nuestras ubicaciones, horarios de atención y direcciones.",
};

export default function LocationsPage() {
  const data = locationsData as LocationsDataJson;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link 
              href="/" 
              className="flex items-center gap-1 hover:text-[#2c1ff1] transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">Tiendas</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#2c1ff1] to-[#5648f5] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Nuestras Tiendas
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Encuentra la tienda más cercana a ti. Estamos ubicados en los principales 
            distritos de Lima para estar siempre cerca de ti.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <LocationsGrid 
          locations={data.locations} 
          districts={data.districts}
        />
      </div>
    </div>
  );
}
