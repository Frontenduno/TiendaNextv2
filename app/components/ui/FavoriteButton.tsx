// components/ui/FavoriteButton.tsx
'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  productId: number;
  initialFavorite?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  initialFavorite = false,
  size = 'md',
  variant = 'default',
  onFavoriteChange,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    setIsAnimating(true);
    
    if (onFavoriteChange) {
      onFavoriteChange(newFavoriteState);
    }
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const variantClasses = variant === 'card' 
    ? 'bg-white rounded-full shadow-md hover:bg-gray-100'
    : 'border border-gray-300 rounded-lg hover:bg-gray-100';

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
          width: 8px;
          height: 8px;
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
        className={`relative ${buttonSizeClasses[size]} ${variantClasses} transition overflow-visible z-10 cursor-pointer`}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <Heart
          className={`${sizeClasses[size]} transition-colors ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
          } ${isAnimating ? 'heart-bounce' : ''}`}
        />
        {isAnimating && isFavorite && (
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