"use client";

import { useState } from "react";
import usersData from "@/data/user.json";

interface Props {
  onSwitchRegister: () => void;
  onClose: () => void;
}

export default function LoginModal({ onSwitchRegister, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = usersData.usuarios.find(
      (u) => u.correo === email && u.contraseña === password
    );

    if (!user) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    // guardar usuario en localStorage
    localStorage.setItem("user", JSON.stringify(user));

    console.log("✅ LOGIN OK:", user);

    onClose(); // cerrar modal

    // ir al perfil
    window.location.href = "/profile";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
        <p className="text-sm text-gray-500">Accede a tu cuenta</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full text-gray-800 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full text-gray-800 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
        >
          Iniciar sesión
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        ¿No tienes cuenta?{" "}
        <span
          onClick={onSwitchRegister}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Regístrate
        </span>
      </div>
    </div>
  );
}
