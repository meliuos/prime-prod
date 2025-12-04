'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type AnimationVariant = 'fade-up' | 'fade-in' | 'scale' | 'slide-left' | 'slide-right';

interface RevealOnScrollProps {
    children: ReactNode;
    variant?: AnimationVariant;
    delay?: number;
    duration?: number;
    className?: string;
    once?: boolean;
}

const animationVariants = {
    'fade-up': { opacity: 0, y: 30 },
    'fade-in': { opacity: 0 },
    'scale': { opacity: 0, scale: 0.95 },
    'slide-left': { opacity: 0, x: -50 },
    'slide-right': { opacity: 0, x: 50 },
};

export function RevealOnScroll({
    children,
    variant = 'fade-up',
    delay = 0,
    duration = 0.8,
    className,
    once = true,
}: RevealOnScrollProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        const element = elementRef.current;
        const fromVars = animationVariants[variant];

        const ctx = gsap.context(() => {
            gsap.fromTo(
                element,
                fromVars,
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    scale: 1,
                    duration,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: once ? 'play none none none' : 'play none none reverse',
                    },
                }
            );
        }, element);

        return () => ctx.revert();
    }, [variant, delay, duration, once]);

    return (
        <div ref={elementRef} className={cn(className)}>
            {children}
        </div>
    );
}
