'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export function AnimatedText({ text, className = '', delay = 0 }: AnimatedTextProps) {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!textRef.current) return;

        const chars = textRef.current.querySelectorAll('.char');

        gsap.fromTo(
            chars,
            {
                opacity: 0,
                y: 20,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.03,
                delay,
                ease: 'power3.out',
            }
        );
    }, [delay]);

    return (
        <div ref={textRef} className={className}>
            {text.split('').map((char, index) => (
                <span key={index} className="char inline-block">
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </div>
    );
}
