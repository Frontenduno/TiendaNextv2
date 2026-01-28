// app/profile/components/Company/CompanyFormModal.tsx
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Building2, AlertCircle, Star } from 'lucide-react';
import { Company, InvoiceData } from '@/interfaces/Invoice';
import { invoiceDataSchema } from '@/utils/validations/schemas';

interface Props {
  isOpen: boolean;
  company: Company | null;
  onClose: () => void;
  onSave: (companyData: Omit<Company, 'id' | 'createdAt' | 'verifiedAt'>) => void;
}

type FormData = InvoiceData & { isDefault: boolean };

export default function CompanyFormModal({ isOpen, company, onClose, onSave }: Props) {
  const isEditing = !!company;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(
      invoiceDataSchema.extend({
        isDefault: z.boolean(),
      })
    ),
    mode: 'onChange',
    defaultValues: {
      ruc: '',
      razonSocial: '',
      direccionFiscal: '',
      isDefault: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (company) {
        reset({
          ruc: company.ruc,
          razonSocial: company.razonSocial,
          direccionFiscal: company.direccionFiscal,
          isDefault: company.isDefault,
        });
      } else {
        reset({
          ruc: '',
          razonSocial: '',
          direccionFiscal: '',
          isDefault: false,
        });
      }
    }
  }, [isOpen, company, reset]);

  const onSubmit = (data: FormData) => {
    onSave({
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      direccionFiscal: data.direccionFiscal,
      isDefault: data.isDefault,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Empresa' : 'Agregar Empresa'}
              </h2>
              <p className="text-sm text-gray-600">
                {isEditing ? 'Actualiza los datos de tu empresa' : 'Registra una nueva empresa para facturación'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* RUC */}
            <div>
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                RUC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('ruc')}
                placeholder="20123456789"
                maxLength={11}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 font-medium outline-none transition-all ${
                  errors.ruc
                    ? 'border-red-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {errors.ruc && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.ruc.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Ingresa el RUC de 11 dígitos de tu empresa
              </p>
            </div>

            {/* Razón Social */}
            <div>
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('razonSocial')}
                placeholder="EMPRESA SAC"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 font-medium outline-none transition-all ${
                  errors.razonSocial
                    ? 'border-red-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {errors.razonSocial && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.razonSocial.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Nombre o razón social registrado en SUNAT
              </p>
            </div>

            {/* Dirección Fiscal */}
            <div>
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                Dirección Fiscal <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('direccionFiscal')}
                placeholder="Av. Ejemplo 123, Distrito, Lima"
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 font-medium outline-none transition-all resize-none ${
                  errors.direccionFiscal
                    ? 'border-red-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {errors.direccionFiscal && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.direccionFiscal.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Dirección registrada en SUNAT
              </p>
            </div>

            {/* Empresa Predeterminada */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isDefault')}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={16} className="text-blue-600" />
                    <span className="text-sm font-bold text-gray-900">
                      Establecer como empresa predeterminada
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Esta empresa se seleccionará automáticamente al elegir factura en tus compras
                  </p>
                </div>
              </label>
            </div>

            {/* Nota informativa */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800">
                <strong>Nota:</strong> Los datos deben coincidir exactamente con los registrados en SUNAT.
                Puedes verificarlos en{" "}
                <a
                  href="https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium hover:text-yellow-900"
                >
                  Consulta RUC SUNAT
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isDirty && isEditing}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}