import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
import { ac, roles } from './auth-types';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  plugins: [
    adminClient({
      ac: ac,
      roles: roles,
    }),
  ],
});

export const { signIn, signOut, useSession } = authClient;
