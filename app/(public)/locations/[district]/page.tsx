// app/(public)/locations/[district]/page.tsx
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { LocationsGrid } from "../components/LocationsGrid";
import locationsData from "@/data/locations.json";
import { LocationsDataJson } from "@/interfaces/location";
import { notFound } from "next/navigation";

interface DistrictPageProps {
  params: Promise<{
    district: string;
  }>;
}

// Mapeo de slugs a nombres de distritos
const districtMap: Record<string, string> = {
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
  const districtLocations = data.locations.filter(
    (location) => location.district === districtName
  );

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
            <Link 
              href="/locations" 
              className="hover:text-[#2c1ff1] transition-colors"
            >
              Tiendas
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{districtName}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#2c1ff1] to-[#5648f5] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Tiendas en {districtName}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Tenemos {districtLocations.length} tienda{districtLocations.length !== 1 ? 's' : ''} en {districtName} esperándote con los mejores productos y atención.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <LocationsGrid 
          locations={data.locations} 
          districts={data.districts}
          initialDistrict={districtName}
        />
      </div>
    </div>
  );
}
