'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Service {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    category: string;
}

interface ServiceCarouselProps {
    services: Service[];
    title?: string;
}

export function ServiceCarousel({ services, title = 'Featured Services' }: ServiceCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        skipSnaps: false,
    });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);

        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    if (services.length === 0) return null;

    return (
        <div className="relative">
            {title && (
                <h3 className="text-2xl font-bold mb-6">{title}</h3>
            )}

            <div className="relative">
                {/* Carousel */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                            >
                                <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                                    {/* Image */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10">
                                        {service.imageUrl ? (
                                            <img
                                                src={service.imageUrl}
                                                alt={service.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-8xl opacity-30">
                                                {service.category.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <p className="text-sm font-medium mb-2 opacity-80">{service.category}</p>
                                        <h4 className="text-2xl font-bold mb-2">{service.name}</h4>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-sm">View Details</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation buttons */}
                {services.length > 3 && (
                    <>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                            onClick={scrollPrev}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                            onClick={scrollNext}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </>
                )}
            </div>

            {/* Dots */}
            {services.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                'w-2 h-2 rounded-full transition-all duration-300',
                                index === selectedIndex
                                    ? 'bg-primary w-8'
                                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                            )}
                            onClick={() => scrollTo(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
