'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useTranslations } from 'next-intl';
import { Menu, X, Sparkles, LogOut, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const serviceCategories = [
    { key: 'graphic_design', href: '/services?category=graphic_design' },
    { key: 'fivem_trailer', href: '/services?category=fivem_trailer' },
    { key: 'custom_clothing', href: '/services?category=custom_clothing' },
    { key: 'custom_cars', href: '/services?category=custom_cars' },
    { key: 'streaming_design', href: '/services?category=streaming_design' },
];

export function Header() {
    const t = useTranslations('categories');
    const tCommon = useTranslations('common');
    const tNav = useTranslations('nav');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/login');
                },
            },
        });
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/50'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative h-12 md:h-14 w-auto aspect-3/1">
                            {mounted && (
                                <Image
                                    src={theme === 'dark' ? '/white 1.png' : '/blue 1.png'}
                                    alt="PRIME Production"
                                    fill
                                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            )}
                            {!mounted && (
                                <Image
                                    src="/blue 1.png"
                                    alt="PRIME Production"
                                    fill
                                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            )}
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                        >
                            {tNav('home')}
                        </Link>
                        <Link
                            href="/services"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                        >
                            {tNav('services')}
                        </Link>
                        <Link
                            href="#portfolio"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                        >
                            {tNav('portfolio')}
                        </Link>
                        <Link
                            href="#testimonials"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                        >
                            {tNav('testimonials')}
                        </Link>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-2">
                        <ThemeToggle />
                        <LanguageSelector />

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user.image || ''} alt={session.user.name} />
                                            <AvatarFallback>{session.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {(session.user.role === 'super_admin' || session.user.role === 'agent') && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/login">{tCommon('login')}</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 shadow-lg hover:shadow-primary/30 transition-all"
                                >
                                    <Link href="/services">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Get Started
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Tagline Bar - Desktop */}
                {!isScrolled && (
                    <div className="hidden md:flex items-center justify-center pb-3 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-primary/30 bg-primary/5 backdrop-blur-sm">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-semibold text-primary">
                                Elevate your Vision, Upgrade your Server
                            </span>
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-border animate-in slide-in-from-top-5 duration-200">
                        <div className="flex flex-col space-y-2">
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {tNav('home')}
                            </Link>
                            <Link
                                href="/services"
                                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {tNav('services')}
                            </Link>
                            {serviceCategories.map((cat) => (
                                <Link
                                    key={cat.key}
                                    href={cat.href}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors ml-4"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t(cat.key)}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-2 pt-4 border-t border-border">
                                {session ? (
                                    <>
                                        <div className="px-4 py-2">
                                            <p className="text-sm font-medium">{session.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                        </div>
                                        {(session.user.role === 'super_admin' || session.user.role === 'agent') && (
                                            <Button asChild variant="ghost" className="w-full justify-start">
                                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </Button>
                                        )}
                                        <Button variant="ghost" className="w-full justify-start" onClick={() => {
                                            handleSignOut();
                                            setIsMobileMenuOpen(false);
                                        }}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sign out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                {tCommon('login')}
                                            </Link>
                                        </Button>
                                        <Button asChild className="w-full bg-gradient-to-r from-primary to-primary-dark">
                                            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                Get Started
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

