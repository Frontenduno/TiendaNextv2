"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";

import { BrandsCarouselProps, CarouselItem } from "./Carousel";

interface BrandsCarouselChildProps extends Omit<BrandsCarouselProps, 'showArrows' | 'showDots' | 'autoplay' | 'autoplayInterval'> {
    showArrows: boolean;
    showDots: boolean;
    autoplay: boolean;
    autoplayInterval: number;
}

export default function BrandsSlickCarousel(props: BrandsCarouselChildProps) {
    const {
        images = [],
        autoplay,
        autoplayInterval,
        speed = 8000,
        slidesToShow = 6,
        heightClass = 'h-[160px]',
        showArrows,
        showDots,
    } = props;

    if (images.length === 0) return null;

    const settings = {
        dots: showDots,
        infinite: true, // mantiene el loop cíclico
        speed: speed, // tiempo total del scroll
        autoplay: autoplay,
        autoplaySpeed: autoplayInterval, // cada cuánto avanza
        cssEase: "linear", // para animación constante
        slidesToShow: slidesToShow,
        slidesToScroll: 1, // solo 1 para que se vea fluido
        arrows: showArrows,
        swipeToSlide: true,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1536, settings: { slidesToShow: slidesToShow } },
            { breakpoint: 1280, settings: { slidesToShow: Math.min(slidesToShow, 5) } },
            { breakpoint: 1024, settings: { slidesToShow: Math.min(slidesToShow, 4) } },
            { breakpoint: 768, settings: { slidesToShow: Math.min(slidesToShow, 3) } },
            { breakpoint: 480, settings: { slidesToShow: Math.min(slidesToShow, 2) } }
        ]
    };

    return (
        <Slider {...settings}>
            {images.map((brandItem: CarouselItem, i) => {
                const src = typeof brandItem === 'string' ? brandItem : (brandItem as any).src;
                const alt = (brandItem as any).alt || `Marca ${i + 1}`;
                const href = (brandItem as any).href || '#';

                return (
                    <div key={i} className="px-2">
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                                w-full h-full block bg-gray-100 rounded-xl shadow-md overflow-hidden
                                flex items-center justify-center p-2 border border-gray-200
                                transition-all duration-300 ease-in-out transform
                                hover:shadow-xl hover:scale-105
                            `}
                            style={{ height: heightClass.replace('h-[', '').replace('px]', 'px') }}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={src}
                                    alt={alt}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                        </a>
                    </div>
                );
            })}
        </Slider>
    );
}
