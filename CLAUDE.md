# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **service-selling platform** (similar to Fiverr) specialized in graphic design, FiveM content, and custom creative services. The platform supports three user roles: **Super Admin**, **Agent** (sellers), and **User** (buyers).

**Tech Stack:**
- Next.js 16 (App Router, React Server Components by default)
- TypeScript (strict mode)
- PostgreSQL + Drizzle ORM
- BetterAuth (Discord OAuth + Magic Link)
- Stripe (payments)
- next-intl (i18n)
- shadcn/ui + Tailwind CSS 4
- GSAP (animations)

## Development Commands

```bash
# Development
pnpm dev                 # Start dev server on port 3001

# Database
pnpm db:generate        # Generate migrations from schema changes
pnpm db:studio          # Open Drizzle Studio (database GUI)

# Stripe (local testing)
pnpm stripe:listen      # Forward webhooks to localhost:3001

# Build & Deploy
pnpm build              # Production build
pnpm start              # Start production server
pnpm lint               # Run ESLint
```

**Important:** Port 3001 is used for development (not 3000).

## Critical Architecture Patterns

### 1. 🚨 AUTHENTICATION & AUTHORIZATION (MANDATORY)

This project implements the **2025 Data Access Layer (DAL) security pattern**. Middleware is **NOT** used for primary authentication due to CVE-2025-29927.

**Every server action and protected page MUST use DAL:**

```typescript
// Server Action Example
'use server';
import { requireRole } from '@/lib/dal';

export async function createService(data: FormData) {
  // 1. ALWAYS verify authorization FIRST
  await requireRole(['super_admin']);

  // 2. Validate with Zod
  // 3. Perform database operation
  // 4. Call revalidatePath()
}
```

**DAL Functions (`lib/dal.ts`):**
- `verifySession()` - Check if user is authenticated (cached per request)
- `requireRole(['super_admin', 'agent'])` - Require specific roles (redirects if unauthorized)
- `requireAuth()` - Require any authenticated user
- `hasPermission(['agent'])` - Check permission without redirecting

**Page Protection:**
```typescript
// app/dashboard/admin/page.tsx
import { requireRole } from '@/lib/dal';

export default async function AdminPage() {
  await requireRole(['super_admin']); // This runs BEFORE rendering

  // Render protected content
}
```

### 2. DATABASE SCHEMA & RELATIONS

**No SubServices** - Services have a direct `category` enum field instead:
- `graphic_design`, `fivem_trailer`, `custom_clothing`, `custom_cars`, `streaming_design`, `business_branding`, `discord_design`, `3d_design`, `2d_design`

**Key Tables:**
- `user` - Custom `role` field: 'super_admin' | 'agent' | 'user'
- `services` - Main offerings with category enum
- `orders` - Direct reference to `serviceId` (no subServiceId)
- `files` - File metadata (deliverables, requirements)
- `order_status_history` - Audit trail

**Soft Deletes:** All tables have `deletedAt` timestamp. Filter with `sql\`deleted_at IS NULL\``.

**Relations are defined in `db/schema/index.ts`** - Use Drizzle's relational queries:
```typescript
const ordersWithRelations = await db.query.orders.findMany({
  with: {
    buyer: true,
    service: true,
    files: true,
  },
});
```

### 3. FILE UPLOADS (SECURITY CRITICAL)

**Files MUST be stored OUTSIDE `public/` directory:**
```
uploads/              ← NOT web-accessible
├── deliverables/
└── requirements/
```

**File serving requires authentication** - Use `/api/files/[fileId]/route.ts`:
1. Verify session
2. Get file metadata from database
3. Check authorization (owner, order participant, or super_admin)
4. Read from filesystem
5. Return with proper headers

**Never store user uploads in `public/`** - This is a critical security requirement.

### 4. STRIPE PAYMENT FLOW

**Payment BEFORE order creation** (webhook-driven):

1. User clicks "Order Now" → Server Action creates Stripe Checkout Session
2. Redirect to Stripe hosted checkout
3. User pays → Stripe webhook fires `checkout.session.completed`
4. **Webhook handler creates order** in database (with idempotency check)
5. Redirect to success page

**Webhook handler MUST:**
- Verify signature: `stripe.webhooks.constructEvent()`
- Implement idempotency using `stripeSessionId` unique constraint
- Never trust client-side payment confirmations

**API Routes (REQUIRED despite "server actions only"):**
- `/api/auth/[...all]/route.ts` - BetterAuth handlers
- `/api/webhooks/stripe/route.ts` - Stripe webhooks
- `/api/files/[fileId]/route.ts` - Authenticated file serving

