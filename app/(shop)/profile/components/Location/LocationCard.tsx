// app/profile/components/LocationCard.tsx
"use client";

import React from 'react';
import { MapPin, Edit2, Trash2, Check } from 'lucide-react';
import { Ubicacion } from '@/interfaces/locations';

interface Props {
  location: Ubicacion;
  onEdit: (location: Ubicacion) => void;
  onDelete: (location: Ubicacion) => void;
}

export default function LocationCard({ location, onEdit, onDelete }: Props) {
  return (
    <div
      className={`bg-white rounded-lg border-2 p-6 hover:shadow-md transition-shadow ${
        location.esPrincipal ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-gray-900 text-lg">
              {location.alias}
            </h3>
            {location.esPrincipal && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded flex items-center gap-1">
                <Check size={12} />
                Principal
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">
                  {location.direccion}
                </p>
                <p className="text-sm text-gray-600">
                  {location.distrito}, {location.ciudad}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {location.referencia}
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{location.nombreContacto}</span>
                <span className="mx-2">•</span>
                {location.telefono}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(location)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar ubicación"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(location)}
            disabled={location.esPrincipal}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={location.esPrincipal ? "No puedes eliminar la ubicación principal" : "Eliminar ubicación"}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}