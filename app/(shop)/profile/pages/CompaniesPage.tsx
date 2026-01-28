// app/profile/pages/CompaniesPage.tsx
"use client";

import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Toast, ToastType } from '@/components/toast';
import CompanyCard from '../components/Company/CompanyCard';
import CompanyFormModal from '../components/Company/CompanyFormModal';
import companiesData from '@/data/companies-mock-data.json';
import { Company } from '@/interfaces/Invoice';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(companiesData.companies);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleDeleteClick = (company: Company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      const deletedName = companyToDelete.razonSocial;
      setCompanies(companies.filter(comp => comp.id !== companyToDelete.id));
      setShowDeleteModal(false);
      setCompanyToDelete(null);
      setToast({
        message: `"${deletedName}" ha sido eliminada`,
        type: 'success'
      });
    }
  };

  const handleEditClick = (company: Company) => {
    setCompanyToEdit(company);
    setShowFormModal(true);
  };

  const handleAddClick = () => {
    setCompanyToEdit(null);
    setShowFormModal(true);
  };

  const handleSaveCompany = (companyData: Omit<Company, 'id' | 'createdAt' | 'verifiedAt'>) => {
    if (companyToEdit) {
      // Editar empresa existente
      setCompanies(companies.map(comp =>
        comp.id === companyToEdit.id
          ? {
              ...comp,
              ...companyData,
              verifiedAt: new Date().toISOString(),
            }
          : companyData.isDefault && comp.isDefault
            ? { ...comp, isDefault: false }
            : comp
      ));
      setToast({
        message: `"${companyData.razonSocial}" ha sido actualizada`,
        type: 'success'
      });
    } else {
      // Agregar nueva empresa
      const newId = `company-${String(companies.length + 1).padStart(3, '0')}`;
      const updatedCompanies = companyData.isDefault
        ? companies.map(comp => ({ ...comp, isDefault: false }))
        : companies;

      setCompanies([
        ...updatedCompanies,
        {
          ...companyData,
          id: newId,
          verifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }
      ]);
      setToast({
        message: `"${companyData.razonSocial}" ha sido agregada`,
        type: 'success'
      });
    }

    setShowFormModal(false);
    setCompanyToEdit(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header con botón agregar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-600 mt-1">
              Administra tus empresas para facturación
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            <span>Agregar empresa</span>
          </button>
        </div>

        {/* Lista de empresas */}
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          /* Estado vacío */
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No tienes empresas registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Agrega tu primera empresa para poder solicitar facturas en tus compras
            </p>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              <span>Agregar empresa</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      <CompanyFormModal
        isOpen={showFormModal}
        company={companyToEdit}
        onClose={() => {
          setShowFormModal(false);
          setCompanyToEdit(null);
        }}
        onSave={handleSaveCompany}
      />

      {/* Modal de confirmación de eliminación */}
      {companyToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="¿Eliminar empresa?"
          message={`¿Estás seguro que deseas eliminar "${companyToDelete.razonSocial}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          confirmVariant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setCompanyToDelete(null);
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