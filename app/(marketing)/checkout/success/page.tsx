import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircleIcon } from 'lucide-react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const sessionId = params.session_id;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircleIcon className="h-10 w-10 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                    <CardDescription className="text-base">
                        Your order has been placed successfully
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {sessionId && (
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Session ID</p>
                            <p className="text-sm font-mono break-all">{sessionId}</p>
                        </div>
                    )}

                    <p className="text-muted-foreground">
                        You will receive an email confirmation shortly. You can now add requirements
                        to your order and track its progress.
                    </p>

                    <div className="flex flex-col gap-2 pt-4">
                        <Button asChild className="w-full">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/services">Browse More Services</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
