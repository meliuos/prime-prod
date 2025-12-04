import { getServiceBySlug } from '@/app/actions/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClockIcon } from 'lucide-react';

type Params = Promise<{ slug: string }>;

export default async function ServiceDetailPage({ params }: { params: Params }) {
    const t = await getTranslations('services');
    const tCategories = await getTranslations('categories');
    const { slug } = await params;

    const service = await getServiceBySlug(slug);

    if (!service || !service.isActive) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/services" className="text-primary hover:underline mb-6 inline-block">
                    ← Back to Services
                </Link>

                <Card className="overflow-hidden">
                    {service.imageUrl && (
                        <div className="w-full h-64 bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center">
                            <div className="text-6xl">{tCategories(service.category)}</div>
                        </div>
                    )}

                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-3xl mb-2">{service.name}</CardTitle>
                                <CardDescription className="text-base">
                                    <Badge variant="secondary" className="mb-2">
                                        {tCategories(service.category)}
                                    </Badge>
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-primary">
                                    ${parseFloat(service.price).toFixed(2)}
                                </div>
                                <p className="text-sm text-muted-foreground">{t('price')}</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {service.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5" />
                                <span>{t('deliveryTime')}: {service.deliveryTime} {t('days', { count: service.deliveryTime })}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <Button size="lg" className="w-full" asChild>
                                <Link href={`/checkout?serviceId=${service.id}`}>
                                    {t('orderNow')}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
