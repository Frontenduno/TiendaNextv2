"use client";

import { useState } from "react";

interface Props {
  onSwitchLogin: () => void;
  onClose: () => void;
}

export default function RegisterModal({ onSwitchLogin, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Nuevo estado
  const [error, setError] = useState(""); // Estado para errores de validación

  const handleRegister = () => {
    // Validación básica
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError(""); // Limpiar errores si todo está bien
    console.log("REGISTER:", { name, email, password });
    onClose();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>
        <p className="text-sm text-gray-500">Regístrate para continuar</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-2 rounded-lg border border-red-200 text-center animate-pulse">
            {error}
          </div>
        )}

        <input
          placeholder="Nombre completo"
          className="w-full text-gray-800 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full text-gray-800 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full text-gray-800 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Campo Confirmar Contraseña */}
        <input
          type="password"
          placeholder="Confirmar contraseña"
          className={`w-full text-gray-800 rounded-lg border px-3 py-2 focus:ring-2 outline-none ${
            confirmPassword && password !== confirmPassword 
              ? "border-red-500 focus:ring-red-500" 
              : "focus:ring-blue-500"
          }`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-500 transition shadow-md active:scale-95"
        >
          Registrarse
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{" "}
        <span
          onClick={onSwitchLogin}
          className="text-blue-600 hover:underline cursor-pointer font-medium"
        >
          Inicia sesión
        </span>
      </div>
    </div>
  );
}