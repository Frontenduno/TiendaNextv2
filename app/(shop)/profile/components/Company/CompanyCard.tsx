// app/profile/components/Company/CompanyCard.tsx
"use client";

import React from 'react';
import { Building2, Edit2, Trash2, Star } from 'lucide-react';
import { Company } from '@/interfaces/Invoice';

interface Props {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export default function CompanyCard({ company, onEdit, onDelete }: Props) {
  return (
    <div className={`bg-white rounded-lg border-2 ${
      company.isDefault ? 'border-blue-500' : 'border-gray-200'
    } overflow-hidden hover:shadow-md transition-all`}>
      {/* Header */}
      <div className={`px-4 sm:px-6 py-3 ${
        company.isDefault ? 'bg-blue-50 border-b border-blue-200' : 'bg-gray-50 border-b border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className={`w-5 h-5 ${company.isDefault ? 'text-blue-600' : 'text-gray-600'}`} />
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              {company.razonSocial}
            </h3>
          </div>
          {company.isDefault && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
              <Star size={12} fill="currentColor" />
              <span className="hidden sm:inline">Predeterminada</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 sm:p-6">
        <div className="space-y-3">
          {/* RUC */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">RUC</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900">{company.ruc}</p>
          </div>

          {/* Dirección Fiscal */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Dirección Fiscal
            </p>
            <p className="text-sm sm:text-base text-gray-700">{company.direccionFiscal}</p>
          </div>

          {/* Verificada */}
          {company.verifiedAt && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Verificada el {new Date(company.verifiedAt).toLocaleDateString('es-PE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onEdit(company)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={16} />
            <span className="hidden sm:inline">Editar</span>
          </button>
          <button
            onClick={() => onDelete(company)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
}