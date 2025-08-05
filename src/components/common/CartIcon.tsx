// src/components/common/CartIcon.tsx
'use client';

import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

// Define la interfaz de props para CartIcon
interface CartIconProps {
  iconSize?: string; // Hacemos que la prop sea opcional y de tipo string (para clases de Tailwind como 'text-2xl')
}

export default function CartIcon({ iconSize = 'text-xl' }: CartIconProps) { // Establece un valor por defecto si no se pasa
  const { totalItems } = useCart();

  return (
    <Link
      href="/page/cart"
      className="relative flex items-center gap-1 hover:underline text-white cursor-pointer"
    >
      {/* Aplica la clase de tamaño directamente al ícono */}
      <FaShoppingCart className={iconSize} /> 
      <span className="hidden sm:inline"></span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}