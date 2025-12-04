import 'server-only';
import { cache } from 'react';
import { headers } from 'next/headers';
import { auth } from './auth';
import { redirect } from 'next/navigation';
import { db } from './db';
import { user as userTable } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';

type UserRole = 'super_admin' | 'agent' | 'user';

/**
 * Verify the current session
 * This function is cached per request to avoid multiple session lookups
 *
 * @returns Session information including authentication status and userId
 */
export const verifySession = cache(async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    return { isAuth: false, userId: null };
  }

  return {
    isAuth: true,
    userId: session.user.id,
  };
});

/**
 * Get user role from database
 * Cached per request
 */
const getUserRole = cache(async (userId: string): Promise<UserRole | null> => {
  const [user] = await db
    .select({ role: userTable.role })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);

  return (user?.role as UserRole) || null;
});

/**
 * Require authentication and specific role(s) to access a resource
 * Redirects to login if not authenticated
 * Redirects to unauthorized if role doesn't match
 *
 * @param allowedRoles - Array of roles that are allowed to access the resource
 * @returns Object with userId and role of the authenticated user
 */
export async function requireRole(allowedRoles: Array<UserRole>) {
  const { isAuth, userId } = await verifySession();

  // Not authenticated - redirect to login
  if (!isAuth || !userId) {
    redirect('/login');
  }

  // Get user role from database
  const role = await getUserRole(userId);

  // Authenticated but wrong role - redirect to unauthorized
  if (!role || !allowedRoles.includes(role)) {
    redirect('/unauthorized');
  }

  return { role, userId };
}

/**
 * Require authentication without role check
 * Redirects to login if not authenticated
 *
 * @returns Object with userId
 */
export async function requireAuth() {
  const { isAuth, userId } = await verifySession();

  if (!isAuth || !userId) {
    redirect('/login');
  }

  return { userId };
}

/**
 * Check if user has permission without redirecting
 * Useful for conditional rendering
 *
 * @param allowedRoles - Array of roles to check against
 * @returns true if user has one of the allowed roles, false otherwise
 */
export async function hasPermission(allowedRoles: Array<UserRole>): Promise<boolean> {
  const { isAuth, userId } = await verifySession();

  if (!isAuth || !userId) {
    return false;
  }

  const role = await getUserRole(userId);

  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
}
