'use client';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { LogOutIcon } from 'lucide-react';

export function LogoutButton() {
    const t = useTranslations('common');

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOutIcon className="mr-2 h-4 w-4" />
            {t('logout')}
        </Button>
    );
}
