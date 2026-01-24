// components/product/product-card.config.ts
import type { 
  ImageAspectRatio, 
  CardSize, 
  CardPadding 
} from '@/interfaces/product-card';

export type FavoriteSize = 'sm' | 'md' | 'lg';

export interface SizeConfiguration {
  container: string;
  image: string;
  title: string;
  price: string;
  brand: string;
  padding: string;
  button: string;
  icon: string;
  tag: string;
  discount: string;
  favoriteSize: FavoriteSize;
  starSize: string;
  ratingText: string;
}

export const aspectRatioMap: Record<ImageAspectRatio, string> = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  tall: 'aspect-[2/3]',
  wide: 'aspect-[16/9]',
};

export const sizeConfig: Record<CardSize, SizeConfiguration> = {
  xs: {
    container: 'text-xs',
    image: 'aspect-square',
    title: 'text-xs line-clamp-2 min-h-[2rem]',
    price: 'text-sm',
    brand: 'text-[10px]',
    padding: 'p-2',
    button: 'py-1.5 text-xs',
    icon: 'w-3 h-3',
    tag: 'text-[10px] px-1.5 py-0.5',
    discount: 'text-[10px] px-1.5 py-0.5',
    favoriteSize: 'sm',
    starSize: 'w-2.5 h-2.5',
    ratingText: 'text-[9px]',
  },
  sm: {
    container: 'text-sm',
    image: 'aspect-[3/4]',
    title: 'text-xs line-clamp-2 min-h-[2.5rem]',
    price: 'text-base',
    brand: 'text-xs',
    padding: 'p-2.5',
    button: 'py-1.5 text-xs',
    icon: 'w-3.5 h-3.5',
    tag: 'text-xs px-2 py-0.5',
    discount: 'text-xs px-2 py-0.5',
    favoriteSize: 'sm',
    starSize: 'w-3 h-3',
    ratingText: 'text-[10px]',
  },
  md: {
    container: 'text-base',
    image: 'aspect-[3/4]',
    title: 'text-sm line-clamp-2 min-h-[2.5rem]',
    price: 'text-lg',
    brand: 'text-xs',
    padding: 'p-3',
    button: 'py-2 text-sm',
    icon: 'w-4 h-4',
    tag: 'text-xs px-2 py-0.5',
    discount: 'text-xs px-2 py-1',
    favoriteSize: 'md',
    starSize: 'w-3.5 h-3.5',
    ratingText: 'text-xs',
  },
  lg: {
    container: 'text-base',
    image: 'aspect-[3/4]',
    title: 'text-base line-clamp-2 min-h-[3rem]',
    price: 'text-xl',
    brand: 'text-sm',
    padding: 'p-4',
    button: 'py-2.5 text-base',
    icon: 'w-5 h-5',
    tag: 'text-sm px-2.5 py-1',
    discount: 'text-sm px-2.5 py-1',
    favoriteSize: 'md',
    starSize: 'w-4 h-4',
    ratingText: 'text-sm',
  },
  xl: {
    container: 'text-lg',
    image: 'aspect-[3/4]',
    title: 'text-lg line-clamp-2 min-h-[3.5rem]',
    price: 'text-2xl',
    brand: 'text-base',
    padding: 'p-5',
    button: 'py-3 text-base',
    icon: 'w-6 h-6',
    tag: 'text-sm px-3 py-1',
    discount: 'text-sm px-3 py-1.5',
    favoriteSize: 'lg',
    starSize: 'w-5 h-5',
    ratingText: 'text-base',
  },
};

export const paddingMap: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
};

// Función para renderizar estrellas correctamente (redondeo hacia arriba)
export const renderStars = (rating: number, starSizeClass: string) => {
  const fullStars = Math.ceil(rating); // Redondear hacia arriba: 4.5 -> 5, 4.1 -> 5
  
  return [...Array(5)].map((_, i) => ({
    key: i,
    filled: i < fullStars,
    className: starSizeClass,
  }));
};