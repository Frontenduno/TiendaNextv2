// components/cart/DeliveryLocationSelector.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, ChevronUp, Plus, Pencil, Trash2 } from 'lucide-react';
import { useLocationsStore } from '@/store/locations/locationsStore';
import { Ubicacion } from '@/interfaces/locations';
import LocationFormModal from '@/(shop)/profile/components/Location/LocationFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Toast } from '@/components/toast';

interface DeliveryLocationSelectorProps {
  selectedLocationId: number | null;
  onLocationSelect: (id: number) => void;
}

export const DeliveryLocationSelector: React.FC<DeliveryLocationSelectorProps> = ({
  selectedLocationId,
  onLocationSelect,
}) => {
  const { 
    locations,
    loadLocations,
    addLocation, 
    updateLocation, 
    deleteLocation, 
    getPrimaryLocation 
  } = useLocationsStore();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Ubicacion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Cargar ubicaciones al montar el componente
  useEffect(() => {
    const loadData = async () => {
      await loadLocations();
      setIsLoading(false);
    };
    loadData();
  }, [loadLocations]);

  // Seleccionar automáticamente la ubicación principal al cargar
  useEffect(() => {
    if (!isLoading && selectedLocationId === null && locations.length > 0) {
      const primaryLocation = getPrimaryLocation();
      if (primaryLocation) {
        onLocationSelect(primaryLocation.id);
      } else {
        onLocationSelect(locations[0].id);
      }
    }
  }, [isLoading, locations, selectedLocationId, onLocationSelect, getPrimaryLocation]);

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
  const otherLocations = locations.filter(loc => loc.id !== selectedLocationId);

  const handleAddLocation = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEditLocation = (location: Ubicacion) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleDeleteLocation = (id: number) => {
    setLocationToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (locationToDelete !== null) {
      const locationName = locations.find(loc => loc.id === locationToDelete)?.alias;
      deleteLocation(locationToDelete);
      setToast({ message: `"${locationName}" ha sido eliminada`, type: 'success' });
      
      // Si eliminamos la seleccionada, seleccionar la primera disponible
      if (locationToDelete === selectedLocationId && locations.length > 1) {
        const remaining = locations.filter(loc => loc.id !== locationToDelete);
        if (remaining.length > 0) {
          onLocationSelect(remaining[0].id);
        }
      }
      
      setShowConfirmDelete(false);
      setLocationToDelete(null);
    }
  };

  const handleSaveLocation = (locationData: Omit<Ubicacion, 'id'>) => {
    if (editingLocation) {
      updateLocation(editingLocation.id, locationData);
      setToast({ message: `"${locationData.alias}" ha sido actualizada`, type: 'success' });
    } else {
      addLocation(locationData);
      setToast({ message: `"${locationData.alias}" ha sido agregada`, type: 'success' });
    }
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Dirección de entrega</h2>
          
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
            <button
              onClick={handleAddLocation}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Agregar dirección
            </button>
          </div>
        </div>

        <LocationFormModal
          isOpen={isModalOpen}
          location={editingLocation}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLocation(null);
          }}
          onSave={handleSaveLocation}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Dirección de entrega</h2>
            <button
              onClick={handleAddLocation}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Nueva
            </button>
          </div>

          {/* Ubicación seleccionada */}
          {selectedLocation && (
            <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedLocation.alias}</h3>
                      {selectedLocation.esPrincipal && (
                        <span className="inline-block px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded mt-1">
                          Principal
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleEditLocation(selectedLocation)}
                      className="text-blue-600 hover:text-blue-700 p-1 flex-shrink-0"
                      aria-label="Editar dirección"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-700 mb-1">
                    {selectedLocation.direccion}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedLocation.distrito}, {selectedLocation.ciudad}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Referencia:</span> {selectedLocation.referencia}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Contacto:</span> {selectedLocation.nombreContacto} • {selectedLocation.telefono}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botón para ver más ubicaciones */}
          {otherLocations.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Ocultar otras direcciones
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Ver más direcciones ({otherLocations.length})
                </>
              )}
            </button>
          )}
        </div>

        {/* Otras ubicaciones expandibles */}
        {isExpanded && otherLocations.length > 0 && (
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 space-y-3">
            {otherLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition cursor-pointer"
                onClick={() => {
                  onLocationSelect(location.id);
                  setToast({ message: `Dirección cambiada a "${location.alias}"`, type: 'success' });
                  setIsExpanded(false);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{location.alias}</h3>
                        {location.esPrincipal && (
                          <span className="inline-block px-2 py-0.5 bg-gray-600 text-white text-xs font-medium rounded mt-1">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLocation(location);
                          }}
                          className="text-gray-400 hover:text-blue-600 p-1"
                          aria-label="Editar dirección"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLocation(location.id);
                          }}
                          className="text-gray-400 hover:text-red-600 p-1"
                          aria-label="Eliminar dirección"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-1">
                      {location.direccion}
                    </p>
                    <p className="text-sm text-gray-600">
                      {location.distrito}, {location.ciudad}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LocationFormModal
        isOpen={isModalOpen}
        location={editingLocation}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLocation(null);
        }}
        onSave={handleSaveLocation}
      />

      <ConfirmModal
        isOpen={showConfirmDelete}
        title="Eliminar dirección"
        message={`¿Estás seguro de que deseas eliminar la dirección "${locations.find(loc => loc.id === locationToDelete)?.alias}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirmDelete(false);
          setLocationToDelete(null);
        }}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};