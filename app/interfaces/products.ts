// interfaces/products.ts
export interface Genero {
  idGenero: number;
  nombre: string;
}

export interface Marca {
  idMarca: number;
  nombre: string;
}

export interface Coleccion {
  idColeccion: number;
  nombre: string;
}

export interface OpcionVariante {
  id: number;
  nombre: string;
  valor: string;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
}

export interface Imagen {
  idImagen: number;
  url: string;
  descripcion: string;
}

// ✅ NUEVA INTERFAZ para la estructura de imágenes
export interface ImagenesProducto {
  principal: Imagen;
  secundarias: Imagen[];
}

export interface Etiqueta {
  idEtiqueta: number;
  descripcion: string;
}

export interface Especificacion {
  nombre: string;
  valor: string;
}

export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precioBase: number;
  precioDescuento: number | null;
  stockActual: number;
  detalle: string;
  esReservio: boolean;
  esFavorito: boolean;
  disponibleRecojo: boolean;
  disponibleEnvio: boolean;
  tiempoEnvio: string | null;
  mensajeEnvio: string | null;
  calificacion?: number;
  totalReviews?: number;
  genero: Genero;
  marca: Marca;
  coleccion: Coleccion;
  categorias: Categoria[];
  etiquetas: Etiqueta[];
  especificaciones: Especificacion[];
  imagenes: ImagenesProducto;
  color: OpcionVariante;
  opcionAdicional: OpcionVariante | null;
  tipoOpcionAdicional: string | null;
  productosRelacionados: number[];
}

export interface ProductosDataJson {
  productos: Producto[];
}