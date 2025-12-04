'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createInvitation } from '@/lib/actions/invitations';
import { toast } from 'sonner';
import { Loader2, Mail, UserPlus } from 'lucide-react';

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'super_admin' | 'agent' | 'user'>('agent');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createInvitation(email, role);
      toast.success(`Invitation sent to ${email}`);
      setEmail('');
      setRole('agent');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New User
          </DialogTitle>
          <DialogDescription>
            Send an invitation to a new user. They will receive an email with a link to join the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={(value: any) => setRole(value)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">User</span>
                    <span className="text-xs text-muted-foreground">Can purchase services</span>
                  </div>
                </SelectItem>
                <SelectItem value="agent">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Agent</span>
                    <span className="text-xs text-muted-foreground">Can manage assigned orders</span>
                  </div>
                </SelectItem>
                <SelectItem value="super_admin">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Super Admin</span>
                    <span className="text-xs text-muted-foreground">Full access to all features</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> The invitation link will expire in 7 days. The user will need to sign up using the provided link to join with the selected role.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
