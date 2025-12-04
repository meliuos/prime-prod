'use server';

import { requireRole } from '@/lib/dal';
import { db } from '@/lib/db';
import { user } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getAllUsers() {
  await requireRole(['super_admin']);

  const allUsers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(user.createdAt);

  return allUsers;
}

export async function updateUserRole(userId: string, newRole: 'super_admin' | 'agent' | 'user') {
  await requireRole(['super_admin']);

  const [updatedUser] = await db
    .update(user)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning();

  revalidatePath('/dashboard/users');

  return updatedUser;
}

export async function getUserStats() {
  await requireRole(['super_admin']);

  const [stats] = await db
    .select({
      totalUsers: sql<number>`COUNT(*)`,
      agents: sql<number>`COUNT(*) FILTER (WHERE role = 'agent')`,
      regularUsers: sql<number>`COUNT(*) FILTER (WHERE role = 'user')`,
      superAdmins: sql<number>`COUNT(*) FILTER (WHERE role = 'super_admin')`,
    })
    .from(user);

  return stats;
}
