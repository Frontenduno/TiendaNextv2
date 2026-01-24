// feature/favorite-button/FavoriteButton.tsx
'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/store/favoriteProduc/favoritesStore';

interface FavoriteButtonProps {
  productId: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  productId,
  size = 'md',
  variant = 'default',
}) => {
  const { isFavorite, toggleFavorite, _hasHydrated } = useFavoritesStore();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const favorite = isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleFavorite(productId);
    setIsAnimating(true);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const variantClasses = variant === 'card' 
    ? 'bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg'
    : 'border border-gray-300 rounded-lg hover:bg-gray-100';

  // Mostrar el estado neutral hasta que se complete la hidratación
  if (!_hasHydrated) {
    return (
      <button
        className={`relative ${buttonSizeClasses[size]} ${variantClasses} transition-all overflow-visible z-10 cursor-pointer opacity-50`}
        aria-label="Cargando favoritos..."
        disabled
      >
        <Heart className={`${sizeClasses[size]} text-gray-400`} />
      </button>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes heartBounce {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes particleSplash1 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-20px, -20px) scale(0);
            opacity: 0;
          }
        }

        @keyframes particleSplash2 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(20px, -20px) scale(0);
            opacity: 0;
          }
        }

        @keyframes particleSplash3 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-25px, 15px) scale(0);
            opacity: 0;
          }
        }

        @keyframes particleSplash4 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(25px, 15px) scale(0);
            opacity: 0;
          }
        }

        @keyframes particleSplash5 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0, -30px) scale(0);
            opacity: 0;
          }
        }

        @keyframes particleSplash6 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0, 25px) scale(0);
            opacity: 0;
          }
        }

        .heart-bounce {
          animation: heartBounce 0.6s ease-in-out;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #ef4444;
          border-radius: 50%;
          pointer-events: none;
        }

        .particle-1 { animation: particleSplash1 0.6s ease-out forwards; }
        .particle-2 { animation: particleSplash2 0.6s ease-out forwards; }
        .particle-3 { animation: particleSplash3 0.6s ease-out forwards; }
        .particle-4 { animation: particleSplash4 0.6s ease-out forwards; }
        .particle-5 { animation: particleSplash5 0.6s ease-out forwards; }
        .particle-6 { animation: particleSplash6 0.6s ease-out forwards; }
      `}</style>

      <button
        onClick={handleClick}
        className={`relative ${buttonSizeClasses[size]} ${variantClasses} transition-all overflow-visible z-10 cursor-pointer`}
        aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <Heart
          className={`${sizeClasses[size]} transition-colors ${
            favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
          } ${isAnimating ? 'heart-bounce' : ''}`}
        />
        {isAnimating && favorite && (
          <>
            <span className="particle particle-1" />
            <span className="particle particle-2" />
            <span className="particle particle-3" />
            <span className="particle particle-4" />
            <span className="particle particle-5" />
            <span className="particle particle-6" />
          </>
        )}
      </button>
    </>
  );
};