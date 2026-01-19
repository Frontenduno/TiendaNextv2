// components/product/ProductInfo.tsx
'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Truck, Store, Package } from 'lucide-react';
import { Producto, OpcionVariante } from '@/interfaces/products';
import { OptionSelector } from './OptionSelector';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { getPriceInfo } from '@/utils/pricing';
import productosData from '@/data/products.json';
import { ProductosDataJson } from '@/interfaces/products';
import { 
  findProductByOptions,
  getAvailableColorsForOption,
  getAvailableOptionsForColor
} from '@/utils/productOptions';

interface ProductInfoProps {
  producto: Producto;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ producto }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const data = productosData as ProductosDataJson;
  const todosProductos = data.productos;
  
  const productosRelacionadosIds = useMemo(() => 
    [producto.idProducto, ...producto.productosRelacionados],
    [producto.idProducto, producto.productosRelacionados]
  );
  
  const [quantity, setQuantity] = useState(1);
  const priceInfo = getPriceInfo(producto);

  // Obtener colores disponibles basados en la opción adicional seleccionada
  const coloresDisponibles = useMemo(() => {
    return getAvailableColorsForOption(
      todosProductos,
      productosRelacionadosIds,
      producto.opcionAdicional?.id || null
    );
  }, [todosProductos, productosRelacionadosIds, producto.opcionAdicional?.id]);

  // Obtener opciones adicionales disponibles basadas en el color seleccionado
  const opcionesAdicionalesDisponibles = useMemo(() => {
    return getAvailableOptionsForColor(
      todosProductos,
      productosRelacionadosIds,
      producto.color.id
    );
  }, [todosProductos, productosRelacionadosIds, producto.color.id]);

  const handleColorChange = (color: OpcionVariante) => {
    const nuevoProducto = findProductByOptions(
      todosProductos,
      productosRelacionadosIds,
      color.id,
      producto.opcionAdicional?.id || null
    );
    
    if (nuevoProducto) {
      startTransition(() => {
        router.push(`/product/${nuevoProducto.idProducto}`, { scroll: false });
      });
    }
  };

  const handleOpcionAdicionalChange = (opcion: OpcionVariante) => {
    const nuevoProducto = findProductByOptions(
      todosProductos,
      productosRelacionadosIds,
      producto.color.id,
      opcion.id
    );
    
    if (nuevoProducto) {
      startTransition(() => {
        router.push(`/product/${nuevoProducto.idProducto}`, { scroll: false });
      });
    }
  };

  const handleAddToCart = () => {
    console.log('Agregar al carrito:', {
      idProducto: producto.idProducto,
      cantidad: quantity,
      color: producto.color,
      opcionAdicional: producto.opcionAdicional,
    });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= producto.stockActual) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className={`w-full text-left transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <p className="text-gray-600 mb-1 text-left">{producto.marca.nombre}</p>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-left">{producto.nombre}</h1>

      <p className="text-sm text-gray-600 mb-4 text-left">
        Vendido por <span className="text-green-600 font-semibold">Falabella</span>
      </p>

      <div className="mb-6 text-left">
        {priceInfo.hasDiscount ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl sm:text-3xl font-bold text-red-600">
                S/ {priceInfo.finalPrice.toFixed(2)}
              </span>
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                -{priceInfo.discountPercentage}%
              </span>
            </div>
            <p className="text-base sm:text-lg text-gray-500 line-through">
              S/ {priceInfo.originalPrice.toFixed(2)}
            </p>
          </>
        ) : (
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            S/ {priceInfo.finalPrice.toFixed(2)}
          </span>
        )}
      </div>

      <p className="text-green-600 font-semibold mb-6 text-left">{producto.tiempoEnvio}</p>

      <div className="text-left">
        <OptionSelector
          label="Color"
          opciones={coloresDisponibles}
          selectedOpcion={producto.color}
          onOpcionChange={handleColorChange}
          tipo="color"
          disabled={isPending}
        />
      </div>

      {producto.tipoOpcionAdicional && opcionesAdicionalesDisponibles.length > 0 && (
        <div className="text-left">
          <OptionSelector
            label={producto.tipoOpcionAdicional}
            opciones={opcionesAdicionalesDisponibles}
            selectedOpcion={producto.opcionAdicional}
            onOpcionChange={handleOpcionAdicionalChange}
            tipo="text"
            disabled={isPending}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {producto.especificaciones.slice(0, 4).map((spec, index) => (
          <div key={index} className="text-left">
            <p className="text-xs sm:text-sm text-gray-600">{spec.nombre}:</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900">{spec.valor}</p>
          </div>
        ))}
      </div>

      {/* Selector de cantidad y botones - Layout responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        {/* Selector de cantidad */}
        <div className="flex items-center justify-between sm:justify-start gap-4 order-1 sm:order-none">
          <span className="text-sm text-gray-700 font-medium sm:hidden">Cantidad:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isPending}
              className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
            >
              -
            </button>
            <span className="px-6 py-2 border-x border-gray-300 text-gray-900">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= producto.stockActual || isPending}
              className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
            >
              +
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 flex-1 order-2 sm:order-none">
          <button
            onClick={handleAddToCart}
            disabled={isPending}
            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Agregar al Carro</span>
            <span className="sm:hidden">Agregar</span>
          </button>

          <FavoriteButton 
            productId={producto.idProducto}
            initialFavorite={producto.esFavorito}
            size="lg"
            variant="default"
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <span className="text-sm text-gray-900">
            Stock disponible: {producto.stockActual} unidades
          </span>
        </div>
        {producto.disponibleEnvio && (
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm text-gray-900">Despacho a domicilio</span>
              <span className="text-green-600 text-sm">{producto.tiempoEnvio}</span>
            </div>
          </div>
        )}
        {producto.disponibleRecojo && (
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm text-gray-900">Retira tu compra</span>
              <span className="text-green-600 text-sm">Retira hoy</span>
            </div>
          </div>
        )}
        {!producto.disponibleEnvio && !producto.disponibleRecojo && (
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <span className="text-sm text-gray-600">Solo disponible en línea</span>
          </div>
        )}
      </div>
    </div>
  );
};