### 5. INTERNATIONALIZATION (i18n)

**next-intl routing is configured:**
- Locales: `en`, `fr`, `ar`
- Default: `en`
- Locale prefix: `as-needed` (no prefix for English)

**Translations:** `messages/{locale}.json`

**Usage in Server Components:**
```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('common');
return <p>{t('welcome')}</p>;
```

**Middleware handles locale detection** - No manual locale management needed.

### 6. GSAP ANIMATIONS

**ALL GSAP code MUST be in client components:**

```typescript
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function AnimatedComponent() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.element', { opacity: 0, y: 50 });
  }, { scope: container }); // ALWAYS use scope for cleanup

  return <div ref={container}>...</div>;
}
```

**Never use GSAP in server components** - It will cause hydration errors.

## Server Actions Pattern

**Standard Pattern (ALL actions must follow this):**

```typescript
'use server';
import { requireRole } from '@/lib/dal';
import { createServiceSchema } from '@/lib/validations/service';
import { revalidatePath } from 'next/cache';

export async function createService(formData: FormData) {
  // 1. Authorization check
  await requireRole(['super_admin']);

  // 2. Parse and validate
  const validated = createServiceSchema.parse({
    name: formData.get('name'),
    // ...
  });

  // 3. Database operation
  const [service] = await db.insert(services).values(validated).returning();

  // 4. Revalidate cache
  revalidatePath('/dashboard/services');

  return { success: true, data: service };
}
```

**Actions are organized by domain:**
- `lib/actions/services/` - Service CRUD
- `lib/actions/orders/` - Order management
- `lib/actions/uploads/` - File uploads
- `lib/actions/admin/` - Admin operations

## BetterAuth Configuration

**Providers configured:**
- Discord OAuth (requires `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`)
- Email/Password (with magic links)

**Admin plugin enabled:**
- Default role: `'user'`
- Admin roles: `['super_admin']`

**Custom role field** is stored in the `user` table (not in session). The DAL fetches it from the database on each request (cached).

## Environment Variables Required

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/my_prod"
BETTER_AUTH_SECRET="<generate with: openssl rand -base64 32>"
BETTER_AUTH_URL="http://localhost:3001"
DISCORD_CLIENT_ID="<from Discord Developer Portal>"
DISCORD_CLIENT_SECRET="<from Discord Developer Portal>"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_URL="http://localhost:3001"
NODE_ENV="development"
```

## Common Pitfalls

1. **DON'T** rely on middleware for authentication - use DAL
2. **DON'T** store user uploads in `public/` - use `uploads/` with authenticated serving
3. **DON'T** skip webhook signature verification in Stripe handler
4. **DON'T** use GSAP in server components - always `'use client'`
5. **DON'T** trust client-side authorization - verify in every server action
6. **DON'T** forget to scope GSAP animations with `{ scope: container }`
7. **DON'T** create orders before payment confirmation - use webhook
8. **DON'T** use floating point for money - use `numeric(10, 2)`
9. **DON'T** skip `revalidatePath()` after mutations

## Styling & Theming

**Light-blue theme** configured in `app/globals.css`:
- Primary color: `hsl(199 89% 48%)` (#0284c7)
- Dark mode support via `.dark` class
- CSS variables for all colors
- Custom utilities: `.bg-glass`, `.bg-grid`
- Smooth scrolling enabled

**shadcn/ui components:**
- Style: "new-york"
- Base color: "neutral" (with light-blue primary override)
- CSS variables: `true`
- No prefix

## Development Workflow

1. **Schema changes:** Edit `db/schema/*` → `pnpm db:generate` → Apply migration
2. **New server action:** Always start with `requireRole()` or `requireAuth()`
3. **New page:** Import i18n with `useTranslations()`, protect with DAL if needed
4. **File uploads:** Never use `public/`, always store metadata in `files` table
5. **Payments:** Create checkout session → redirect to Stripe → handle webhook

## Path Aliases

```typescript
@/*        // Root directory
@/components/ui  // shadcn components
@/lib/*    // Utilities, DAL, auth, db
@/db/schema/*    // Database schemas
```

## Testing Stripe Locally

```bash
# Terminal 1: Dev server
pnpm dev

# Terminal 2: Stripe CLI webhook forwarding
pnpm stripe:listen
# Copy the webhook signing secret to .env.local as STRIPE_WEBHOOK_SECRET
```

## Role-Based Features

- **Super Admin:** Full access to services, orders, users management
- **Agent:** Assigned orders, upload deliverables, accept/deny work
- **User:** Purchase services, track orders, download deliverables

All role enforcement happens via the DAL - never client-side.
