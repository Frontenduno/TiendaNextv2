// layouts/public/components/libro-reclamaciones.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, FileText, Send, CheckCircle } from "lucide-react";
import {
  libroReclamacionesSchema,
  LibroReclamacionesFormData,
} from "@/utils/validations/schemas";

interface LibroReclamacionesProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOCUMENT_TYPES = [
  { value: "dni", label: "DNI" },
  { value: "carnet_extranjeria", label: "Carnet de Extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
] as const;

export function LibroReclamaciones({ isOpen, onClose }: LibroReclamacionesProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<LibroReclamacionesFormData>({
    resolver: zodResolver(libroReclamacionesSchema),
    mode: "onChange",
    defaultValues: {
      documentType: "dni",
      documentNumber: "",
      fullName: "",
      phone: "",
      email: "",
      complaintDetail: "",
      expectedSolution: "",
    },
  });

  const documentType = watch("documentType");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleClose = () => {
    reset();
    setShowSuccess(false);
    onClose();
  };

  const onSubmit = async (data: LibroReclamacionesFormData) => {
    setIsSubmitting(true);
    console.log("Datos del formulario:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => handleClose(), 3000);
  };

  const filterInput = (e: React.KeyboardEvent<HTMLInputElement>, type: "numbers" | "letters", max?: number) => {
    const regex = type === "numbers" ? /[0-9]/ : /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
    if ((max && e.currentTarget.value.length >= max && !allowed.includes(e.key)) || (!regex.test(e.key) && !allowed.includes(e.key))) {
      e.preventDefault();
    }
  };

  const filterPaste = (e: React.ClipboardEvent<HTMLInputElement>, type: "numbers" | "letters", max?: number) => {
    const text = e.clipboardData.getData("text");
    const regex = type === "numbers" ? /^[0-9]+$/ : /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regex.test(text) || (max && text.length > max)) e.preventDefault();
  };

  const docMaxLength = documentType === "dni" ? 8 : 12;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="bg-linear-to-r from-[#2c1ff1] to-[#5648f5] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Libro de Reclamaciones</h2>
              <p className="text-sm text-white/80">Conforme a la Ley N° 29571</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {showSuccess ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Reclamo Enviado!</h3>
              <p className="text-gray-600 mb-2">Hemos recibido tu reclamo correctamente.</p>
              <p className="text-sm text-gray-500">Nos pondremos en contacto contigo en un plazo máximo de 30 días calendario.</p>
              <p className="text-xs text-gray-400 mt-4">Esta ventana se cerrará automáticamente...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Sección 1 */}
              <div className="bg-[#2c1ff1] px-6 py-3">
                <h3 className="text-base font-bold text-white">1. Datos del reclamante</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento <span className="text-red-500">*</span>
                  </label>
                  <select id="documentType" {...register("documentType")} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all bg-white text-gray-800">
                    {DOCUMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="documentNumber"
                    {...register("documentNumber")}
                    onKeyDown={(e) => filterInput(e, "numbers", docMaxLength)}
                    onPaste={(e) => filterPaste(e, "numbers", docMaxLength)}
                    maxLength={docMaxLength}
                    placeholder="Ingresa tu número de documento"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all text-gray-800 ${errors.documentNumber ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.documentNumber && <p className="mt-1 text-xs text-red-500">{errors.documentNumber.message}</p>}
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos y Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    {...register("fullName")}
                    onKeyDown={(e) => filterInput(e, "letters", 100)}
                    onPaste={(e) => filterPaste(e, "letters", 100)}
                    maxLength={100}
                    placeholder="Ingresa tus apellidos y nombres completos"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all text-gray-800 ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      onKeyDown={(e) => filterInput(e, "numbers", 9)}
                      onPaste={(e) => filterPaste(e, "numbers", 9)}
                      maxLength={9}
                      placeholder="987654321"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all text-gray-800 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      placeholder="ejemplo@correo.com"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all text-gray-800 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Sección 2 */}
              <div className="bg-[#2c1ff1] px-6 py-3">
                <h3 className="text-base font-bold text-white">2. Detalle del reclamo</h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="complaintDetail" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del Reclamo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="complaintDetail"
                    {...register("complaintDetail")}
                    rows={3}
                    maxLength={1000}
                    placeholder="Describe detalladamente tu reclamo..."
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all resize-none text-gray-800 ${errors.complaintDetail ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.complaintDetail && <p className="mt-1 text-xs text-red-500">{errors.complaintDetail.message}</p>}
                </div>

                <div>
                  <label htmlFor="expectedSolution" className="block text-sm font-medium text-gray-700 mb-1">
                    Solución Esperada <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="expectedSolution"
                    {...register("expectedSolution")}
                    rows={2}
                    maxLength={500}
                    placeholder="¿Qué solución esperas de nosotros?"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2c1ff1] focus:border-transparent transition-all resize-none text-gray-800 ${errors.expectedSolution ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.expectedSolution && <p className="mt-1 text-xs text-red-500">{errors.expectedSolution.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-[#2c1ff1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2c1ff1]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

                <p className="text-xs text-gray-500 text-center">
                  Al enviar este formulario, aceptas que tus datos sean procesados para atender tu reclamo conforme a la Ley N° 29571.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}