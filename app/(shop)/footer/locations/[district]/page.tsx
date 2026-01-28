// app/(public)/locations/[district]/page.tsx
import React from "react";
import { LocationsGrid } from "../components/LocationsGrid";
import locationsData from "@/data/footer/premises/premises.json";
import { LocationsDataJson } from "@/interfaces/footer/premises/premises";
import { notFound } from "next/navigation";
import { HeroBanner } from "@/components/shared/HeroBanner";

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
        <HeroBanner
          title={districtName === "Todos" ? "Nuestras Tiendas" : `Tiendas en ${districtName}`}
          subtitle={districtName === "Todos" 
            ? "Encuentra la tienda más cercana a ti. Estamos ubicados en los principales distritos de Lima para estar siempre cerca de ti."
            : `Tenemos ${districtLocations.length} tienda${districtLocations.length !== 1 ? 's' : ''} en ${districtName} esperándote con los mejores productos y atención.`
          }
          gradient="from-blue-600 to-blue-800"
          padding="p-8 sm:p-12 mb-8"
          titleClassName="text-3xl sm:text-4xl mb-4"
          subtitleClassName="text-lg sm:text-xl"
        />
        
        <LocationsGrid 
          locations={data.locations} 
          districts={data.districts}
          initialDistrict={districtName}
        />
      </div>
    </div>
  );
}