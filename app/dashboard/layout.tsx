import { requireRole } from '@/lib/dal';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow both super_admin and agent to access dashboard
  const { role, userId } = await requireRole(['super_admin', 'agent']);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav role={role} userId={userId} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
