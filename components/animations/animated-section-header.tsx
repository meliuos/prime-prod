'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionHeaderProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
    className?: string;
}

export function AnimatedSectionHeader({
    title,
    subtitle,
    centered = true,
    className,
}: AnimatedSectionHeaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const underlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });

            // Animate title
            if (titleRef.current) {
                tl.fromTo(
                    titleRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
                );
            }

            // Animate underline
            if (underlineRef.current) {
                tl.fromTo(
                    underlineRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, duration: 0.8, ease: 'power3.out' },
                    '-=0.3'
                );
            }

            // Animate subtitle
            if (subtitleRef.current) {
                tl.fromTo(
                    subtitleRef.current,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                    '-=0.4'
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                'mb-12',
                centered ? 'text-center' : 'text-left',
                className
            )}
        >
            <h2
                ref={titleRef}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary-dark"
            >
                {title}
            </h2>

            {/* Animated underline */}
            <div className={cn('flex', centered ? 'justify-center' : 'justify-start')}>
                <div
                    ref={underlineRef}
                    className="h-1 w-24 bg-gradient-to-r from-primary to-primary-dark rounded-full origin-left"
                />
            </div>

            {subtitle && (
                <p
                    ref={subtitleRef}
                    className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto"
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}
