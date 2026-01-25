// components/auth/recovery/RecoveryStep3NewPassword.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { recoveryPasswordSchema, RecoveryPasswordFormData } from "@/utils/validations/schemas";

interface Props {
  email: string;
  onSuccess: () => void;
}

export default function RecoveryStep3NewPassword({ onSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryPasswordFormData>({
    resolver: zodResolver(recoveryPasswordSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSuccess();
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nueva contraseña</h2>
        <p className="text-gray-500">Crea una contraseña segura</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Nueva contraseña
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Cambiando contraseña...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Cambiar contraseña
            </>
          )}
        </button>
      </form>
    </div>
  );
}