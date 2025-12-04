import { requireRole } from '@/lib/dal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServicesTableEnhanced } from '@/components/dashboard/services-table-enhanced';
import { getAllServices } from '@/lib/actions/services';
import type { ServiceCategory } from '@/lib/validations/service';

interface SearchParams {
  search?: string;
  category?: ServiceCategory;
  isActive?: string;
  page?: string;
}

interface ServicesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  await requireRole(['super_admin']);

  const params = await searchParams;

  const page = params.page ? parseInt(params.page) : 1;
  const search = params.search;
  const category = params.category;
  const isActive = params.isActive === 'true' ? true : params.isActive === 'false' ? false : undefined;

  const { services, pagination } = await getAllServices({
    page,
    pageSize: 10,
    search,
    category,
    isActive,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
        <p className="text-muted-foreground">
          Manage all services available on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>
            View, edit, and manage service offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServicesTableEnhanced
            services={services}
            pagination={pagination}
            searchParams={params}
          />
        </CardContent>
      </Card>
    </div>
  );
}
