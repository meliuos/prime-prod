'use server';

import { requireRole } from '@/lib/dal';
import { db } from '@/lib/db';
import { platformSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const DEFAULT_COMMISSION_RATE = '20.00';

export async function getDefaultCommissionRate(): Promise<number> {
  const [setting] = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.key, 'default_commission_rate'))
    .limit(1);

  if (!setting) {
    // Create default setting if it doesn't exist
    const [newSetting] = await db
      .insert(platformSettings)
      .values({
        key: 'default_commission_rate',
        value: DEFAULT_COMMISSION_RATE,
        description: 'Default platform commission rate percentage',
      })
      .returning();

    return parseFloat(newSetting.value);
  }

  return parseFloat(setting.value);
}

export async function updateDefaultCommissionRate(rate: number) {
  const { userId } = await requireRole(['super_admin']);

  if (rate < 0 || rate > 100) {
    throw new Error('Commission rate must be between 0 and 100');
  }

  const [setting] = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.key, 'default_commission_rate'))
    .limit(1);

  if (!setting) {
    // Create if doesn't exist
    await db.insert(platformSettings).values({
      key: 'default_commission_rate',
      value: rate.toFixed(2),
      description: 'Default platform commission rate percentage',
      updatedBy: userId,
    });
  } else {
    // Update existing
    await db
      .update(platformSettings)
      .set({
        value: rate.toFixed(2),
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .where(eq(platformSettings.key, 'default_commission_rate'));
  }

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');

  return rate;
}

export async function getPlatformSettings() {
  await requireRole(['super_admin']);

  const settings = await db.select().from(platformSettings);

  return settings;
}
