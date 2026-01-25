// interfaces/purchase-history.ts

export interface ProductoCompra {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  color?: string;
  opcionAdicional?: string | null;
}

export interface DireccionEntrega {
  tipo: string;
  direccion: string;
  referencia: string;
  distrito: string;
  ciudad: string;
}

export interface CompraHistorial {
  idCompra: number;
  numeroOrden: string;
  fecha: string;
  estado: 'entregado' | 'cancelado';
  total: number;
  subtotal: number;
  envio: number;
  descuento: number;
  metodoPago: string;
  direccionEntrega: DireccionEntrega;
  fechaEntrega?: string;
  productos: ProductoCompra[];
}

export interface PurchaseHistoryData {
  historialCompras: CompraHistorial[];
}