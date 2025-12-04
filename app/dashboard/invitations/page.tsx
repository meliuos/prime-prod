import { requireRole } from '@/lib/dal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllInvitations } from '@/lib/actions/invitations';
import { InvitationsTable } from '@/components/dashboard/invitations-table';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

export default async function InvitationsPage() {
  await requireRole(['super_admin']);
  const invitations = await getAllInvitations();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
          <p className="text-muted-foreground">
            Manage user invitations and track their status
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invitations</CardTitle>
          <CardDescription>
            View and manage all sent invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvitationsTable invitations={invitations} />
        </CardContent>
      </Card>
    </div>
  );
}
