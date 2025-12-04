'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Service {
    id: string;
    name: string;
    description: string;
    category: string;
    price: string;
    deliveryTime: number;
    imageUrl: string | null;
    features?: string[];
}

interface ServiceModalProps {
    service: Service | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ServiceModal({ service, open, onOpenChange }: ServiceModalProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open || !contentRef.current) return;

        const ctx = gsap.context(() => {
            const elements = contentRef.current?.querySelectorAll('.animate-item');
            if (elements) {
                gsap.fromTo(
                    elements,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power3.out',
                    }
                );
            }
        }, contentRef);

        return () => ctx.revert();
    }, [open]);

    if (!service) return null;

    const features = service.features || [
        'High-quality design',
        'Fast delivery',
        'Unlimited revisions',
        'Source files included',
        'Commercial license',
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <div ref={contentRef}>
                    {/* Close button */}
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Image */}
                    <div className="animate-item -mx-6 -mt-6 mb-6 h-64 overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/30 to-primary/10">
                        {service.imageUrl ? (
                            <img
                                src={service.imageUrl}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-9xl opacity-20">
                                {service.category.charAt(0)}
                            </div>
                        )}
                    </div>

                    <DialogHeader className="animate-item">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <DialogTitle className="text-3xl mb-2">{service.name}</DialogTitle>
                                <Badge className="mb-4">{service.category}</Badge>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                                    ${parseFloat(service.price).toFixed(2)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{service.deliveryTime} days delivery</span>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Description */}
                    <DialogDescription className="animate-item text-base leading-relaxed mt-4">
                        {service.description}
                    </DialogDescription>

                    {/* Features */}
                    <div className="animate-item mt-8">
                        <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                        <ul className="space-y-3">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-primary" />
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="animate-item mt-8 flex gap-4">
                        <Button
                            size="lg"
                            className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90"
                        >
                            Order Now
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1">
                            Contact Us
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
