'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxWrapperProps {
    children: ReactNode;
    speed?: number; // 0.5 = slower, 1.5 = faster
    direction?: 'up' | 'down';
    className?: string;
}

export function ParallaxWrapper({
    children,
    speed = 0.5,
    direction = 'up',
    className,
}: ParallaxWrapperProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        const element = elementRef.current;
        const yPercent = direction === 'up' ? -20 * speed : 20 * speed;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                element,
                { y: direction === 'up' ? yPercent : -yPercent },
                {
                    y: direction === 'up' ? -yPercent : yPercent,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    },
                }
            );
        }, element);

        return () => ctx.revert();
    }, [speed, direction]);

    return (
        <div ref={elementRef} className={cn(className)}>
            {children}
        </div>
    );
}
