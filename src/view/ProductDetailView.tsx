// src/view/ProductDetailView.tsx
'use client';

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

import { sampleProducts, Product, GlobalColor, availableGlobalColors } from "@/data/products";
import { useCart } from '@/context/CartContext';
import NativeScrollCarousel from '@/components/Carousel/NativeScrollCarousel';

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [validationMessage, setValidationMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const allGalleryImages: string[] = [product.image, ...(product.secondaryImages || [])];
  const availableSizes = product.sizes ?? [];

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedSize(null);
      setSelectedColorId(product.availableColors && product.availableColors.length > 0 ? product.availableColors[0] : null);
      setQuantity(1);
      setValidationMessage(null);
    }
  }, [product]);

  useEffect(() => {
    if (validationMessage) {
      const timer = setTimeout(() => {
        setValidationMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [validationMessage]);

  const productAvailableColors: GlobalColor[] = (product.availableColors || [])
    .map(colorId => availableGlobalColors.find((gc: GlobalColor) => gc.id === colorId))
    .filter((color): color is GlobalColor => color !== undefined);

  const relatedProducts = sampleProducts.filter(p => p.id !== product.id);

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      setValidationMessage({ type: 'error', text: 'Por favor, selecciona una talla.' });
      return;
    }

    if (product.availableColors && product.availableColors.length > 0 && !selectedColorId) {
      setValidationMessage({ type: 'error', text: 'Por favor, selecciona un color.' });
      return;
    }

    addItem(product.id, quantity, selectedSize || undefined, selectedColorId || undefined);
    setValidationMessage({ type: 'success', text: 'Producto añadido al carrito exitosamente!' });
  };

  return (
    <main className="relative flex flex-col items-center p-4 md:p-8 bg-gray-100 w-full min-h-screen">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 w-full max-w-4xl mt-8">
        <div className="flex-1 flex flex-col items-center">
          <div className="rounded-lg p-3 bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col gap-4 w-full">
            <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
              <Image
                src={allGalleryImages[selectedImageIndex]}
                alt={product.name}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              {allGalleryImages.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`
                    relative border-2 rounded-lg cursor-pointer w-20 h-20 md:w-28 md:h-28 flex items-center justify-center overflow-hidden
                    ${selectedImageIndex === idx ? "border-black transition-all duration-300 ease-in-out" : "border-transparent transition-all duration-300 ease-in-out"}
                  `}
                >
                  <Image
                    src={src}
                    alt={`${product.name} - Vista ${idx + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="rounded-lg p-3 bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col gap-4">
            {product.tag === 'Oferta' && product.oldPrice && product.oldPrice > product.price && (
              <p className="text-xs md:text-sm font-bold text-yellow-500">Oferta</p>
            )}
            <h2 className="text-2xl md:text-3xl font-bold">{product.name}</h2>
            <p className="text-gray-500 text-sm md:text-base">{product.model}</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">
              S/{product.price.toFixed(2)}{" "}
              {product.oldPrice && (
                <span className="line-through text-gray-400">S/{product.oldPrice.toFixed(2)}</span>
              )}
            </p>

            {productAvailableColors.length > 0 && (
              <div>
                <p className="font-semibold">Color:</p>
                <div className="flex gap-2 mt-2">
                  {productAvailableColors.map((colorItem) => (
                    <button
                      key={colorItem.id}
                      onClick={() => setSelectedColorId(colorItem.id)}
                      className={`
                        w-10 h-10 md:w-12 md:h-12 border rounded
                        ${colorItem.hex}
                        ${selectedColorId === colorItem.id ? "ring-2 ring-offset-2 ring-gray-500 transition-all duration-300 ease-in-out" : "ring-transparent transition-all duration-300 ease-in-out"}
                        cursor-pointer
                      `}
                      aria-label={`Seleccionar color ${colorItem.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div>
                <p className="font-semibold">Selecciona una talla:</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border px-2 py-1 text-sm rounded ${
                        selectedSize === size
                          ? "bg-black text-white transition-colors duration-300 ease-in-out"
                          : "bg-white text-black hover:bg-gray-200 transition-colors duration-300 ease-in-out"
                      } cursor-pointer`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <p className="font-semibold">Cantidad:</p>
              <div className="flex items-center rounded overflow-hidden border border-gray-300">
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="bg-gray-500 hover:bg-gray-600 p-1 cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><polygon points="16,4 8,12 16,20" /></svg>
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center outline-none appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none 
                    [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button onClick={() => setQuantity(prev => prev + 1)} className="bg-gray-500 hover:bg-gray-600 p-1 cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><polygon points="8,4 16,12 8,20" /></svg>
                </button>
              </div>
            </div>

            {validationMessage && (
              <div className={`
                p-3 rounded-md mt-4 text-center font-semibold text-sm
                ${validationMessage.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}
                transition-opacity duration-500 ease-in-out
              `}>
                {validationMessage.text}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-4 py-2 mt-4 rounded-md hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
            >
              Agregar al carrito
            </button>

            <div className="mt-4">
              <h3 className="text-base md:text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700 text-sm md:text-base">
                {product.description || "No hay descripción disponible para este producto."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[900px] mt-8 md:mt-12">
        <h3 className="text-base md:text-lg font-bold mb-4">También te puede interesar</h3>
        <NativeScrollCarousel
          type="items"
          data={relatedProducts}
          itemWidthReference={280}
          gapWidth={16}
          showArrows={true}
          autoplay={true}
          autoplayInterval={3000}
          showDots={false}
        />
      </div>
    </main>
  );
}
