// app/(public)/locations/components/DistrictFilter.tsx
"use client";

import Link from "next/link";

interface DistrictFilterProps {
  districts: string[];
  selectedDistrict: string;
}

// Mapeo de nombres de distritos a slugs para URLs
const districtSlugMap: Record<string, string> = {
  "Todos": "todos",
  "Lima Centro": "lima-centro",
  "Miraflores": "miraflores",
  "San Isidro": "san-isidro",
  "Surco": "surco",
};

export function DistrictFilter({ 
  districts, 
  selectedDistrict, 
}: DistrictFilterProps) {
  const getDistrictUrl = (district: string) => {
    const slug = districtSlugMap[district] || district.toLowerCase().replace(/\s+/g, '-');
    return `/locations/${slug}`;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {districts.map((district) => (
          <Link
            key={district}
            href={getDistrictUrl(district)}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedDistrict === district
                ? "bg-[#2c1ff1] text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-[#2c1ff1] hover:text-[#2c1ff1]"
            }`}
          >
            {district}
          </Link>
        ))}
      </div>
      
      {/* Scroll indicators */}
      <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none md:hidden" />
    </div>
  );
}