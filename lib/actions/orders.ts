'use server';

import { requireRole } from '@/lib/dal';
import { db } from '@/lib/db';
import { orders, orderStatusHistory } from '@/db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getDefaultCommissionRate } from './settings';

export async function getAllOrders() {
  await requireRole(['super_admin']);

  const allOrders = await db.query.orders.findMany({
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
  });

  return allOrders;
}

export async function assignOrderToAgent(
  orderId: string,
  agentId: string,
  customCommissionRate?: number
) {
  const { userId } = await requireRole(['super_admin']);

  // Get order to calculate commission
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), isNull(orders.deletedAt)))
    .limit(1);

  if (!order) {
    throw new Error('Order not found');
  }

  // Get commission rate (use custom or default)
  const commissionRate = customCommissionRate ?? (await getDefaultCommissionRate());

  // Calculate commission and agent earnings
  const orderAmount = parseFloat(order.amount);
  const platformCommission = (orderAmount * commissionRate) / 100;
  const agentEarnings = orderAmount - platformCommission;

  // Update order with assignment and commission
  const [updatedOrder] = await db
    .update(orders)
    .set({
      sellerId: agentId,
      status: 'assigned',
      platformCommissionRate: commissionRate.toFixed(2),
      platformCommission: platformCommission.toFixed(2),
      agentEarnings: agentEarnings.toFixed(2),
      updatedAt: new Date(),
    })
    .where(and(eq(orders.id, orderId), isNull(orders.deletedAt)))
    .returning();

  if (!updatedOrder) {
    throw new Error('Order not found');
  }

  // Create status history entry
  await db.insert(orderStatusHistory).values({
    orderId,
    status: 'assigned',
    changedBy: userId,
    note: `Assigned to agent ${agentId} (Commission: ${commissionRate}%, Platform: $${platformCommission.toFixed(2)}, Agent: $${agentEarnings.toFixed(2)})`,
  });

  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard');

  return updatedOrder;
}

export async function acceptOrder(orderId: string) {
  const { userId } = await requireRole(['agent']);

  // Check if order is pending and not assigned
  const [order] = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.id, orderId),
        isNull(orders.deletedAt),
        eq(orders.status, 'pending'),
        isNull(orders.sellerId)
      )
    )
    .limit(1);

  if (!order) {
    throw new Error('Order not found or already assigned');
  }

  // Get commission rate
  const commissionRate = await getDefaultCommissionRate();

  // Calculate commission and agent earnings
  const orderAmount = parseFloat(order.amount);
  const platformCommission = (orderAmount * commissionRate) / 100;
  const agentEarnings = orderAmount - platformCommission;

  // Update order
  const [updatedOrder] = await db
    .update(orders)
    .set({
      sellerId: userId,
      status: 'assigned',
      platformCommissionRate: commissionRate.toFixed(2),
      platformCommission: platformCommission.toFixed(2),
      agentEarnings: agentEarnings.toFixed(2),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  // Create status history entry
  await db.insert(orderStatusHistory).values({
    orderId,
    status: 'assigned',
    changedBy: userId,
    note: `Order accepted by agent (Commission: ${commissionRate}%, Agent Earnings: $${agentEarnings.toFixed(2)})`,
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/history');

  return updatedOrder;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  note?: string
) {
  const { userId, role } = await requireRole(['super_admin', 'agent']);

  // Verify order belongs to agent (if agent)
  if (role === 'agent') {
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, orderId),
          isNull(orders.deletedAt),
          eq(orders.sellerId, userId)
        )
      )
      .limit(1);

    if (!order) {
      throw new Error('Order not found or not assigned to you');
    }
  }

  // Update order
  const [updatedOrder] = await db
    .update(orders)
    .set({
      status: newStatus as 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'revision_requested' | 'completed' | 'cancelled' | 'disputed',
      updatedAt: new Date(),
      ...(newStatus === 'completed' && { completedAt: new Date() }),
    })
    .where(and(eq(orders.id, orderId), isNull(orders.deletedAt)))
    .returning();

  if (!updatedOrder) {
    throw new Error('Order not found');
  }

  // Create status history entry
  await db.insert(orderStatusHistory).values({
    orderId,
    status: newStatus,
    changedBy: userId,
    note: note || `Status updated to ${newStatus}`,
  });

  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/history');

  return updatedOrder;
}

export async function getAvailableAgents() {
  await requireRole(['super_admin']);

  const { user } = await import('@/db/schema/auth');

  // Get both agents and super_admins
  const agents = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
    .from(user)
    .where(
      and(
        sql`(${user.banned} IS NULL OR ${user.banned} = false)`,
        sql`${user.role} IN ('agent', 'super_admin')`
      )
    )
    .orderBy(user.role, user.name); // Super admins first, then alphabetical

  return agents;
}
