import { getAdminAnalytics } from '@/lib/actions/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Clock, Users, TrendingUp, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500',
    assigned: 'bg-blue-500',
    in_progress: 'bg-purple-500',
    delivered: 'bg-green-500',
    revision_requested: 'bg-orange-500',
    completed: 'bg-green-700',
    cancelled: 'bg-red-500',
    disputed: 'bg-red-700',
  };
  return colors[status] || 'bg-gray-500';
}

export async function AdminDashboard() {
  const analytics = await getAdminAnalytics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={`$${analytics.revenue.toFixed(2)}`}
          description="All-time revenue from orders"
          icon={DollarSign}
        />
        <StatCard
          title="Platform Commission"
          value={`$${analytics.platformCommission.toFixed(2)}`}
          description="Your total earnings"
          icon={TrendingUp}
        />
        <StatCard
          title="Agent Earnings"
          value={`$${analytics.agentEarnings.toFixed(2)}`}
          description="Paid to agents"
          icon={Wallet}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders}
          description="All orders in the system"
          icon={Package}
        />
        <StatCard
          title="Pending Orders"
          value={analytics.pendingOrders}
          description="Orders awaiting assignment"
          icon={Clock}
        />
        <StatCard
          title="Active Agents"
          value={analytics.activeAgents}
          description="Registered agents"
          icon={Users}
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              analytics.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.service?.name} - {order.buyer?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      className={getStatusColor(order.status)}
                      variant="default"
                    >
                      {order.status}
                    </Badge>
                    <div className="text-sm font-medium">
                      ${parseFloat(order.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Month */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly revenue for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.revenueByMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No revenue data available
              </p>
            ) : (
              analytics.revenueByMonth.map((item) => (
                <div
                  key={item.month}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.month}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.count} orders
                    </p>
                  </div>
                  <div className="text-sm font-bold">
                    ${parseFloat(item.total).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
