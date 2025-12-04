'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonialsRow1 = [
    {
        name: 'Alex Johnson',
        role: 'FiveM Server Owner',
        content: 'The custom trailer they created for my server was absolutely stunning! Player count doubled within a week.',
        rating: 5,
        avatar: 'AJ',
    },
    {
        name: 'Sarah Martinez',
        role: 'Twitch Streamer',
        content: 'Best streaming package I\'ve ever purchased. The overlays and alerts are top-notch and professional.',
        rating: 5,
        avatar: 'SM',
    },
    {
        name: 'Mike Chen',
        role: 'Business Owner',
        content: 'Their branding services transformed our company image. Highly recommend for anyone looking for quality work.',
        rating: 5,
        avatar: 'MC',
    },
    {
        name: 'Emma Davis',
        role: 'Content Creator',
        content: 'Amazing attention to detail and quick turnaround. Will definitely be ordering again!',
        rating: 5,
        avatar: 'ED',
    },
    {
        name: 'James Wilson',
        role: 'Gaming Community',
        content: 'Professional service from start to finish. The motion graphics exceeded all expectations!',
        rating: 5,
        avatar: 'JW',
    },
];

const testimonialsRow2 = [
    {
        name: 'Lisa Anderson',
        role: 'YouTuber',
        content: 'The logo design perfectly captured my brand identity. Couldn\'t be happier with the result!',
        rating: 5,
        avatar: 'LA',
    },
    {
        name: 'David Brown',
        role: 'Startup Founder',
        content: 'Fast, professional, and creative. These guys know what they\'re doing!',
        rating: 5,
        avatar: 'DB',
    },
    {
        name: 'Sophie Taylor',
        role: 'Influencer',
        content: 'The banner designs are absolutely gorgeous. My social media looks so much more professional now.',
        rating: 5,
        avatar: 'ST',
    },
    {
        name: 'Ryan Miller',
        role: 'Discord Server Admin',
        content: 'Custom emotes and server branding that really stand out. Worth every penny!',
        rating: 5,
        avatar: 'RM',
    },
    {
        name: 'Olivia Garcia',
        role: 'Brand Manager',
        content: 'Exceptional quality and creativity. They brought our vision to life perfectly.',
        rating: 5,
        avatar: 'OG',
    },
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonialsRow1[0] }) {
    return (
        <div className="flex-shrink-0 w-[400px] mx-3">
            <div className="group relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full">

                <div className="relative z-10">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                    </div>

                    {/* Content */}
                    <p className="text-foreground/90 mb-6 italic leading-relaxed text-sm">
                        &quot;{testimonial.content}&quot;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm">
                            {testimonial.avatar}
                        </div>
                        <div>
                            <div className="font-semibold text-sm">{testimonial.name}</div>
                            <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useTranslations } from 'next-intl';

export function TestimonialsSection() {
    const t = useTranslations('landing.testimonials');
    const sectionRef = useRef<HTMLElement>(null);
    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);
    const row1Animation = useRef<gsap.core.Tween | null>(null);
    const row2Animation = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        if (!row1Ref.current || !row2Ref.current) return;

        const row1 = row1Ref.current;
        const row2 = row2Ref.current;

        // Calculate widths for seamless loop
        const row1Width = row1.scrollWidth / 2;
        const row2Width = row2.scrollWidth / 2;

        // Set initial position for row 2 (start from the left edge)
        gsap.set(row2, { x: -row2Width });

        // Animate row 1 (scroll to left)
        row1Animation.current = gsap.to(row1, {
            x: -row1Width,
            duration: 30,
            ease: 'none',
            repeat: -1,
        });

        // Animate row 2 (scroll to right) - from negative to 0
        row2Animation.current = gsap.to(row2, {
            x: 0,
            duration: 30,
            ease: 'none',
            repeat: -1,
        });

        // Pause on hover for row 1
        const handleRow1Enter = () => row1Animation.current?.pause();
        const handleRow1Leave = () => row1Animation.current?.play();
        row1.addEventListener('mouseenter', handleRow1Enter);
        row1.addEventListener('mouseleave', handleRow1Leave);

        // Pause on hover for row 2
        const handleRow2Enter = () => row2Animation.current?.pause();
        const handleRow2Leave = () => row2Animation.current?.play();
        row2.addEventListener('mouseenter', handleRow2Enter);
        row2.addEventListener('mouseleave', handleRow2Leave);

        return () => {
            row1Animation.current?.kill();
            row2Animation.current?.kill();
            row1.removeEventListener('mouseenter', handleRow1Enter);
            row1.removeEventListener('mouseleave', handleRow1Leave);
            row2.removeEventListener('mouseenter', handleRow2Enter);
            row2.removeEventListener('mouseleave', handleRow2Leave);
        };
    }, []);

    return (
        <section id="testimonials" ref={sectionRef} className="py-20 overflow-hidden bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary-dark">
                        {t('title')}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            {/* Row 1 - Scrolling Left */}
            <div className="mb-6 overflow-hidden">
                <div
                    ref={row1Ref}
                    className="flex"
                    style={{ width: 'fit-content' }}
                >
                    {/* Render twice for seamless loop */}
                    {[...testimonialsRow1, ...testimonialsRow1].map((testimonial, index) => (
                        <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
                    ))}
                </div>
            </div>

            {/* Row 2 - Scrolling Right */}
            <div className="overflow-hidden">
                <div
                    ref={row2Ref}
                    className="flex"
                    style={{ width: 'fit-content' }}
                >
                    {/* Render twice for seamless loop */}
                    {[...testimonialsRow2, ...testimonialsRow2].map((testimonial, index) => (
                        <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}

