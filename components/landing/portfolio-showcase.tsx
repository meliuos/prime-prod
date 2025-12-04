'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedSectionHeader } from '@/components/animations/animated-section-header';
import { X } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Showcase {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    order: number;
}

interface PortfolioShowcaseProps {
    showcases: Showcase[];
}

import { useTranslations } from 'next-intl';

export function PortfolioShowcase({ showcases }: PortfolioShowcaseProps) {
    const t = useTranslations('landing.portfolio');
    const gridRef = useRef<HTMLDivElement>(null);
    const [selectedItem, setSelectedItem] = useState<Showcase | null>(null);

    useEffect(() => {
        if (!gridRef.current) return;

        const items = gridRef.current.querySelectorAll('.portfolio-item');

        const ctx = gsap.context(() => {
            gsap.fromTo(
                items,
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.9,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: {
                        amount: 0.6,
                        from: 'start',
                    },
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
        <>
            <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <AnimatedSectionHeader
                        title={t('title')}
                        subtitle={t('subtitle')}
                    />

                    {/* Masonry Grid */}
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
                    >
                        {showcases.map((item, index) => (
                            <div
                                key={item.id}
                                className={`portfolio-item group relative overflow-hidden rounded-2xl cursor-pointer ${index % 7 === 0 || index % 7 === 3 ? 'lg:row-span-2' : ''
                                    }`}
                                onClick={() => setSelectedItem(item)}
                            >
                                {/* Image container */}
                                <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                                    {/* Image */}
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <span className="inline-block px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-full text-xs font-semibold mb-2">
                                                {item.category}
                                            </span>
                                            <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                            <p className="text-sm text-white/80">{item.description}</p>
                                        </div>
                                    </div>

                                    {/* Zoom effect overlay */}
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View More Button */}
                    <div className="text-center mt-12">
                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300">
                            {t('viewMore')}
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
                        </button>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image */}
                        <div className="relative aspect-video bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10">
                            <Image
                                src={selectedItem.imageUrl}
                                alt={selectedItem.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                                {selectedItem.category}
                            </span>
                            <h2 className="text-3xl font-bold mb-3">{selectedItem.title}</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                {selectedItem.description}
                            </p>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                                    {t('viewDetails')}
                                </button>
                                <button className="px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-muted transition-colors">
                                    {t('similarWork')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
