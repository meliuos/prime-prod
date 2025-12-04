'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function HeroSection() {
    const t = useTranslations('landing.hero');
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const orbsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Animate hero container
            tl.fromTo(
                heroRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.6 }
            );

            // Animate title with split effect
            if (titleRef.current) {
                tl.fromTo(
                    titleRef.current,
                    { opacity: 0, y: 50, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' },
                    '-=0.3'
                );
            }

            // Animate subtitle
            if (subtitleRef.current) {
                tl.fromTo(
                    subtitleRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8 },
                    '-=0.6'
                );
            }

            // Animate description
            if (descRef.current) {
                tl.fromTo(
                    descRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6 },
                    '-=0.4'
                );
            }

            // Animate buttons with stagger
            if (buttonsRef.current) {
                tl.fromTo(
                    buttonsRef.current.children,
                    { opacity: 0, y: 30, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: 'back.out(1.7)',
                    },
                    '-=0.3'
                );
            }

            // Animate floating orbs
            if (orbsRef.current) {
                const orbs = orbsRef.current.querySelectorAll('.floating-orb');
                orbs.forEach((orb, index) => {
                    gsap.to(orb, {
                        y: '+=30',
                        x: '+=20',
                        duration: 3 + index,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        delay: index * 0.5,
                    });
                });
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

            {/* Animated floating orbs */}
            <div ref={orbsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="floating-orb absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="floating-orb absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
                <div className="floating-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
                <div className="floating-orb absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
                <div className="floating-orb absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Sparkle icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 backdrop-blur-sm mb-8 animate-pulse">
                    <Sparkles className="w-10 h-10 text-primary" />
                </div>

                {/* Main Title with Gradient */}
                <h1
                    ref={titleRef}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
                >
                    {t('title')}{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary-dark">
                        {t('titleHighlight')}
                    </span>
                </h1>

                {/* Subtitle */}
                <h2
                    ref={subtitleRef}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground/90 mb-8"
                >
                    {t('subtitle')}
                </h2>



                {/* CTA Buttons */}
                <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        asChild
                        size="lg"
                        className="group text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-gradient-to-r from-primary to-primary-dark hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                    >
                        <Link href="/services" className="flex items-center gap-2">
                            {t('cta')}
                            <svg
                                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 border-2 hover:bg-primary/5 hover:border-primary hover:scale-105 transition-all duration-300"
                    >
                        <Link href="#portfolio">{t('viewWork')}</Link>
                    </Button>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span>{t('trustBadge')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse animation-delay-1000" />
                        <span>1000+ Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse animation-delay-2000" />
                        <span>5.0 Rating</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
