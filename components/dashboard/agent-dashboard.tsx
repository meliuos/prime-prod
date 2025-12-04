import { getAgentPendingOrders, getAgentStats } from '@/lib/actions/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AcceptOrderButton } from '@/components/dashboard/accept-order-button';
import { formatDistanceToNow } from 'date-fns';

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export async function AgentDashboard() {
  const [pendingOrders, stats] = await Promise.all([
    getAgentPendingOrders(),
    getAgentStats(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Orders</h1>
        <p className="text-muted-foreground">
          Available orders you can accept and work on
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toFixed(2)}`}
          description="From completed orders"
          icon={DollarSign}
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders}
          description="Successfully completed"
          icon={Package}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressOrders}
          description="Currently working on"
          icon={Clock}
        />
      </div>

      {/* Pending Orders List */}
      <div className="space-y-4">
        {pendingOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No pending orders</h3>
                <p className="text-sm text-muted-foreground">
                  Check back later for new orders to accept
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          pendingOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{order.service?.name}</CardTitle>
                    <CardDescription>
                      Order #{order.orderNumber}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{order.service?.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
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

                  <div className="flex justify-end">
                    <AcceptOrderButton orderId={order.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
