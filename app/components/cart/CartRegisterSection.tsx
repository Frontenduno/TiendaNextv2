"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, UserPlus, Phone } from "lucide-react";
import { registerSchema, RegisterFormData } from "@/utils/validations/schemas";
import { filterInput, filterPaste } from "@/utils/inputFilters";

interface Props {
  onDataChange: (data: RegisterFormData | null, isValid: boolean) => void;
  onTermsChange: (accepted: boolean) => void;
}

export function CartRegisterSection({ onDataChange, onTermsChange }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const formData = watch();

  useEffect(() => {
    onDataChange(formData as RegisterFormData, isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.nombre, formData.apellido, formData.email, formData.telefono, formData.password, formData.confirmPassword, isValid]);

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked);
    onTermsChange(checked);
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Datos personales</h3>
            <p className="text-sm text-gray-600">Completa tus datos para continuar</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.nombre ? "text-red-400" : "text-gray-400"}`} />
              <input
                type="text"
                {...register("nombre")}
                onKeyDown={(e) => filterInput(e, "letters", 50)}
                onPaste={(e) => filterPaste(e, "letters", 50)}
                maxLength={50}
                placeholder="Juan"
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 ${
                  errors.nombre
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                } focus:ring-2 outline-none transition-all`}
              />
            </div>
            {errors.nombre && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Apellido
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.apellido ? "text-red-400" : "text-gray-400"}`} />
              <input
                type="text"
                {...register("apellido")}
                onKeyDown={(e) => filterInput(e, "letters", 50)}
                onPaste={(e) => filterPaste(e, "letters", 50)}
                maxLength={50}
                placeholder="Pérez"
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 ${
                  errors.apellido
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                } focus:ring-2 outline-none transition-all`}
              />
            </div>
            {errors.apellido && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.apellido.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? "text-red-400" : "text-gray-400"}`} />
            <input
              type="email"
              {...register("email")}
              placeholder="tu@email.com"
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-200"
              } focus:ring-2 outline-none transition-all`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Teléfono
          </label>
          <div className="relative">
            <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.telefono ? "text-red-400" : "text-gray-400"}`} />
            <input
              type="tel"
              {...register("telefono")}
              onKeyDown={(e) => filterInput(e, "numbers", 9)}
              onPaste={(e) => filterPaste(e, "numbers", 9)}
              maxLength={9}
              placeholder="987654321"
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 ${
                errors.telefono
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-200"
              } focus:ring-2 outline-none transition-all`}
            />
          </div>
          {errors.telefono && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.telefono.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.password ? "text-red-400" : "text-gray-400"}`} />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                maxLength={50}
                placeholder="Mínimo 6 caracteres"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                } focus:ring-2 outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.confirmPassword ? "text-red-400" : "text-gray-400"}`} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                maxLength={50}
                placeholder="Repite tu contraseña"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                } focus:ring-2 outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => handleTermsChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              Acepto los{" "}
              <a href="/terminos" target="_blank" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                términos y condiciones
              </a>{" "}
              para la creación de mi cuenta
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}