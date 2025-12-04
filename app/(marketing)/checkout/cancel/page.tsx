import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { XCircleIcon } from 'lucide-react';

export default function CheckoutCancelPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                        <XCircleIcon className="h-10 w-10 text-amber-500" />
                    </div>
                    <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
                    <CardDescription className="text-base">
                        Your payment was cancelled and no charges were made
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        You can return to the service page and try again when you're ready.
                    </p>

                    <div className="flex flex-col gap-2 pt-4">
                        <Button asChild className="w-full">
                            <Link href="/services">Browse Services</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">Go Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
