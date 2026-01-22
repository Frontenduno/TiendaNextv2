// app/(public)/locations/[district]/page.tsx
import React from "react";
import { LocationsGrid } from "../components/LocationsGrid";
import locationsData from "@/data/footer/location/locations.json";
import { LocationsDataJson } from "@/interfaces/footer/location/location";
import { notFound } from "next/navigation";

interface DistrictPageProps {
  params: Promise<{
    district: string;
  }>;
}

// Mapeo de slugs a nombres de distritos
const districtMap: Record<string, string> = {
  "todos": "Todos",
  "lima-centro": "Lima Centro",
  "miraflores": "Miraflores",
  "san-isidro": "San Isidro",
  "surco": "Surco",
};

export async function generateStaticParams() {
  return Object.keys(districtMap).map((district) => ({
    district,
  }));
}

export async function generateMetadata({ params }: DistrictPageProps) {
  const { district } = await params;
  const districtName = districtMap[district];
  
  if (!districtName) {
    return {
      title: "Distrito no encontrado | JYP",
    };
  }

  if (districtName === "Todos") {
    return {
      title: "Nuestras Tiendas | JYP",
      description: "Encuentra la tienda JYP más cercana a ti. Conoce nuestras ubicaciones, horarios de atención y direcciones.",
    };
  }

  return {
    title: `Tiendas en ${districtName} | JYP`,
    description: `Encuentra las tiendas JYP en ${districtName}. Conoce ubicaciones, horarios de atención y direcciones.`,
  };
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const { district } = await params;
  const districtName = districtMap[district];
  
  if (!districtName) {
    notFound();
  }

  const data = locationsData as LocationsDataJson;
  const districtLocations = districtName === "Todos" 
    ? data.locations 
    : data.locations.filter((location) => location.district === districtName);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 sm:p-12 mb-8 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {districtName === "Todos" ? "Nuestras Tiendas" : `Tiendas en ${districtName}`}
          </h1>
          <p className="text-lg sm:text-xl">
            {districtName === "Todos" 
              ? "Encuentra la tienda más cercana a ti. Estamos ubicados en los principales distritos de Lima para estar siempre cerca de ti."
              : `Tenemos ${districtLocations.length} tienda${districtLocations.length !== 1 ? 's' : ''} en ${districtName} esperándote con los mejores productos y atención.`
            }
          </p>
        </div>        <LocationsGrid 
          locations={data.locations} 
          districts={data.districts}
          initialDistrict={districtName}
        />
      </div>
    </div>
  );
}