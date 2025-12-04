import { requireRole } from '@/lib/dal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShowcasesTable } from '@/components/dashboard/showcases-table';
import { getAllShowcasesForAdmin } from '@/lib/actions/showcases';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function ShowcasesPage() {
    await requireRole(['super_admin']);
    const showcases = await getAllShowcasesForAdmin();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Showcases Management</h1>
                    <p className="text-muted-foreground">
                        Manage portfolio showcases displayed on the landing page
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Showcases</CardTitle>
                    <CardDescription>
                        View, edit, and manage portfolio showcase items
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ShowcasesTable showcases={showcases} />
                </CardContent>
            </Card>
        </div>
    );
}
