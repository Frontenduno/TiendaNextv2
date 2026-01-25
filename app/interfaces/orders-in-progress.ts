// interfaces/orders-in-progress.ts

export interface ProductoOrden {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  color?: string;
  opcionAdicional?: string | null;
}

export interface DireccionEnvio {
  tipo: string;
  direccion: string;
  referencia: string;
  distrito: string;
  ciudad: string;
}

export interface HistorialTracking {
  fecha: string;
  estado: string;
  descripcion: string;
}

export interface Tracking {
  codigoSeguimiento: string;
  empresa: string;
  estadoActual: string;
  fechaEntregaEstimada: string;
  historial: HistorialTracking[];
}

export interface OrdenEnProceso {
  idOrden: number;
  numeroOrden: string;
  fecha: string;
  estado: 'procesando' | 'en_camino';
  total: number;
  subtotal: number;
  envio: number;
  descuento: number;
  metodoPago: string;
  direccionEnvio: DireccionEnvio;
  tracking: Tracking;
  productos: ProductoOrden[];
}

export interface OrdersInProgressData {
  ordenesEnProceso: OrdenEnProceso[];
}