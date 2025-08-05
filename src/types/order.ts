export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColorId?: string;
  image?: string;
  category?: string;
  targetAudience?: string;
  model?: string;
}

export interface Order {
  id: string;
  date: string;
  totalCost: number;
  totalItems: number;
  items: OrderItem[];
  metodoEnvio: 'retiro' | 'envio';
  formaPago: string;
  transactionId?: string;
  transactionTime?: string;
}

export interface PurchaseHistoryItem {
  order: Order;
}
