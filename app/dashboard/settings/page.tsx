import { requireRole } from '@/lib/dal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CommissionRateForm } from '@/components/dashboard/commission-rate-form';
import { getDefaultCommissionRate } from '@/lib/actions/settings';

export default async function SettingsPage() {
  await requireRole(['super_admin']);
  const currentRate = await getDefaultCommissionRate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">
          Manage platform-wide settings and configurations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Settings</CardTitle>
          <CardDescription>
            Set the default platform commission rate for all orders. This percentage
            will be deducted from the order amount when assigning orders to agents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CommissionRateForm currentRate={currentRate} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Commission Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                1
              </div>
              <div>
                <p className="font-medium">Order Placement</p>
                <p className="text-muted-foreground">
                  Customer pays the full service amount (e.g., $100)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                2
              </div>
              <div>
                <p className="font-medium">Order Assignment</p>
                <p className="text-muted-foreground">
                  When assigned, commission is calculated using the current rate
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                3
              </div>
              <div>
                <p className="font-medium">Commission Split</p>
                <p className="text-muted-foreground">
                  Platform receives commission (e.g., {currentRate}% = $
                  {(100 * currentRate / 100).toFixed(2)})
                  <br />
                  Agent receives remaining amount (e.g., $
                  {(100 - (100 * currentRate / 100)).toFixed(2)})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                4
              </div>
              <div>
                <p className="font-medium">Custom Rates</p>
                <p className="text-muted-foreground">
                  Super admins can override the default rate when manually assigning
                  orders
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
