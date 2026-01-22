// app/(public)/locations/components/LocationCard.tsx
"use client";

import Image from "next/image";
import { MapPin, Clock, Phone } from "lucide-react";
import { Location } from "@/interfaces/footer/location/location";

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
        <Image
          src={location.image}
          alt={location.name}
          width={200}
          height={150}
          className="object-contain p-4"
        />
        <div className="absolute top-2 right-2 bg-[#2c1ff1] text-white text-xs px-2 py-1 rounded-full">
          {location.district}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {location.name}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#2c1ff1]" />
            <span className="line-clamp-2">{location.address}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 shrink-0 mt-0.5 text-[#2c1ff1]" />
            <div>
              <span className="font-semibold text-gray-800">Horario de Atención: </span>
              <span>{location.schedule}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0 text-[#2c1ff1]" />
            <a 
              href={`tel:${location.phone}`} 
              className="hover:text-[#2c1ff1] transition-colors"
            >
              {location.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
