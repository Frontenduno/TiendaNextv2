export interface Categoria {
  idCategoria: number;
  nombre: string;
  categoria_padre: number | null;
  subcategorias?: Categoria[];
}

export interface CategoriasData {
  categorias: Categoria[];
}