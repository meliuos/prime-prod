'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
    const t = useTranslations('landing.cta');
    const tCommon = useTranslations('common');
    const tServices = useTranslations('services');
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !contentRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                {
                    opacity: 0,
                    scale: 0.95,
                    y: 30,
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div
                    ref={contentRef}
                    className="relative overflow-hidden rounded-3xl bg-primary/10 p-1"
                >
                    <div className="relative bg-background/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 md:p-16">
                        {/* Decorative elements - Removed for clean theme */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                        <div className="relative z-10 text-center">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 animate-pulse">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                                {t('title')}
                            </h2>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                                {t('subtitle')}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button
                                    asChild
                                    size="lg"
                                    className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                >
                                    <Link href="/services">{tServices('viewAll')}</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="text-lg px-8 py-6 border-2 hover:bg-muted hover:scale-105 transition-all"
                                >
                                    <Link href="/login">{tCommon('login')}</Link>
                                </Button>
                            </div>

                            {/* Trust indicators */}
                            <div className="mt-12 pt-8 border-t border-border/50">
                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <div className="text-3xl font-bold text-primary">
                                            500+
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">{t('stats.clients')}</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-primary">
                                            1000+
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">{t('stats.projects')}</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-primary">
                                            5.0
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">{t('stats.rating')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
