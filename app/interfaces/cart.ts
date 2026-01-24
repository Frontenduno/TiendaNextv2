// interfaces/cart.ts
export interface CartItem {
  idProducto: number;
  nombre: string;
  precio: number;
  precioOriginal?: number;
  cantidad: number;
  imagen: string;
  color: string;
  opcionAdicional?: string;
  stockDisponible: number;
  mensajeEnvio?: string;
  marca?: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'precioOriginal' | 'mensajeEnvio' | 'marca'>) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}