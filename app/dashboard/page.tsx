import { requireRole } from '@/lib/dal';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { AgentDashboard } from '@/components/dashboard/agent-dashboard';

export default async function DashboardPage() {
  const { role } = await requireRole(['super_admin', 'agent']);

  if (role === 'super_admin') {
    return <AdminDashboard />;
  }

  return <AgentDashboard />;
}
