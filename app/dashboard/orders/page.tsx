import { requireRole } from '@/lib/dal';
import { getAllOrders } from '@/lib/actions/orders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrdersTable } from '@/components/dashboard/orders-table';

export default async function OrdersPage() {
  await requireRole(['super_admin']);
  const orders = await getAllOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground">
          View and manage all orders in the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Manage order assignments and track status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
