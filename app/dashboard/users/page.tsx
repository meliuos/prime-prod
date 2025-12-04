import { requireRole } from '@/lib/dal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersTable } from '@/components/dashboard/users-table';
import { getAllUsers } from '@/lib/actions/users';

export default async function UsersPage() {
  await requireRole(['super_admin']);
  const users = await getAllUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">
          Manage all users and their roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage user roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users.map(u => ({ ...u, role: (u.role as 'super_admin' | 'agent' | 'user') || 'user' }))} />
        </CardContent>
      </Card>
    </div>
  );
}
