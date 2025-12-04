'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedSectionHeader } from '@/components/animations/animated-section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const pricingPlans = [
    {
        name: 'Starter',
        price: '$49',
        description: 'Perfect for individuals and small projects',
        features: [
            'Basic logo design',
            'Social media banner',
            '2 revisions',
            '48-hour delivery',
            'Source files included',
        ],
        popular: false,
        color: 'from-blue-500 to-cyan-500',
    },
    {
        name: 'Professional',
        price: '$149',
        description: 'Ideal for businesses and content creators',
        features: [
            'Premium logo design',
            'Complete brand kit',
            'Motion graphics',
            'Unlimited revisions',
            '24-hour delivery',
            'Source files + extras',
            'Priority support',
        ],
        popular: true,
        color: 'from-purple-500 to-pink-500',
    },
    {
        name: 'Enterprise',
        price: '$399',
        description: 'For agencies and large-scale projects',
        features: [
            'Full brand identity',
            'Custom illustrations',
            'Video production',
            'Unlimited revisions',
            'Same-day delivery',
            'All source files',
            'Dedicated manager',
            '24/7 priority support',
        ],
        popular: false,
        color: 'from-amber-500 to-orange-500',
    },
];

export function PricingSection() {
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cardsRef.current) return;

        const cards = cardsRef.current.querySelectorAll('.pricing-card');

        const ctx = gsap.context(() => {
            gsap.fromTo(
                cards,
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, cardsRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

            <div className="max-w-7xl mx-auto relative z-10">
                <AnimatedSectionHeader
                    title="Simple, Transparent Pricing"
                    subtitle="Choose the perfect plan for your creative needs"
                />

                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
                >
                    {pricingPlans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`pricing-card relative p-8 ${plan.popular
                                    ? 'border-primary border-2 shadow-2xl shadow-primary/20 scale-105'
                                    : 'border-2 hover:border-primary/50'
                                } transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card/50 backdrop-blur-sm`}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className={`bg-gradient-to-r ${plan.color} text-white px-6 py-1 animate-pulse`}>
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            {/* Plan name */}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                {plan.description}
                            </p>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-5xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                                        {plan.price}
                                    </span>
                                    <span className="text-muted-foreground">/project</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-3">
                                        <div className={`mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}>
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Button
                                asChild
                                className={`w-full ${plan.popular
                                        ? `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`
                                        : ''
                                    } transition-all duration-300 hover:scale-105`}
                                size="lg"
                                variant={plan.popular ? 'default' : 'outline'}
                            >
                                <Link href="/services">Get Started</Link>
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* Additional info */}
                <div className="text-center mt-12 text-muted-foreground">
                    <p className="text-sm">
                        All plans include commercial license and money-back guarantee
                    </p>
                </div>
            </div>
        </section>
    );
}
