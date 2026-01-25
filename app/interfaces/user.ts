export interface Usuario {
  idUsuario: number;
  correo: string;
  contraseña: string;
  nombre: string;
  apellido: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  created_at: string;
  updated_at: string;
}

// Usuario sin contraseña pero con todos los demás campos
export type UserWithoutPassword = Omit<Usuario, 'contraseña'>;

export interface Carrito {
  idCarrito: number;
  idUsuario: number;
  estado: 'ACTIVO' | 'COMPLETADO' | 'ABANDONADO';
  created_at: string;
  updated_at: string;
}

export interface DetalleCarrito {
  idDetalleCarrito: number;
  cantidad: number;
  precioUnitario: number;
  idCarrito: number;
  idProducto: number;
}