// utils/productOptions.ts
import { Producto, OpcionVariante } from '@/interfaces/products';

export interface ProductOptions {
  colores: OpcionVariante[];
  opcionesAdicionales: OpcionVariante[];
}

/**
 * Obtiene todas las opciones disponibles para un grupo de productos relacionados
 */
export const getProductOptions = (
  productos: Producto[],
  productosRelacionadosIds: number[]
): ProductOptions => {
  const relacionados = productos.filter(p => 
    productosRelacionadosIds.includes(p.idProducto)
  );

  const coloresMap = new Map<number, OpcionVariante>();
  const opcionesMap = new Map<number, OpcionVariante>();

  relacionados.forEach(p => {
    coloresMap.set(p.color.id, p.color);
    if (p.opcionAdicional) {
      opcionesMap.set(p.opcionAdicional.id, p.opcionAdicional);
    }
  });

  return {
    colores: Array.from(coloresMap.values()),
    opcionesAdicionales: Array.from(opcionesMap.values()),
  };
};

/**
 * Obtiene solo los colores disponibles para una opción adicional específica
 */
export const getAvailableColorsForOption = (
  productos: Producto[],
  productosRelacionadosIds: number[],
  opcionAdicionalId: number | null
): OpcionVariante[] => {
  const relacionados = productos.filter(p => 
    productosRelacionadosIds.includes(p.idProducto)
  );

  const coloresMap = new Map<number, OpcionVariante>();

  relacionados.forEach(p => {
    // Si no hay opción adicional seleccionada, mostrar todos los colores
    if (opcionAdicionalId === null) {
      coloresMap.set(p.color.id, p.color);
    }
    // Si hay opción adicional seleccionada, solo mostrar colores que tengan esa opción
    else if (p.opcionAdicional?.id === opcionAdicionalId) {
      coloresMap.set(p.color.id, p.color);
    }
  });

  return Array.from(coloresMap.values());
};

/**
 * Obtiene solo las opciones adicionales disponibles para un color específico
 */
export const getAvailableOptionsForColor = (
  productos: Producto[],
  productosRelacionadosIds: number[],
  colorId: number
): OpcionVariante[] => {
  const relacionados = productos.filter(p => 
    productosRelacionadosIds.includes(p.idProducto)
  );

  const opcionesMap = new Map<number, OpcionVariante>();

  relacionados.forEach(p => {
    // Solo agregar opciones adicionales que tengan el color seleccionado
    if (p.color.id === colorId && p.opcionAdicional) {
      opcionesMap.set(p.opcionAdicional.id, p.opcionAdicional);
    }
  });

  return Array.from(opcionesMap.values());
};

/**
 * Busca un producto por sus opciones
 */
export const findProductByOptions = (
  productos: Producto[],
  productosRelacionadosIds: number[],
  colorId: number,
  opcionAdicionalId: number | null
): Producto | undefined => {
  return productos.find(p => 
    productosRelacionadosIds.includes(p.idProducto) &&
    p.color.id === colorId &&
    (opcionAdicionalId === null || p.opcionAdicional?.id === opcionAdicionalId)
  );
};