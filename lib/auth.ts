import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { db } from './db';
import { nextCookies } from 'better-auth/next-js';
import { ac, roles } from './auth-types';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: false,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  plugins: [
    admin({
      ac,
      roles,
      defaultRole: 'user',
    }),
    nextCookies(),
  ],
});
