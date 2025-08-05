'use client';

import dynamic from 'next/dynamic';

// Importa dinámicamente el componente del carrito
const CartView = dynamic(() => import('@/view/cart'), { ssr: false });

export default function CartPage() {
  return (
    <div>
      <CartView />
    </div>
  );
}
