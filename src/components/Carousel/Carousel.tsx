// src/components/Carousel/Carousel.tsx
import React from 'react';
import NativeScrollCarousel from './NativeScrollCarousel';
import BrandsSlickCarousel from './BrandsSlickCarousel';
import BannerSlickCarousel from './BannerSlickCarousel';
import classNames from 'classnames';

import { Product } from '@/data/products';

export type CarouselItem = Product | string | { src: string; alt?: string; href?: string; [key: string]: any; };

interface BaseCarouselProps {
    title?: string;
    description?: string;
    showArrows?: boolean;
    showDots?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    className?: string;
}

export interface DataCarouselProps<T extends CarouselItem> extends BaseCarouselProps {
    type: 'items';
    data: T[];
    itemWidthReference: number;
    gapWidth?: number;
    renderItem?: (item: T, index: number) => React.ReactNode;
}

// *** ASEGÚRATE QUE ESTA INTERFAZ NO TIENE 'customArrows' ***
export interface ImageCarouselProps extends BaseCarouselProps {
    type: 'banner';
    images: (string | { src: string; alt?: string })[];
    heightClass?: string;
    showButton?: boolean;
    buttonText?: string;
    buttonBgColor?: string;
    clickToNavigateImage?: boolean; // Esta es la única prop de interacción que hemos añadido para banner
}

export interface BrandsCarouselProps extends BaseCarouselProps {
    type: 'brands';
    images: CarouselItem[];
    speed?: number;
    slidesToShow?: number;
    heightClass?: string;
}

type CarouselProps<T extends CarouselItem> = DataCarouselProps<T> | ImageCarouselProps | BrandsCarouselProps;


export default function Carousel<T extends CarouselItem>(props: CarouselProps<T>) {
    const {
        title,
        description,
        className,
        type,
        autoplay,
        autoplayInterval,
        showArrows,
        showDots,
        ...restProps
    } = props;

    let carouselContent;

    const commonChildProps = {
        autoplay: autoplay ?? true,
        autoplayInterval: autoplayInterval ?? 3000,
        showArrows: showArrows ?? true,
        showDots: showDots ?? false,
    };

    switch (type) {
        case 'items':
            const itemProps = restProps as DataCarouselProps<T>;
            carouselContent = (
                <NativeScrollCarousel
                    type="items"
                    data={itemProps.data}
                    itemWidthReference={itemProps.itemWidthReference}
                    gapWidth={itemProps.gapWidth}
                    renderItem={itemProps.renderItem}
                    {...commonChildProps}
                />
            );
            break;
        case 'banner':
            const bannerProps = restProps as ImageCarouselProps;
            carouselContent = (
                <BannerSlickCarousel
                    images={bannerProps.images}
                    heightClass={bannerProps.heightClass}
                    showButton={bannerProps.showButton}
                    buttonText={bannerProps.buttonText}
                    buttonBgColor={bannerProps.buttonBgColor}
                    clickToNavigateImage={bannerProps.clickToNavigateImage}
                    {...commonChildProps}
                />
            );
            break;
        case 'brands':
            const brandsProps = restProps as BrandsCarouselProps;
            carouselContent = (
                <BrandsSlickCarousel
                    type="brands"
                    images={brandsProps.images}
                    speed={brandsProps.speed}
                    slidesToShow={brandsProps.slidesToShow}
                    heightClass={brandsProps.heightClass}
                    {...commonChildProps}
                />
            );
            break;
        default:
            carouselContent = <div>Tipo de carrusel no soportado.</div>;
    }

    return (
        <section
            className={classNames(
                { 'py-8 md:py-12': type !== 'banner' },
                { 'pt-0 pb-0': type === 'banner' },
                className
            )}
        >
            {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
                    {title}
                </h2>
            )}
            {description && (
                <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
                    {description}
                </p>
            )}
            {carouselContent}
        </section>
    );
}