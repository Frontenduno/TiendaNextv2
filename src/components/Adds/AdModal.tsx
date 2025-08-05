// src/components/AdModal.tsx
"use client";

import React, { ReactNode, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdModalProps {
  children: ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
}

export default function AdModal({
  children,
  onClose,
  showCloseButton = true,
}: AdModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
        onClick={handleClickOutside}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="relative mx-auto max-w-[90vw] max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {showCloseButton && (
            <button
              className="absolute top-3 right-3 p-1 rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-200 z-10"
              aria-label="Cerrar anuncio"
              onClick={onClose}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <div className="w-full h-full">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
