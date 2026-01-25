// store/delivery/deliveryStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeliveryMethod } from '@/interfaces/delivery';

interface DeliveryState {
  method: DeliveryMethod;
  selectedLocationId: number | null;
  selectedStoreId: number | null;
  setMethod: (method: DeliveryMethod) => void;
  setSelectedLocation: (id: number | null) => void;
  setSelectedStore: (id: number | null) => void;
  reset: () => void;
}

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      method: 'home',
      selectedLocationId: null,
      selectedStoreId: null,

      setMethod: (method) => {
        set({ 
          method,
          // Resetear la selección al cambiar de método
          selectedLocationId: null,
          selectedStoreId: null
        });
      },

      setSelectedLocation: (id) => {
        set({ selectedLocationId: id });
      },

      setSelectedStore: (id) => {
        set({ selectedStoreId: id });
      },

      reset: () => {
        set({
          method: 'home',
          selectedLocationId: null,
          selectedStoreId: null
        });
      }
    }),
    {
      name: 'delivery-storage'
    }
  )
);