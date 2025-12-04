'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

interface Service {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    price: string;
    deliveryTime: number;
    imageUrl: string | null;
    isActive: boolean;
}

interface ServiceCardProps {
    service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
    const t = useTranslations('services');
    const tCategories = useTranslations('categories');
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const image = imageRef.current;

        const handleMouseEnter = () => {
            if (image) {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.4,
                    ease: 'power2.out',
                });
            }
        };

        const handleMouseLeave = () => {
            if (image) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                });
            }
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <Link href={`/services/${service.slug}`}>
            <Card
                ref={cardRef}
                className="group h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 border-2 hover:border-primary/50 overflow-hidden bg-card/50 backdrop-blur-sm"
            >
                {/* Image container with zoom effect */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                    <div
                        ref={imageRef}
                        className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 flex items-center justify-center"
                    >
                        {service.imageUrl ? (
                            <img
                                src={service.imageUrl}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-6xl opacity-50">
                                {tCategories(service.category).charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {service.name}
                        </CardTitle>
                        <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardDescription className="line-clamp-2">
                        {service.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Badge
                            variant="secondary"
                            className="group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                        >
                            {tCategories(service.category)}
                        </Badge>
                        <div className="text-right">
                            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                                ${parseFloat(service.price).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                            {service.deliveryTime} {t('days', { count: service.deliveryTime })} {t('deliveryTime')}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

