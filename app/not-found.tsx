'use client';

import { Button } from '@/components/ui/button';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { useRef } from 'react';

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Initial fade in
        tl.from(containerRef.current, {
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
        });

        // Text animations
        tl.from(textRef.current?.children || [], {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)',
        }, '-=0.5');

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground overflow-hidden relative"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center px-4">
                {/* Text Content */}
                <div ref={textRef} className="space-y-6 max-w-lg">
                    <h1 className="text-9xl md:text-[12rem] font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 leading-none select-none">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground">
                        Lost in the Void
                    </h2>
                    <p className="text-muted-foreground/80 text-lg">
                        The page you are looking for has drifted away into the digital abyss.
                    </p>

                    <div className="pt-8">
                        <Button asChild size="lg" className="rounded-full px-8 text-lg h-12">
                            <Link href="/">
                                Return to Reality
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
