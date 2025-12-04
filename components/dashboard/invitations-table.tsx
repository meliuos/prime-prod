'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteInvitation, resendInvitation } from '@/lib/actions/invitations';
import { toast } from 'sonner';
import { useState } from 'react';
import { Trash2, RefreshCw, Mail, CheckCircle2, Clock } from 'lucide-react';
import { InviteUserDialog } from './invite-user-dialog';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Invitation {
  id: string;
  email: string;
  role: string;
  token: string;
  accepted: boolean;
  expiresAt: Date;
  createdAt: Date;
  acceptedAt: Date | null;
  invitedByUser: {
    name: string | null;
    email: string;
  } | null;
}

interface InvitationsTableProps {
  invitations: Invitation[];
}

export function InvitationsTable({ invitations }: InvitationsTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState<string | null>(null);

  const handleResend = async (invitationId: string) => {
    setLoadingId(invitationId);
    try {
      await resendInvitation(invitationId);
      toast.success('Invitation extended for 7 more days');
      router.refresh();
    } catch (error) {
      toast.error('Failed to resend invitation');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteClick = (invitationId: string) => {
    setInvitationToDelete(invitationId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!invitationToDelete) return;

    try {
      await deleteInvitation(invitationToDelete);
      toast.success('Invitation deleted');
      setDeleteDialogOpen(false);
      setInvitationToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete invitation');
    }
  };

  const isExpired = (expiresAt: Date) => new Date(expiresAt) < new Date();

  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.accepted) {
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Accepted
        </Badge>
      );
    }
    if (isExpired(invitation.expiresAt)) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Clock className="h-3 w-3" />
          Expired
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Mail className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No invitations found
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">{invitation.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {invitation.role.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invitation.invitedByUser?.name || invitation.invitedByUser?.email || 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(invitation)}</TableCell>
                  <TableCell className={isExpired(invitation.expiresAt) ? 'text-destructive' : ''}>
                    {new Date(invitation.expiresAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{new Date(invitation.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!invitation.accepted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResend(invitation.id)}
                          disabled={loadingId === invitation.id}
                        >
                          {loadingId === invitation.id ? (
                            'Extending...'
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Extend
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(invitation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <InviteUserDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this invitation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
