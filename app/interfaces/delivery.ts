// interfaces/delivery.ts

export type DeliveryMethod = 'home' | 'store';

export interface DeliveryState {
  method: DeliveryMethod;
  selectedLocationId: number | null;
  selectedStoreId: number | null;
}

export interface DeliveryOption {
  id: DeliveryMethod;
  title: string;
  description: string;
  icon: string;
}