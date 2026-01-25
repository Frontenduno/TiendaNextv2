// components/cart/StoreSelector.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Store, MapPin, Clock, Phone, Search, ChevronDown } from 'lucide-react';
import { Location } from '@/interfaces/footer/premises/premises';

interface StoreSelectorProps {
  selectedStoreId: number | null;
  onStoreSelect: (id: number) => void;
}

export const StoreSelector: React.FC<StoreSelectorProps> = ({
  selectedStoreId,
  onStoreSelect,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [districts, setDistricts] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del JSON
  useEffect(() => {
    const loadStores = async () => {
      try {
        const data = await import('@/data/footer/premises/premises.json');
        setDistricts(data.districts || []);
        setLocations(data.locations || []);
      } catch (error) {
        console.error('Error loading stores:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStores();
  }, []);

  // Filtrar tiendas por distrito y búsqueda
  const filteredStores = useMemo(() => {
    let filtered = locations;

    if (selectedDistrict !== 'Todos') {
      filtered = filtered.filter(store => store.district === selectedDistrict);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(query) ||
        store.district.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedDistrict, searchQuery, locations]);

  const selectedStore = locations.find(store => store.id === selectedStoreId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Selecciona una tienda</h2>

        {/* Tienda seleccionada */}
        {selectedStore && (
          <div className="mb-4 p-4 border-2 border-blue-600 rounded-lg bg-blue-50">
            <div className="flex items-start gap-3">
              <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={selectedStore.image}
                  alt={selectedStore.name}
                  fill
                  className="object-contain p-1"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">{selectedStore.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-start gap-1.5 text-gray-700">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{selectedStore.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{selectedStore.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{selectedStore.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros - TEXTOS NEGROS CORREGIDOS */}
        <div className="space-y-3 mb-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tienda..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Selector de distrito */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer text-gray-900 font-medium"
            >
              {districts.map((district) => (
                <option key={district} value={district} className="text-gray-900">
                  {district}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Contador de resultados */}
        <p className="text-sm text-gray-600 mb-3">
          {filteredStores.length} {filteredStores.length === 1 ? 'tienda disponible' : 'tiendas disponibles'}
        </p>

        {/* Lista de tiendas */}
        <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
          {filteredStores.length === 0 ? (
            <div className="text-center py-8">
              <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No se encontraron tiendas</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDistrict('Todos');
                }}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            filteredStores.map((store) => {
              const isSelected = store.id === selectedStoreId;
              
              return (
                <button
                  key={store.id}
                  onClick={() => onStoreSelect(store.id)}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all
                    ${isSelected 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={store.image}
                        alt={store.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {store.name}
                        </h3>
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${isSelected ? 'border-blue-600' : 'border-gray-300'}
                        `}>
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          )}
                        </div>
                      </div>

                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mb-2 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {store.district}
                      </span>

                      <div className="space-y-1 text-sm">
                        <div className={`flex items-start gap-1.5 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{store.address}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{store.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};