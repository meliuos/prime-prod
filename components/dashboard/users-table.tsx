'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUserRole } from '@/lib/actions/users';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'agent' | 'user';
  emailVerified: boolean;
  createdAt: Date;
}

interface UsersTableProps {
  users: User[];
}

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    super_admin: 'default',
    agent: 'secondary',
    user: 'outline',
  };
  return variants[role] || 'outline';
}

export function UsersTable({ users }: UsersTableProps) {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers =
    roleFilter === 'all' ? users : users.filter((user) => user.role === roleFilter);

  const handleRoleChange = async (userId: string, newRole: 'super_admin' | 'agent' | 'user') => {
    setLoadingId(userId);
    try {
      await updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by role:</span>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        handleRoleChange(user.id, value as 'super_admin' | 'agent' | 'user')
                      }
                      disabled={loadingId === user.id}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
