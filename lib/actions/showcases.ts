'use server';

import { requireRole } from '@/lib/dal';
import { db } from '@/lib/db';
import { showcases } from '@/db/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createShowcaseSchema, updateShowcaseSchema, type CreateShowcaseInput, type UpdateShowcaseInput } from '@/lib/validations/showcase';

export async function getAllShowcases() {
    const allShowcases = await db.query.showcases.findMany({
        where: and(isNull(showcases.deletedAt), eq(showcases.isActive, true)),
        orderBy: (showcases, { asc }) => [asc(showcases.order), asc(showcases.createdAt)],
    });

    return allShowcases;
}

export async function getAllShowcasesForAdmin() {
    await requireRole(['super_admin']);

    const allShowcases = await db.query.showcases.findMany({
        where: isNull(showcases.deletedAt),
        orderBy: (showcases, { asc }) => [asc(showcases.order), asc(showcases.createdAt)],
    });

    return allShowcases;
}

export async function getShowcaseById(id: string) {
    await requireRole(['super_admin']);

    const showcase = await db.query.showcases.findFirst({
        where: and(eq(showcases.id, id), isNull(showcases.deletedAt)),
    });

    return showcase;
}

export async function createShowcase(input: CreateShowcaseInput) {
    await requireRole(['super_admin']);

    const validatedData = createShowcaseSchema.parse(input);

    const [newShowcase] = await db
        .insert(showcases)
        .values(validatedData)
        .returning();

    revalidatePath('/dashboard/showcases');
    revalidatePath('/');

    return newShowcase;
}

export async function updateShowcase(id: string, input: UpdateShowcaseInput) {
    await requireRole(['super_admin']);

    const validatedData = updateShowcaseSchema.parse(input);

    const [updatedShowcase] = await db
        .update(showcases)
        .set({
            ...validatedData,
            updatedAt: new Date(),
        })
        .where(eq(showcases.id, id))
        .returning();

    revalidatePath('/dashboard/showcases');
    revalidatePath('/');

    return updatedShowcase;
}

export async function deleteShowcase(id: string) {
    await requireRole(['super_admin']);

    const [deletedShowcase] = await db
        .update(showcases)
        .set({
            deletedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(eq(showcases.id, id))
        .returning();

    revalidatePath('/dashboard/showcases');
    revalidatePath('/');

    return deletedShowcase;
}

export async function toggleShowcaseStatus(showcaseId: string, isActive: boolean) {
    await requireRole(['super_admin']);

    const [updatedShowcase] = await db
        .update(showcases)
        .set({
            isActive,
            updatedAt: new Date(),
        })
        .where(eq(showcases.id, showcaseId))
        .returning();

    revalidatePath('/dashboard/showcases');
    revalidatePath('/');

    return updatedShowcase;
}

export async function updateShowcaseOrder(showcaseIds: string[]) {
    await requireRole(['super_admin']);

    // Update order for each showcase based on array position
    const updates = showcaseIds.map((id, index) =>
        db
            .update(showcases)
            .set({
                order: index,
                updatedAt: new Date(),
            })
            .where(eq(showcases.id, id))
    );

    await Promise.all(updates);

    revalidatePath('/dashboard/showcases');
    revalidatePath('/');

    return { success: true };
}
