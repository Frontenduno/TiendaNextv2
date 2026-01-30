// components/product/ProductInfo.tsx
'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Truck, Store, Package, Star } from 'lucide-react';
import { Producto, OpcionVariante } from '@/interfaces/products';
import { OptionSelector } from './OptionSelector';
import { FavoriteButton } from '@/feature/favorite-button/FavoriteButton';
import { useCartStore } from '@/store/cart/cartStore';
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

// Función helper para crear slug (solo para navegación interna)
function createSlug(nombre: string, id: number): string {
  const nombreSlug = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `${nombreSlug}-${id}`;
}

// Función para renderizar estrellas correctamente
const renderStars = (rating: number) => {
  const fullStars = Math.ceil(rating);
  
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${
        i < fullStars
          ? 'fill-yellow-400 text-yellow-400'
          : 'text-gray-300'
      }`}
    />
  ));
};

export const ProductInfo: React.FC<ProductInfoProps> = ({ producto }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const data = productosData as ProductosDataJson;
  const todosProductos = data.productos;
  const addItem = useCartStore((state) => state.addItem);
  
  const productosRelacionadosIds = useMemo(() => 
    [producto.idProducto, ...producto.productosRelacionados],
    [producto.idProducto, producto.productosRelacionados]
  );
  
  const [quantity, setQuantity] = useState(1);
  const priceInfo = getPriceInfo(producto);

  const coloresDisponibles = useMemo(() => {
    return getAvailableColorsForOption(
      todosProductos,
      productosRelacionadosIds,
      producto.opcionAdicional?.id || null
    );
  }, [todosProductos, productosRelacionadosIds, producto.opcionAdicional?.id]);

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
      const slug = createSlug(nuevoProducto.nombre, nuevoProducto.idProducto);
      startTransition(() => {
        router.push(`/product/${slug}`, { scroll: false });
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
      const slug = createSlug(nuevoProducto.nombre, nuevoProducto.idProducto);
      startTransition(() => {
        router.push(`/product/${slug}`, { scroll: false });
      });
    }
  };

  const handleAddToCart = () => {
    addItem({
      idProducto: producto.idProducto,
      nombre: producto.nombre,
      precio: priceInfo.finalPrice,
      cantidad: quantity,
      imagen: producto.imagenes.principal?.url || 'https://picsum.photos/seed/placeholder/800/1000',
      color: producto.color.nombre,
      opcionAdicional: producto.opcionAdicional?.nombre,
      stockDisponible: producto.stockActual,
    });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= producto.stockActual) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className={`w-full transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <p className="text-gray-600 mb-1 text-left">{producto.marca.nombre}</p>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-left">{producto.nombre}</h1>

      {producto.calificacion && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {renderStars(producto.calificacion)}
          </div>
          {producto.totalReviews && (
            <span className="text-sm text-gray-600">
              ({producto.totalReviews} reseñas)
            </span>
          )}
        </div>
      )}

      <p className="text-sm text-gray-600 mb-4 text-left">
        Vendido por <span className="text-green-600 font-semibold">Falabella</span>
      </p>

      <div className="mb-6">
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
            <p className="text-base sm:text-lg text-gray-500 line-through text-left">
              S/ {priceInfo.originalPrice.toFixed(2)}
            </p>
          </>
        ) : (
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            S/ {priceInfo.finalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {producto.mensajeEnvio && (
        <p className="text-green-600 font-semibold mb-6 text-left">{producto.mensajeEnvio}</p>
      )}

      <OptionSelector
        label="Color"
        opciones={coloresDisponibles}
        selectedOpcion={producto.color}
        onOpcionChange={handleColorChange}
        tipo="color"
        disabled={isPending}
      />

      {producto.tipoOpcionAdicional && opcionesAdicionalesDisponibles.length > 0 && (
        <OptionSelector
          label={producto.tipoOpcionAdicional}
          opciones={opcionesAdicionalesDisponibles}
          selectedOpcion={producto.opcionAdicional}
          onOpcionChange={handleOpcionAdicionalChange}
          tipo="text"
          disabled={isPending}
        />
      )}

      {/* Especificaciones destacadas - Diseño mejorado según referencia */}
      <div className="space-y-4 mb-6">
        {producto.especificaciones.slice(0, 4).map((spec, index) => (
          <div key={index} className="border-b border-gray-200 pb-3">
            <p className="text-xs sm:text-sm text-gray-700 mb-1 text-left">{spec.nombre}:</p>
            <p className="text-sm sm:text-base text-gray-900 leading-relaxed text-left">
              {spec.valor}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="flex items-center justify-between sm:justify-start gap-4 order-1 sm:order-none">
          <span className="text-sm text-gray-700 font-medium sm:hidden">Cantidad:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isPending}
              className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 transition-colors"
            >
              -
            </button>
            <span className="px-6 py-2 border-x border-gray-300 text-gray-900 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= producto.stockActual || isPending}
              className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3 flex-1 order-2 sm:order-none">
          <button
            onClick={handleAddToCart}
            disabled={isPending}
            className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Agregar al Carro</span>
            <span className="sm:hidden">Agregar</span>
          </button>

          <FavoriteButton 
            productId={producto.idProducto}
            size="lg"
            variant="default"
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <span className="text-sm text-gray-900 text-left">
            Stock disponible: <span className="font-medium">{producto.stockActual} unidades</span>
          </span>
        </div>

        {producto.disponibleEnvio && (
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-sm text-gray-900 text-left">Despacho a domicilio</span>
                {producto.tiempoEnvio && (
                  <span className="text-green-600 text-sm font-medium text-left">{producto.tiempoEnvio}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {producto.disponibleRecojo && (
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-sm text-gray-900 text-left">Retira tu compra</span>
                <span className="text-green-600 text-sm font-medium text-left">Disponible para retiro</span>
              </div>
            </div>
          </div>
        )}

        {!producto.disponibleEnvio && !producto.disponibleRecojo && (
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <span className="text-sm text-gray-600 text-left">Solo disponible en línea</span>
          </div>
        )}
      </div>
    </div>
  );
};