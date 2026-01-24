// components/product/ProductCard.tsx
'use client';

import React from 'react';
import { Producto } from '@/interfaces/products';
import { useCartStore } from '@/store/cart/cartStore';
import { getPriceInfo } from '@/utils/pricing';
import productosData from '@/data/products.json';
import { ProductosDataJson } from '@/interfaces/products';
import type { 
  ImageAspectRatio, 
  CardSize, 
  CardLayout, 
  AddToCartBehavior,
  CardPadding 
} from '@/interfaces/product-card';
import { aspectRatioMap, sizeConfig, paddingMap } from './product-card.config';
import { HorizontalLayout, VerticalLayout } from './ProductCardLayouts';

export interface ProductCardProps {
  producto: Producto;
  imageAspect?: ImageAspectRatio;
  size?: CardSize;
  showColors?: boolean;
  showAddToCart?: boolean;
  addToCartBehavior?: AddToCartBehavior;
  maxTags?: number;
  padding?: CardPadding;
  layout?: CardLayout;
  showRating?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  producto,
  imageAspect = 'portrait',
  size = 'md',
  showColors = true,
  showAddToCart = true,
  addToCartBehavior = 'hover',
  maxTags = 2,
  padding,
  layout = 'vertical',
  showRating = false,
}) => {
  const priceInfo = getPriceInfo(producto);
  const addItem = useCartStore((state) => state.addItem);
  const data = productosData as ProductosDataJson;
  
  const productosRelacionados = data.productos.filter(p => 
    producto.productosRelacionados.includes(p.idProducto)
  );
  
  const coloresDisponibles = [
    producto.color,
    ...productosRelacionados.map(p => p.color)
  ].filter((color, index, self) => 
    index === self.findIndex(c => c.id === color.id)
  ).slice(0, 5);

  const config = sizeConfig[size];
  const aspectRatio = aspectRatioMap[imageAspect];
  const contentPadding = padding ? paddingMap[padding] : config.padding;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      idProducto: producto.idProducto,
      nombre: producto.nombre,
      precio: priceInfo.finalPrice,
      cantidad: 1,
      imagen: producto.imagenes[0]?.url || '/placeholder.png',
      color: producto.color.nombre,
      opcionAdicional: producto.opcionAdicional?.nombre,
      stockDisponible: producto.stockActual,
    });
  };

  const layoutProps = {
    producto,
    config,
    aspectRatio,
    contentPadding,
    priceInfo,
    coloresDisponibles,
    handleAddToCart,
    showColors,
    showAddToCart,
    showRating,
    addToCartBehavior,
    maxTags,
  };

  if (layout === 'horizontal') {
    return <HorizontalLayout {...layoutProps} />;
  }

  return <VerticalLayout {...layoutProps} />;
};