// app/profile/components/LocationFormModal.tsx
"use client";

import React from 'react';
import { X, MapPin, User, Phone, FileText } from 'lucide-react';
import { Ubicacion } from '@/interfaces/locations';
import { LocationFormData } from '@/utils/validations/schemas';
import { filterInput, filterPaste } from '@/utils/inputFilters';
import { useLocationForm } from './hooks/useLocationForm';

interface Props {
  isOpen: boolean;
  location?: Ubicacion | null;
  onClose: () => void;
  onSave: (location: Omit<Ubicacion, 'id'>) => void;
}

export default function LocationFormModal({ isOpen, location, onClose, onSave }: Props) {
  const {
    formMethods,
    ubigeoData,
    selectedDepartment,
    selectedProvince,
    filteredProvinces,
    filteredDistricts,
    setSelectedProvince,
    handleDepartmentChange,
    handleDistrictChange,
    resetForm,
  } = useLocationForm(location, isOpen);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods;

  const onSubmit = (data: LocationFormData) => {
    onSave(data);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {location ? 'Editar ubicación' : 'Nueva ubicación'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {location ? 'Modifica tu dirección' : 'Agrega una dirección'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            type="button"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">
            {/* Alias */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Nombre de ubicación <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  {...register('alias')}
                  placeholder="Mi casa, Oficina, Casa de mamá"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all bg-white text-gray-900 placeholder:text-gray-400 ${
                    errors.alias
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.alias && (
                <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.alias.message}</p>
              )}
            </div>

            {/* Departamento, Provincia y Distrito */}
            <div className="space-y-3">
              {/* Departamento */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all bg-white text-gray-900 border-gray-200 focus:border-blue-500"
                >
                  <option value="">Selecciona un departamento</option>
                  {ubigeoData?.departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Provincia */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Provincia <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  disabled={!selectedDepartment}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all bg-white text-gray-900 border-gray-200 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona una provincia</option>
                  {filteredProvinces.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distrito */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Distrito <span className="text-red-500">*</span>
                </label>
                <select
                  onChange={handleDistrictChange}
                  disabled={!selectedProvince}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.distrito
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                >
                  <option value="">Selecciona un distrito</option>
                  {filteredDistricts.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                </select>
                <input type="hidden" {...register('distrito')} />
                {errors.distrito && (
                  <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.distrito.message}</p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Dirección completa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  {...register('direccion')}
                  placeholder="Av. Arequipa 1234"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all bg-white text-gray-900 placeholder:text-gray-400 ${
                    errors.direccion
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.direccion && (
                <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.direccion.message}</p>
              )}
            </div>

            {/* Ciudad (readonly, se establece automáticamente) */}
            <input type="hidden" {...register('ciudad')} />

            {/* Referencia */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Referencia <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('referencia')}
                placeholder="Casa blanca, frente al parque"
                rows={3}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 resize-none transition-all bg-white text-gray-900 placeholder:text-gray-400 ${
                  errors.referencia
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.referencia && (
                <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.referencia.message}</p>
              )}
            </div>

            {/* Nombre de contacto */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Nombre de contacto <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  {...register('nombreContacto')}
                  onKeyDown={(e) => filterInput(e, "letters", 100)}
                  onPaste={(e) => filterPaste(e, "letters", 100)}
                  maxLength={100}
                  placeholder="Nombre completo"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all bg-white text-gray-900 placeholder:text-gray-400 ${
                    errors.nombreContacto
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.nombreContacto && (
                <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.nombreContacto.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  {...register('telefono')}
                  onKeyDown={(e) => filterInput(e, "numbers", 9)}
                  onPaste={(e) => filterPaste(e, "numbers", 9)}
                  maxLength={9}
                  placeholder="987654321"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all bg-white text-gray-900 placeholder:text-gray-400 ${
                    errors.telefono
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.telefono && (
                <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.telefono.message}</p>
              )}
            </div>

            {/* Establecer como principal */}
            {!location?.esPrincipal && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <input
                  type="checkbox"
                  id="esPrincipal"
                  {...register('esPrincipal')}
                  className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
                />
                <label htmlFor="esPrincipal" className="text-sm text-gray-700 cursor-pointer flex-1">
                  Establecer como dirección principal
                </label>
              </div>
            )}
          </div>

          {/* Footer - Fixed en móvil */}
          <div className="p-5 border-t border-gray-100 bg-white flex-shrink-0 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? 'Guardando...' : location ? 'Guardar cambios' : 'Agregar ubicación'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}