// components/auth/recovery/RecoveryStep2Code.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, AlertCircle, ArrowLeft } from "lucide-react";
import { recoveryCodeSchema, RecoveryCodeFormData } from "@/utils/validations/schemas";
import { filterInput, filterPaste } from "@/utils/inputFilters";

interface Props {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function RecoveryStep2Code({ email, onVerified, onBack }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RecoveryCodeFormData>({
    resolver: zodResolver(recoveryCodeSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: RecoveryCodeFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simular validación (código correcto: 123456)
    if (data.code === "123456") {
      setIsLoading(false);
      onVerified();
    } else {
      setIsLoading(false);
      setError("code", {
        type: "manual",
        message: "Código incorrecto. Intenta nuevamente.",
      });
    }
  };

  const handleResendCode = async () => {
    setCanResend(false);
    setCountdown(60);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useState(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verificar código</h2>
        <p className="text-gray-500 mb-1">Ingresa el código enviado a:</p>
        <p className="text-blue-600 font-semibold">{email}</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div>
          <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
            Código de verificación
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            {...register("code")}
            onKeyDown={(e) => filterInput(e, "numbers", 6)}
            onPaste={(e) => filterPaste(e, "numbers", 6)}
            disabled={isLoading}
            placeholder="000000"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400 text-center text-2xl tracking-widest font-bold ${
              errors.code
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-blue-500"
            } disabled:bg-gray-50 disabled:cursor-not-allowed`}
          />
          {errors.code && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 justify-center">
              <AlertCircle className="w-4 h-4" />
              {errors.code.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verificando...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Verificar código
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        {canResend ? (
          <button
            onClick={handleResendCode}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            Reenviar código
          </button>
        ) : (
          <p className="text-gray-500 text-sm">
            Reenviar código en <span className="font-semibold text-gray-700">{countdown}s</span>
          </p>
        )}
        
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Cambiar correo electrónico
        </button>
      </div>
    </div>
  );
}