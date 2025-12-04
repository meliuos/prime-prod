'use server';

import { requireRole } from '@/lib/dal';
import { db } from '@/lib/db';
import { orders, user } from '@/db/schema';
import { sql, eq, and, isNull, gte } from 'drizzle-orm';

export async function getAdminAnalytics() {
  await requireRole(['super_admin']);

  // Get total revenue and platform commission
  const [revenueResult] = await db
    .select({
      total: sql<string>`COALESCE(SUM(CAST(${orders.amount} AS DECIMAL)), 0)`,
      platformCommission: sql<string>`COALESCE(SUM(CAST(${orders.platformCommission} AS DECIMAL)), 0)`,
      agentEarnings: sql<string>`COALESCE(SUM(CAST(${orders.agentEarnings} AS DECIMAL)), 0)`,
    })
    .from(orders)
    .where(
      and(
        isNull(orders.deletedAt),
        sql`${orders.status} IN ('completed', 'delivered', 'in_progress', 'assigned')`
      )
    );

  // Get total orders count
  const [ordersCount] = await db
    .select({
      total: sql<number>`COUNT(*)`,
    })
    .from(orders)
    .where(isNull(orders.deletedAt));

  // Get pending orders count
  const [pendingCount] = await db
    .select({
      total: sql<number>`COUNT(*)`,
    })
    .from(orders)
    .where(and(isNull(orders.deletedAt), eq(orders.status, 'pending')));

  // Get active agents count (non-banned)
  const [agentsCount] = await db
    .select({
      total: sql<number>`COUNT(*)`,
    })
    .from(user)
    .where(
      and(
        eq(user.role, 'agent'),
        sql`(${user.banned} IS NULL OR ${user.banned} = false)`
      )
    );

  // Get recent orders (last 10)
  const recentOrders = await db.query.orders.findMany({
    where: isNull(orders.deletedAt),
    with: {
      buyer: {
        columns: {
          name: true,
          email: true,
        },
      },
      seller: {
        columns: {
          name: true,
          email: true,
        },
      },
      service: {
        columns: {
          name: true,
          category: true,
        },
      },
    },
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    limit: 10,
  });

  // Get revenue by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const revenueByMonth = await db
    .select({
      month: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
      total: sql<string>`COALESCE(SUM(CAST(${orders.amount} AS DECIMAL)), 0)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(orders)
    .where(
      and(
        isNull(orders.deletedAt),
        gte(orders.createdAt, sixMonthsAgo),
        sql`${orders.status} IN ('completed', 'delivered', 'in_progress', 'assigned')`
      )
    )
    .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

  return {
    revenue: parseFloat(revenueResult?.total || '0'),
    platformCommission: parseFloat(revenueResult?.platformCommission || '0'),
    agentEarnings: parseFloat(revenueResult?.agentEarnings || '0'),
    totalOrders: ordersCount?.total || 0,
    pendingOrders: pendingCount?.total || 0,
    activeAgents: agentsCount?.total || 0,
    recentOrders,
    revenueByMonth,
  };
}

export async function getAgentPendingOrders() {
  const { userId } = await requireRole(['agent']);

  const pendingOrders = await db.query.orders.findMany({
    where: and(
      isNull(orders.deletedAt),
      eq(orders.status, 'pending'),
      isNull(orders.sellerId) // Orders not yet assigned to any agent
    ),
    with: {
      buyer: {
        columns: {
          name: true,
          email: true,
        },
      },
      service: {
        columns: {
          name: true,
          category: true,
          price: true,
        },
      },
    },
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
  });

  return pendingOrders;
}

export async function getAgentOrderHistory() {
  const { userId } = await requireRole(['agent']);

  const orderHistory = await db.query.orders.findMany({
    where: and(isNull(orders.deletedAt), eq(orders.sellerId, userId)),
    with: {
      buyer: {
        columns: {
          name: true,
          email: true,
        },
      },
      service: {
        columns: {
          name: true,
          category: true,
        },
      },
    },
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
  });

  return orderHistory;
}

export async function getAgentStats() {
  const { userId } = await requireRole(['agent']);

  // Get total earnings
  const [earnings] = await db
    .select({
      total: sql<string>`COALESCE(SUM(CAST(${orders.amount} AS DECIMAL)), 0)`,
    })
    .from(orders)
    .where(
      and(
        isNull(orders.deletedAt),
        eq(orders.sellerId, userId),
        sql`${orders.status} = 'completed'`
      )
    );

  // Get completed orders count
  const [completedCount] = await db
    .select({
      total: sql<number>`COUNT(*)`,
    })
    .from(orders)
    .where(
      and(
        isNull(orders.deletedAt),
        eq(orders.sellerId, userId),
        eq(orders.status, 'completed')
      )
    );

  // Get in-progress orders count
  const [inProgressCount] = await db
    .select({
      total: sql<number>`COUNT(*)`,
    })
    .from(orders)
    .where(
      and(
        isNull(orders.deletedAt),
        eq(orders.sellerId, userId),
        sql`${orders.status} IN ('assigned', 'in_progress', 'delivered', 'revision_requested')`
      )
    );

  return {
    totalEarnings: parseFloat(earnings?.total || '0'),
    completedOrders: completedCount?.total || 0,
    inProgressOrders: inProgressCount?.total || 0,
  };
}
