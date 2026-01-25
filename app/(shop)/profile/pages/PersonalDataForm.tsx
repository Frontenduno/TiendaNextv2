"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, Edit2, Save, X, User, AlertCircle } from "lucide-react";
import { UserWithoutPassword } from "@/interfaces/user";
import { Toast, ToastType } from "@/components/toast";
import { personalDataSchema, PersonalDataFormData } from "@/utils/validations/schemas";
import { filterInput, filterPaste } from "@/utils/inputFilters";

export default function PersonalDataForm({ user }: { user: UserWithoutPassword }) {
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PersonalDataFormData>({
    resolver: zodResolver(personalDataSchema),
    mode: "onChange",
    defaultValues: {
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      correo: user.correo || "",
    },
  });

  const onSubmit = async (data: PersonalDataFormData) => {
    try {
      // Aquí iría la lógica para actualizar los datos
      console.log("Datos actualizados:", data);
      
      setIsEditing(false);
      setToast({
        message: 'Tus datos han sido actualizados correctamente',
        type: 'success'
      });
    } catch {
      setToast({
        message: 'Error al actualizar los datos. Intenta nuevamente.',
        type: 'error'
      });
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Card Principal */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header con título y botón editar */}
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wide">
                Datos personales
              </h3>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isDirty}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Nombre {isEditing && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    id="nombre"
                    type="text"
                    {...register("nombre")}
                    onKeyDown={(e) => filterInput(e, "letters", 50)}
                    onPaste={(e) => filterPaste(e, "letters", 50)}
                    maxLength={50}
                    disabled={!isEditing}
                    placeholder="Ingresa tu nombre"
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 font-medium outline-none transition-all ${
                      isEditing
                        ? errors.nombre
                          ? "border-red-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 cursor-default"
                    }`}
                  />
                </div>
                {errors.nombre && isEditing && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label htmlFor="apellido" className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Apellido {isEditing && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    id="apellido"
                    type="text"
                    {...register("apellido")}
                    onKeyDown={(e) => filterInput(e, "letters", 50)}
                    onPaste={(e) => filterPaste(e, "letters", 50)}
                    maxLength={50}
                    disabled={!isEditing}
                    placeholder="Ingresa tu apellido"
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 font-medium outline-none transition-all ${
                      isEditing
                        ? errors.apellido
                          ? "border-red-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 cursor-default"
                    }`}
                  />
                </div>
                {errors.apellido && isEditing && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.apellido.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="correo" className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Email {isEditing && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="correo"
                    type="email"
                    {...register("correo")}
                    disabled={!isEditing}
                    placeholder="tu@email.com"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-gray-900 font-medium outline-none transition-all ${
                      isEditing
                        ? errors.correo
                          ? "border-red-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 cursor-default"
                    }`}
                  />
                </div>
                {errors.correo && isEditing && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.correo.message}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value="••••••••••••"
                    disabled
                    className="w-full pl-11 pr-11 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-600 font-medium cursor-not-allowed"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic flex items-center gap-1">
                  <Lock size={12} />
                  La contraseña no se muestra por seguridad
                </p>
              </div>

              {/* Estado */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Estado de Cuenta
                </label>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-green-50 text-green-700 border border-green-200">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                  {user.estado || "ACTIVO"}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

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