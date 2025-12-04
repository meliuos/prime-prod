import { getServices } from '@/app/actions/services';
import { ServiceCard } from '@/components/services/service-card';
import { ServiceFilters } from '@/components/services/service-filters';
import { getTranslations } from 'next-intl/server';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
    const t = await getTranslations('services');
    const params = await searchParams;

    const category = typeof params.category === 'string' ? params.category : undefined;
    const search = typeof params.search === 'string' ? params.search : undefined;

    const services = await getServices({
        category: category as any,
        search,
        isActive: true,
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-xl text-muted-foreground">
                        Browse our comprehensive catalog of professional services
                    </p>
                </div>

                <ServiceFilters />

                {services.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-2xl text-muted-foreground">No services found</p>
                        <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
