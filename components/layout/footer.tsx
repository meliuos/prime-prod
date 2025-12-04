'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';

const footerLinks = {
    services: [
        'graphic_design',
        'fivem_trailer',
        'custom_clothing',
        'custom_cars',
    ],
    company: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
    ],
    legal: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Refund Policy', href: '/refund' },
    ],
};

export function Footer() {
    const t = useTranslations('categories');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted/50 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="font-bold text-xl">ProServices</span>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            Professional services for FiveM, design, and more. Transform your vision into reality.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:contact@proservices.com"
                                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Services</h3>
                        <ul className="space-y-2">
                            {footerLinks.services.map((service) => (
                                <li key={service}>
                                    <Link
                                        href={`/services?category=${service}`}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {t(service)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {currentYear} Prime Prod. All rights reserved.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Made with <span className="text-red-500">❤</span> for our clients
                    </p>
                </div>
            </div>
        </footer>
    );
}
