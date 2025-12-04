'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/app/actions/checkout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceId = searchParams.get('serviceId');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheckout = async () => {
        if (!serviceId) {
            setError('No service selected');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { url } = await createCheckoutSession(serviceId);
            if (url) {
                window.location.href = url;
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create checkout session');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (serviceId) {
            handleCheckout();
        }
    }, [serviceId]);

    if (!serviceId) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>No service selected</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <a href="/services">Browse Services</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Redirecting to Checkout...</CardTitle>
                    <CardDescription>
                        Please wait while we prepare your checkout session
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                    {loading && <p className="text-center">Loading...</p>}
                </CardContent>
            </Card>
        </div>
    );
}
