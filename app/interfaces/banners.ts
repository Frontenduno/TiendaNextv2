// interfaces/banners.ts

export interface Banner {
  idBanner: number;
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  imagen: {
    url: string;
    alt: string;
  };
  idCategoria: number;
  activo: boolean;
  orden: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface BannerCarouselProps {
  banners: Banner[];
  design?: 1 | 2;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  height?: string;
  aspectRatio?: string;
  borderRadius?: string;
  padding?: string;
}

export interface BannersData {
  banners: Banner[];
}