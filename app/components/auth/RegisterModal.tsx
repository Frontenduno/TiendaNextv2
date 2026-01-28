"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, User, Phone } from "lucide-react";
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
  const [acceptTerms, setAcceptTerms] = useState(false);

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
    if (!acceptTerms) {
      setAuthError("Debes aceptar los términos y condiciones para crear una cuenta");
      return;
    }

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
    <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl mx-auto">
      {/* Header - Icono y mensaje desaparecen en móviles pequeños */}
      <div className="mb-3 sm:mb-4 text-center">
        <div className="hidden sm:flex w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg shadow-green-200">
          <UserPlus className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">Crear cuenta</h2>
        <p className="hidden sm:block text-xs md:text-sm text-gray-500">Únete a nuestra plataforma</p>
      </div>

      {authError && (
        <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 rounded-xl p-2.5 sm:p-3 flex items-start gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-medium">{authError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-3">
        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label htmlFor="nombre" className="block text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
              Nombre *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                <User className={`w-4 h-4 ${errors.nombre ? "text-red-400" : "text-gray-400"}`} />
              </div>
              <input
                id="nombre"
                type="text"
                {...register("nombre")}
                onKeyDown={(e) => filterInput(e, "letters", 50)}
                onPaste={(e) => filterPaste(e, "letters", 50)}
                maxLength={50}
                disabled={isLoading}
                placeholder="Ingresa tu nombre"
                className={`w-full pl-9 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-green-100 outline-none transition-all text-xs sm:text-sm text-gray-900 placeholder-gray-400 ${
                  errors.nombre
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
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
            <label htmlFor="apellido" className="block text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
              Apellido *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                <User className={`w-4 h-4 ${errors.apellido ? "text-red-400" : "text-gray-400"}`} />
              </div>
              <input
                id="apellido"
                type="text"
                {...register("apellido")}
                onKeyDown={(e) => filterInput(e, "letters", 50)}
                onPaste={(e) => filterPaste(e, "letters", 50)}
                maxLength={50}
                disabled={isLoading}
                placeholder="Ingresa tu apellido"
                className={`w-full pl-9 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-green-100 outline-none transition-all text-xs sm:text-sm text-gray-900 placeholder-gray-400 ${
                  errors.apellido
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
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

        {/* Email y Teléfono */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
              Correo electrónico *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                <Mail className={`w-4 h-4 ${errors.email ? "text-red-400" : "text-gray-400"}`} />
              </div>
              <input
                id="email"
                type="email"
                {...register("email")}
                disabled={isLoading}
                placeholder="Ingresa tu correo"
                className={`w-full pl-9 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-green-100 outline-none transition-all text-xs sm:text-sm text-gray-900 placeholder-gray-400 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
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
            <label htmlFor="telefono" className="block text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
              Teléfono *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                <Phone className={`w-4 h-4 ${errors.telefono ? "text-red-400" : "text-gray-400"}`} />
              </div>
              <input
                id="telefono"
                type="tel"
                {...register("telefono")}
                onKeyDown={(e) => filterInput(e, "numbers", 9)}
                onPaste={(e) => filterPaste(e, "numbers", 9)}
                maxLength={9}
                disabled={isLoading}
                placeholder="Ingresa tu teléfono"
                className={`w-full pl-9 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-green-100 outline-none transition-all text-xs sm:text-sm text-gray-900 placeholder-gray-400 ${
                  errors.telefono
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
            </div>
            {errors.telefono && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.telefono.message}
              </p>
            )}
          </div>
        </div>

        {/* Contraseña y Confirmar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
              Contraseña *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                <Lock className={`w-4 h-4 ${errors.password ? "text-red-400" : "text-gray-400"}`} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                maxLength={50}
                disabled={isLoading}
                placeholder="Mínimo 6 caracteres"
                className={`w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-green-100 outline-none transition-all text-xs sm:text-sm text-gray-900 placeholder-gray-400 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
              Confirmar contraseña *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                <Lock className={`w-4 h-4 ${errors.confirmPassword ? "text-red-400" : "text-gray-400"}`} />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                maxLength={50}
                disabled={isLoading}
                placeholder="Repite tu contraseña"
                className={`w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-green-100 outline-none transition-all text-xs sm:text-sm text-gray-900 placeholder-gray-400 ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Términos y condiciones */}
        <div className="pt-0.5 sm:pt-1">
          <label className="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              disabled={isLoading}
              className="mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer disabled:opacity-50"
            />
            <span className="text-xs text-gray-700 leading-relaxed">
              Acepto los{" "}
              <a href="/footer/legal/terminos-y-condiciones" target="_blank" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                términos y condiciones
              </a>{" "}
              y la{" "}
              <a href="/footer/legal/politica-de-privacidad" target="_blank" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                política de privacidad
              </a>
            </span>
          </label>
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          disabled={isLoading || !acceptTerms}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Registrando...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Crear cuenta
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3">
        <div className="text-center">
          <button
            onClick={onSwitchRecovery}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2.5 sm:px-3 bg-white text-gray-500 font-medium">¿Ya tienes cuenta?</span>
          </div>
        </div>

        <button
          onClick={onSwitchLogin}
          className="w-full border-2 border-gray-200 text-gray-700 py-2 sm:py-2.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] text-xs sm:text-sm"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}