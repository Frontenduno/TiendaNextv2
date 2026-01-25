
// components/auth/recovery/RecoveryStep1Email.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, KeyRound, AlertCircle, ArrowLeft } from "lucide-react";
import { recoveryEmailSchema, RecoveryEmailFormData } from "@/utils/validations/schemas";

interface Props {
  onSubmit: (email: string) => void;
  onSwitchLogin: () => void;
}

export default function RecoveryStep1Email({ onSubmit, onSwitchLogin }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryEmailFormData>({
    resolver: zodResolver(recoveryEmailSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: RecoveryEmailFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSubmit(data.email);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
          <KeyRound className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Recuperar contraseña</h2>
        <p className="text-gray-500">Ingresa tu correo electrónico</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
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
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900 placeholder-gray-400 ${
                errors.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-purple-500"
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando código...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Enviar código de verificación
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchLogin}
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}