// store/cart/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState } from '@/interfaces/cart';
import productosData from '@/data/products.json';
import { ProductosDataJson } from '@/interfaces/products';

// Extender la interfaz CartState para incluir las propiedades faltantes
interface ExtendedCartState extends CartState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  getItemsCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<ExtendedCartState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      addItem: (itemData) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) => item.idProducto === itemData.idProducto
        );

        // Buscar el producto en el JSON para obtener datos adicionales
        const data = productosData as ProductosDataJson;
        const producto = data.productos.find(p => p.idProducto === itemData.idProducto);

        if (existingItemIndex > -1) {
          // Si ya existe, actualizar cantidad
          const updatedItems = [...items];
          const newQuantity = updatedItems[existingItemIndex].cantidad + itemData.cantidad;
          
          // No exceder el stock
          updatedItems[existingItemIndex].cantidad = Math.min(
            newQuantity,
            itemData.stockDisponible
          );
          
          set({ items: updatedItems });
        } else {
          // Si no existe, agregar nuevo item con datos completos
          const newItem: CartItem = {
            ...itemData,
            precioOriginal: producto?.precioBase,
            mensajeEnvio: producto?.mensajeEnvio || undefined,
            marca: producto?.marca.nombre,
          };
          
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.idProducto !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.idProducto === productId
              ? { ...item, cantidad: Math.min(quantity, item.stockDisponible) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0);
      },

      getItemsCount: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.precio * item.cantidad,
          0
        );
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.precio * item.cantidad,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);