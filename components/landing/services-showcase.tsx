'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedSectionHeader } from '@/components/animations/animated-section-header';
import { RevealOnScroll } from '@/components/animations/reveal-on-scroll';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import {
    Palette,
    Video,
    Image as ImageIcon,
    Sparkles,
    Zap,
    Layers
} from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);



export function ServicesShowcase() {
    const t = useTranslations('landing.servicesShowcase');
    const gridRef = useRef<HTMLDivElement>(null);

    const services = [
        {
            id: 'design',
            title: t('logoDesign.title'),
            description: t('logoDesign.description'),
            icon: Palette,
            color: 'from-pink-500 to-rose-500',
            bgColor: 'bg-pink-500/10',
            href: '/services?category=design',
        },
        {
            id: 'motion',
            title: t('motionGraphics.title'),
            description: t('motionGraphics.description'),
            icon: Video,
            color: 'from-purple-500 to-indigo-500',
            bgColor: 'bg-purple-500/10',
            href: '/services?category=motion',
        },
        {
            id: 'banners',
            title: t('bannerDesign.title'),
            description: t('bannerDesign.description'),
            icon: ImageIcon,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            href: '/services?category=banners',
        },
        {
            id: 'logos',
            title: t('logoDesign.title'),
            description: t('logoDesign.description'),
            icon: Sparkles,
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-500/10',
            href: '/services?category=logos',
        },
        {
            id: 'fivem',
            title: t('fivemTrailers.title'),
            description: t('fivemTrailers.description'),
            icon: Zap,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            href: '/services?category=fivem',
        },
        {
            id: 'custom',
            title: t('brandingPackages.title'),
            description: t('brandingPackages.description'),
            icon: Layers,
            color: 'from-violet-500 to-purple-500',
            bgColor: 'bg-violet-500/10',
            href: '/services',
        },
    ];

    useEffect(() => {
        if (!gridRef.current) return;

        const cards = gridRef.current.querySelectorAll('.service-card');

        const ctx = gsap.context(() => {
            gsap.fromTo(
                cards,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, gridRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                <AnimatedSectionHeader
                    title={t('title')}
                    subtitle={t('subtitle')}
                />

                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
                >
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <Link
                                key={service.id}
                                href={service.href}
                                className="service-card group"
                            >
                                <Card className="h-full p-8 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer">
                                    {/* Icon with animated background */}
                                    <div className="relative mb-6">
                                        <div
                                            className={`absolute inset-0 ${service.bgColor} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                                        />
                                        <div
                                            className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                                        >
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Hover indicator */}
                                    <div className="mt-6 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-sm font-semibold">Explore</span>
                                        <svg
                                            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA */}
                <RevealOnScroll variant="fade-up" className="text-center mt-12">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                    >
                        {useTranslations('services')('viewAll')}
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </RevealOnScroll>
            </div>
        </section>
    );
}
