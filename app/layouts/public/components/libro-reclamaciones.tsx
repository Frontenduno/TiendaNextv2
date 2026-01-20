// layouts/public/components/libro-reclamaciones.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, Send, CheckCircle } from "lucide-react";
import {
  validateLibroReclamaciones,
  LibroReclamacionesFormData,
  DocumentType,
} from "@/utils/libroReclamacionesSchema";

interface LibroReclamacionesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LibroReclamaciones({ isOpen, onClose }: LibroReclamacionesProps) {
  const [formData, setFormData] = useState<LibroReclamacionesFormData>({
    documentType: "dni",
    documentNumber: "",
    fullName: "",
    phone: "",
    email: "",
    complaintDetail: "",
    expectedSolution: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LibroReclamacionesFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const documentTypeOptions = [
    { value: "dni", label: "DNI" },
    { value: "carnet_extranjeria", label: "Carnet de Extranjería" },
    { value: "pasaporte", label: "Pasaporte" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      documentType: "dni",
      documentNumber: "",
      fullName: "",
      phone: "",
      email: "",
      complaintDetail: "",
      expectedSolution: "",
    });
    setErrors({});
    setShowSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const { success, errors: validationErrors } = validateLibroReclamaciones(formData);
    setErrors(validationErrors);
    return success;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof LibroReclamacionesFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4 animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-[#2c1ff1] to-[#5648f5] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Libro de Reclamaciones</h2>
              <p className="text-sm text-white/80">Conforme a la Ley N° 29571</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {showSuccess ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                ¡Reclamo Enviado!
              </h3>
              <p className="text-gray-600 mb-2">
                Hemos recibido tu reclamo correctamente.
              </p>
              <p className="text-sm text-gray-500">
                Nos pondremos en contacto contigo en un plazo máximo de 30 días calendario.
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Esta ventana se cerrará automáticamente...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="bg-[#2c1ff1] px-6 py-3">
                <h3 className="text-base font-bold text-white">
                  1. Datos del reclamante
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="documentType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo de Documento <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="documentType"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all bg-white text-gray-800"
                  >
                    {documentTypeOptions.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="documentNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Número de Documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="documentNumber"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    placeholder="Ingresa tu número de documento"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all text-gray-800 placeholder:text-gray-500 ${(errors.documentNumber ? "border-red-500" : "border-gray-300")}`}
                  />
                  {errors.documentNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.documentNumber}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apellidos y Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Ingresa tus apellidos y nombres completos"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all text-gray-800 placeholder:text-gray-500 ${(errors.fullName ? "border-red-500" : "border-gray-300")}`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="987654321"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all text-gray-800 placeholder:text-gray-500 ${(errors.phone ? "border-red-500" : "border-gray-300")}`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@correo.com"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all text-gray-800 placeholder:text-gray-500 ${(errors.email ? "border-red-500" : "border-gray-300")}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#2c1ff1] px-6 py-3">
                <h3 className="Text-base font-bold text-white">
                  2. Detalle del reclamo
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="complaintDetail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Descripción del Reclamo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="complaintDetail"
                    name="complaintDetail"
                    value={formData.complaintDetail}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe detalladamente tu reclamo..."
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all resize-none text-gray-800 placeholder:text-gray-500 ${(errors.complaintDetail ? "border-red-500" : "border-gray-300")}`}
                  />
                  {errors.complaintDetail && (
                    <p className="mt-1 text-xs text-red-500">{errors.complaintDetail}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="expectedSolution"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Solución Esperada <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="expectedSolution"
                    name="expectedSolution"
                    value={formData.expectedSolution}
                    onChange={handleChange}
                    rows={2}
                    placeholder="¿Qué solución esperas de nosotros?"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all resize-none text-gray-800 placeholder:text-gray-500 ${(errors.expectedSolution ? "border-red-500" : "border-gray-300")}`}
                  />
                  {errors.expectedSolution && (
                    <p className="mt-1 text-xs text-red-500">{errors.expectedSolution}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#2c1ff1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2c1ff1]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Reclamo
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Al enviar este formulario, aceptas que tus datos sean procesados para
                  atender tu reclamo conforme a la Ley N° 29571.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
