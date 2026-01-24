"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-[fadeIn_0.2s_ease-out]">
        
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold transition"
        >
          X
        </button>

        {children}
      </div>
    </div>
  );
}
