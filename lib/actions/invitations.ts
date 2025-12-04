'use server';

import { requireRole } from '@/lib/dal';
import { db } from '@/lib/db';
import { invitations, user as userTable } from '@/db/schema';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

type UserRole = 'super_admin' | 'agent' | 'user';

export async function createInvitation(email: string, role: UserRole) {
  const { userId } = await requireRole(['super_admin']);

  // Check if user already exists
  const existingUser = await db.query.user.findFirst({
    where: eq(userTable.email, email),
  });

  if (existingUser) {
    throw new Error('A user with this email already exists');
  }

  // Check if there's already a pending invitation
  const existingInvitation = await db.query.invitations.findFirst({
    where: and(
      eq(invitations.email, email),
      eq(invitations.accepted, false),
      gt(invitations.expiresAt, new Date())
    ),
  });

  if (existingInvitation) {
    throw new Error('An invitation for this email is already pending');
  }

  // Generate a secure token
  const token = crypto.randomBytes(32).toString('hex');

  // Create invitation (expires in 7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const [invitation] = await db
    .insert(invitations)
    .values({
      email,
      role,
      token,
      invitedBy: userId,
      expiresAt,
    })
    .returning();

  revalidatePath('/dashboard/users');
  revalidatePath('/dashboard/invitations');

  return { success: true, data: invitation };
}

export async function getAllInvitations() {
  await requireRole(['super_admin']);

  const allInvitations = await db.query.invitations.findMany({
    with: {
      invitedByUser: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],
  });

  return allInvitations;
}

export async function getPendingInvitations() {
  await requireRole(['super_admin']);

  const pendingInvitations = await db.query.invitations.findMany({
    where: and(
      eq(invitations.accepted, false),
      gt(invitations.expiresAt, new Date())
    ),
    with: {
      invitedByUser: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],
  });

  return pendingInvitations;
}

export async function deleteInvitation(invitationId: string) {
  await requireRole(['super_admin']);

  await db.delete(invitations).where(eq(invitations.id, invitationId));

  revalidatePath('/dashboard/users');
  revalidatePath('/dashboard/invitations');

  return { success: true };
}

export async function resendInvitation(invitationId: string) {
  await requireRole(['super_admin']);

  // Extend expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const [invitation] = await db
    .update(invitations)
    .set({ expiresAt })
    .where(eq(invitations.id, invitationId))
    .returning();

  revalidatePath('/dashboard/users');
  revalidatePath('/dashboard/invitations');

  return { success: true, data: invitation };
}

// Public function to check and accept invitation (no auth required)
export async function getInvitationByToken(token: string) {
  const invitation = await db.query.invitations.findFirst({
    where: and(
      eq(invitations.token, token),
      eq(invitations.accepted, false),
      gt(invitations.expiresAt, new Date())
    ),
  });

  return invitation;
}

// Mark invitation as accepted (called after user signs up)
export async function acceptInvitation(token: string, userEmail: string) {
  const invitation = await db.query.invitations.findFirst({
    where: and(
      eq(invitations.token, token),
      eq(invitations.email, userEmail),
      eq(invitations.accepted, false),
      gt(invitations.expiresAt, new Date())
    ),
  });

  if (!invitation) {
    throw new Error('Invalid or expired invitation');
  }

  // Mark as accepted
  await db
    .update(invitations)
    .set({
      accepted: true,
      acceptedAt: new Date(),
    })
    .where(eq(invitations.id, invitation.id));

  // Update user role
  await db
    .update(userTable)
    .set({ role: invitation.role })
    .where(eq(userTable.email, userEmail));

  return { success: true, role: invitation.role };
}
