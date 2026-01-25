// app/profile/pages/LocationsPage.tsx
"use client";

import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Toast, ToastType } from '@/components/toast';
import LocationCard from '../components/Location/LocationCard';
import LocationFormModal from '../components/Location/LocationFormModal';
import locationsData from '@/data/locations.json';
import { LocationsData, Ubicacion } from '@/interfaces/locations';

export default function LocationsPage() {
  const data = locationsData as LocationsData;
  const [locations, setLocations] = useState<Ubicacion[]>(data.ubicaciones);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Ubicacion | null>(null);
  const [locationToEdit, setLocationToEdit] = useState<Ubicacion | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleDeleteClick = (location: Ubicacion) => {
    setLocationToDelete(location);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (locationToDelete) {
      const deletedName = locationToDelete.alias;
      setLocations(locations.filter(loc => loc.id !== locationToDelete.id));
      setShowDeleteModal(false);
      setLocationToDelete(null);
      setToast({
        message: `"${deletedName}" ha sido eliminada`,
        type: 'success'
      });
    }
  };

  const handleEditClick = (location: Ubicacion) => {
    setLocationToEdit(location);
    setShowFormModal(true);
  };

  const handleAddClick = () => {
    setLocationToEdit(null);
    setShowFormModal(true);
  };

  const handleSaveLocation = (locationData: Omit<Ubicacion, 'id'>) => {
    if (locationToEdit) {
      // Editar ubicación existente
      setLocations(locations.map(loc => 
        loc.id === locationToEdit.id 
          ? { ...locationData, id: locationToEdit.id } 
          : locationData.esPrincipal && loc.esPrincipal 
            ? { ...loc, esPrincipal: false }
            : loc
      ));
      setToast({
        message: `"${locationData.alias}" ha sido actualizada`,
        type: 'success'
      });
    } else {
      // Agregar nueva ubicación
      const newId = Math.max(...locations.map(l => l.id), 0) + 1;
      const updatedLocations = locationData.esPrincipal
        ? locations.map(loc => ({ ...loc, esPrincipal: false }))
        : locations;
      
      setLocations([...updatedLocations, { ...locationData, id: newId }]);
      setToast({
        message: `"${locationData.alias}" ha sido agregada`,
        type: 'success'
      });
    }
    
    setShowFormModal(false);
    setLocationToEdit(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header con botón agregar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-600 mt-1">
              Administra tus direcciones de entrega
            </p>
          </div>
          <button 
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            <span>Agregar ubicación</span>
          </button>
        </div>

        {/* Lista de ubicaciones */}
        {locations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          /* Estado vacío */
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No tienes ubicaciones guardadas
            </h3>
            <p className="text-gray-600 mb-6">
              Agrega tu primera dirección de entrega para tus pedidos
            </p>
            <button 
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              <span>Agregar ubicación</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      <LocationFormModal
        isOpen={showFormModal}
        location={locationToEdit}
        onClose={() => {
          setShowFormModal(false);
          setLocationToEdit(null);
        }}
        onSave={handleSaveLocation}
      />

      {/* Modal de confirmación de eliminación */}
      {locationToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="¿Eliminar ubicación?"
          message={`¿Estás seguro que deseas eliminar "${locationToDelete.alias}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          confirmVariant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setLocationToDelete(null);
          }}
        />
      )}

      {/* Toast de notificación */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}