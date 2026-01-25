"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, User } from "lucide-react";
import { registerSchema, RegisterFormData } from "@/utils/validations/schemas";
import { filterInput, filterPaste } from "@/utils/inputFilters";

interface Props {
  onSwitchLogin: () => void;
  onSwitchRecovery: () => void;
  onClose: () => void;
}

export default function RegisterModal({ onSwitchLogin, onSwitchRecovery, onClose }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError("");
    setIsLoading(true);

    try {
      const result = await registerUser(data.nombre, data.apellido, data.email, data.password);

      if (result.success) {
        console.log("✅ REGISTRO OK:", result.usuario);
        onClose();
        router.push("/profile/datos-personales");
      } else {
        setAuthError(result.error || "Error al registrarse");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear cuenta</h2>
        <p className="text-gray-500">Únete a nuestra plataforma</p>
      </div>

      {/* Error de autenticación */}
      {authError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{authError}</p>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className={`w-5 h-5 ${errors.nombre ? "text-red-400" : "text-gray-400"}`} />
              </div>
              <input
                id="nombre"
                type="text"
                {...register("nombre")}
                onKeyDown={(e) => filterInput(e, "letters", 50)}
                onPaste={(e) => filterPaste(e, "letters", 50)}
                maxLength={50}
                disabled={isLoading}
                placeholder="Juan"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition-all text-gray-900 placeholder-gray-400 ${
                  errors.nombre
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
            </div>
            {errors.nombre && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label htmlFor="apellido" className="block text-sm font-semibold text-gray-700 mb-2">
              Apellido
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className={`w-5 h-5 ${errors.apellido ? "text-red-400" : "text-gray-400"}`} />
              </div>
              <input
                id="apellido"
                type="text"
                {...register("apellido")}
                onKeyDown={(e) => filterInput(e, "letters", 50)}
                onPaste={(e) => filterPaste(e, "letters", 50)}
                maxLength={50}
                disabled={isLoading}
                placeholder="Pérez"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition-all text-gray-900 placeholder-gray-400 ${
                  errors.apellido
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
            </div>
            {errors.apellido && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.apellido.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={`w-5 h-5 ${errors.email ? "text-red-400" : "text-gray-400"}`} />
            </div>
            <input
              id="email"
              type="email"
              {...register("email")}
              disabled={isLoading}
              placeholder="tu@email.com"
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition-all text-gray-900 placeholder-gray-400 ${
                errors.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              } disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={`w-5 h-5 ${errors.password ? "text-red-400" : "text-gray-400"}`} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              maxLength={50}
              disabled={isLoading}
              placeholder="Mínimo 6 caracteres"
              className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition-all text-gray-900 ${
                errors.password
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              } disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Confirmar contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={`w-5 h-5 ${errors.confirmPassword ? "text-red-400" : "text-gray-400"}`} />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              maxLength={50}
              disabled={isLoading}
              placeholder="Repite tu contraseña"
              className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition-all text-gray-900 ${
                errors.confirmPassword
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              } disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Registrando...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Crear cuenta
            </>
          )}
        </button>
      </form>

      {/* Links */}
      <div className="mt-8 space-y-4">
        {/* Recuperar contraseña */}
        <div className="text-center">
          <button
            onClick={onSwitchRecovery}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">¿Ya tienes cuenta?</span>
          </div>
        </div>

        {/* Login */}
        <button
          onClick={onSwitchLogin}
          className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}