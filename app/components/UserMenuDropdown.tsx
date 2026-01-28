"use client";

import { useEffect, useRef } from "react";

interface UserMenuDropdownProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function UserMenuDropdown({
  onLoginClick,
  onRegisterClick,
  onClose,
  isOpen,
}: UserMenuDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-0 w-56 bg-white shadow-2xl overflow-hidden z-50 border-2 border-gray-200 animate-[fadeIn_0.2s_ease-out]"
    >
      <div className="p-4 space-y-3">
        <button
          onClick={onLoginClick}
          className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center transition-colors text-base active:scale-95"
        >
          Iniciar sesión
        </button>

        <button
          onClick={onRegisterClick}
          className="block w-full px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold text-center transition-colors border-2 border-blue-600 text-base active:scale-95"
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
}