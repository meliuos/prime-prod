import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ShieldAlertIcon } from 'lucide-react';

export default function UnauthorizedPage() {
    const t = useTranslations('auth');

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <ShieldAlertIcon className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">{t('unauthorized')}</CardTitle>
                    <CardDescription className="text-base">
                        {t('unauthorizedMessage')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/login">{t('signInWithDiscord')}</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/">Go to Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
