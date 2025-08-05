// src/components/Carousel/BannerSlickCarousel.tsx
'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import classNames from 'classnames';

interface CarouselItem {
    src: string;
    alt?: string;
    href?: string; // Asegúrate de que href también sea parte de la interfaz si se usa
}

interface BannerCarouselChildProps {
    images?: (string | CarouselItem)[];
    showArrows?: boolean;
    showDots?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    heightClass?: string;
    showButton?: boolean;
    buttonText?: string;
    buttonBgColor?: string;
    clickToNavigateImage?: boolean;
}

export default function BannerSlickCarousel(props: BannerCarouselChildProps) {
    const {
        images = [],
        autoplay = true,
        autoplayInterval = 3000,
        heightClass = 'h-[28rem]',
        showButton = false,
        buttonText = 'COMPRAR',
        buttonBgColor = 'bg-blue-600',
        showArrows = true,
        showDots = true,
        clickToNavigateImage = false,
    } = props;

    const sliderRef = useRef<Slider>(null);

    // Si no hay imágenes, no renderizamos nada
    // Considera qué hacer si no hay imágenes pero necesitas un placeholder visible
    if (images.length === 0) {
        // Podrías renderizar una imagen de fallback estática si prefieres que el carrusel no desaparezca
        // Por ejemplo:
        return (
             <div className={classNames("relative w-full overflow-hidden", heightClass)}>
                 <Image
                     src="/products/user-icon.jpg" // Tu imagen de fallback
                     alt="No hay banners disponibles"
                     fill
                     className="object-cover"
                 />
                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
                     No hay banners disponibles
                 </div>
             </div>
        );
    }

    useEffect(() => {
        const styleId = 'slick-carousel-custom-styles';
        if (!document.getElementById(styleId)) {
            const styleSheet = document.createElement('style');
            styleSheet.id = styleId;
            styleSheet.innerHTML = `
                .slick-dots {
                    bottom: 24px !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    display: ${showDots ? 'flex' : 'none'} !important;
                    justify-content: center !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    list-style: none !important;
                    z-index: 10;
                }

                .slick-dots li {
                    margin: 0 4px !important;
                }

                .slick-dots li div {
                    width: 12px !important;
                    height: 12px !important;
                    border-radius: 9999px !important;
                    border: 1px solid white !important;
                    background-color: #9ca3af !important;
                    transition: all 0.3s ease !important;
                }

                .slick-dots li div:hover {
                    background-color: white !important;
                }

                .slick-dots li.slick-active div {
                    background-color: white !important;
                    border-color: white !important;
                }

                .slick-dots li button {
                    font-size: 0 !important;
                    line-height: 0 !important;
                    display: block !important;
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    border: none !important;
                    background: transparent !important;
                    cursor: pointer !important;
                    outline: none !important;
                }

                .slick-dots li button::before,
                .slick-dots li button::after {
                    content: none !important;
                }

                .slick-prev,
                .slick-next {
                    z-index: 20 !important;
                    width: 50px !important;
                    height: 50px !important;
                    opacity: 1 !important;
                    transform: translateY(-50%) !important;
                    top: 50% !important;
                    background-color: transparent !important;
                    border: none !important;
                    border-radius: 0 !important;
                    cursor: pointer;
                }

                .slick-prev:hover,
                .slick-next:hover {
                    background-color: transparent !important;
                    opacity: 1 !important;
                }

                .slick-prev {
                    left: 10px !important;
                }

                .slick-next {
                    right: 10px !important;
                }

                .slick-prev:before,
                .slick-next:before {
                    font-family: 'slick' !important;
                    font-size: 36px !important;
                    color: black !important;
                    opacity: 0.9 !important;
                }

                .slick-prev:before {
                    content: '\\2190' !important;
                }

                .slick-next:before {
                    content: '\\2192' !important;
                }

                @media (max-width: 767px) {
                    .slick-prev, .slick-next {
                        display: none !important;
                    }
                }

                .slick-list {
                    overflow: hidden !important;
                }

                .slick-track {
                    display: flex !important;
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }, [showDots, showArrows]);

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!clickToNavigateImage || !sliderRef.current) return;

        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        if (autoplay && sliderRef.current.slickPause) {
            sliderRef.current.slickPause();
        }
        
        if (clickX < width / 2) {
            sliderRef.current.slickPrev();
        } else {
            sliderRef.current.slickNext();
        }

        if (autoplay && sliderRef.current.slickPlay) {
            setTimeout(() => {
                sliderRef.current?.slickPlay();
            }, 3000);
        }
    };

    const sliderSettings = useMemo(() => ({
        dots: showDots,
        infinite: true,
        speed: 500,
        autoplay,
        autoplaySpeed: autoplayInterval,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: showArrows,
        fade: true,
        cssEase: 'linear',
        appendDots: (dots: React.ReactNode) => (
            <div>
                <ul className="flex space-x-2 m-0 p-0">{dots}</ul>
            </div>
        ),
        customPaging: () => <div />,
        swipeToSlide: false,
        draggable: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    swipe: false,
                    draggable: false,
                },
            },
        ],
    }), [autoplay, autoplayInterval, showArrows, showDots]);

    return (
        <div className="relative overflow-hidden">
            <Slider ref={sliderRef} {...sliderSettings}>
                {images.map((bannerItem: string | CarouselItem, i: number) => {
                    // Si imageSrc es una cadena vacía o undefined, usa la imagen de fallback
                    const imageSrc = (typeof bannerItem === 'string' ? bannerItem : (bannerItem as CarouselItem)?.src) || '/products/user-icon.jpg'; // <-- CAMBIO CLAVE AQUÍ
                    const imageAlt = typeof bannerItem === 'string' ? `Carousel Banner ${i}` : (bannerItem as CarouselItem)?.alt ?? `Carousel Banner ${i}`;

                    return (
                        <div
                            key={i}
                            className={classNames('relative w-full flex items-center justify-center overflow-hidden', heightClass)}
                        >
                            <div
                                className={classNames(
                                    'relative w-full h-full',
                                    { 'cursor-pointer': clickToNavigateImage, 'pointer-events-none': !clickToNavigateImage }
                                )}
                                onClick={handleImageClick}
                            >
                                <Image
                                    src={imageSrc} // Ahora imageSrc siempre tendrá un valor válido
                                    alt={imageAlt}
                                    fill
                                    className="object-cover"
                                    priority={i === 0}
                                />
                            </div>

                            {showButton && (
                                <button
                                    className={classNames(
                                        'absolute left-1/2 transform -translate-x-1/2',
                                        'bottom-8 md:bottom-16 lg:bottom-24',
                                        'px-4 py-2 text-sm md:px-8 md:py-3 md:text-lg',
                                        'font-semibold rounded-full text-white shadow-lg',
                                        'flex items-center justify-center transition-transform duration-300',
                                        'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                                        buttonBgColor
                                    )}
                                >
                                    {buttonText}
                                </button>
                            )}
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}