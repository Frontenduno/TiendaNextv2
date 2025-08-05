"use client";

import React, { useState, useEffect } from 'react';
import AdModal from './AdModal';
import LoginForm from '@/components/usuario/login';
import { modalAds } from '@/data/products';

export default function Adds() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (modalAds.length > 0) {
        setIsAdModalOpen(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseAdModal = () => {
    setIsAdModalOpen(false);

    setTimeout(() => {
      const nextIndex = currentAdIndex + 1;
      if (nextIndex < modalAds.length) {
        setCurrentAdIndex(nextIndex);
        setIsAdModalOpen(true);
      } else {
        console.log("Todos los anuncios modales han sido mostrados.");
      }
    }, 300);
  };

  const currentAd = modalAds[currentAdIndex];

  return (
    <>
      {isAdModalOpen && currentAd && (
        <AdModal
          onClose={handleCloseAdModal}
          showCloseButton={currentAd.type !== 'login'}
        >
          {currentAd.type === 'login' ? (
            <LoginForm
              onRegisterClick={handleCloseAdModal}
              onRecoverClick={handleCloseAdModal}
              onClose={handleCloseAdModal}
            />
          ) : (
            <div className="w-full h-auto flex justify-center items-center">
              {/* Elimina el título si no lo quieres ver */}
              {/* {currentAd.title && (
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{currentAd.title}</h3>
              )} */}
              <img
                src={currentAd.src}
                alt={currentAd.alt || 'Anuncio'}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400/cccccc/333333?text=Imagen+No+Disponible';
                  e.currentTarget.alt = 'Imagen no disponible';
                }}
              />
            </div>
          )}
        </AdModal>
      )}
    </>
  );
}