'use client';

import { Languages } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { setLocale } from '@/app/actions/locale';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export function LanguageSelector() {
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleLanguageChange = (newLocale: string) => {
        startTransition(async () => {
            await setLocale(newLocale);
            // Force a full page reload to apply new locale and dir attribute
            window.location.reload();
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9" disabled={isPending}>
                    <Languages className="h-4 w-4" />
                    <span className="sr-only">Select language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={locale === language.code ? 'bg-muted' : ''}
                        disabled={isPending}
                    >
                        <span className="mr-2">{language.flag}</span>
                        {language.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}