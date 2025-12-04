import { requireRole } from '@/lib/dal';
import { getAgentOrderHistory } from '@/lib/actions/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { UpdateOrderStatusButton } from '@/components/dashboard/update-order-status-button';

function getStatusColor(status: string) {
  const colors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    assigned: 'default',
    in_progress: 'default',
    delivered: 'default',
    revision_requested: 'secondary',
    completed: 'default',
    cancelled: 'destructive',
    disputed: 'destructive',
  };
  return colors[status] || 'outline';
}

function getNextActions(status: string) {
  const actions: Record<string, { label: string; value: string; variant?: 'default' | 'outline' }[]> = {
    assigned: [
      { label: 'Start Working', value: 'in_progress' },
    ],
    in_progress: [
      { label: 'Mark as Delivered', value: 'delivered' },
    ],
    revision_requested: [
      { label: 'Resubmit', value: 'delivered' },
    ],
    delivered: [],
    completed: [],
    cancelled: [],
    disputed: [],
  };
  return actions[status] || [];
}

export default async function OrderHistoryPage() {
  await requireRole(['agent']);
  const orders = await getAgentOrderHistory();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">
          All orders you've accepted and worked on
        </p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-muted-foreground">
                  You haven't accepted any orders yet
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{order.service?.name}</CardTitle>
                    <CardDescription>
                      Order #{order.orderNumber}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{order.buyer?.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium text-green-600">
                        ${parseFloat(order.amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ordered</p>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>

                  {order.requirements && (
                    <div>
                      <p className="text-sm font-medium mb-1">Requirements</p>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {order.requirements}
                      </p>
                    </div>
                  )}

                  {order.deliveryMessage && (
                    <div>
                      <p className="text-sm font-medium mb-1">Your Delivery Message</p>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {order.deliveryMessage}
                      </p>
                    </div>
                  )}

                  {getNextActions(order.status).length > 0 && (
                    <div className="flex gap-2">
                      {getNextActions(order.status).map((action) => (
                        <UpdateOrderStatusButton
                          key={action.value}
                          orderId={order.id}
                          newStatus={action.value}
                          label={action.label}
                          variant={action.variant}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
