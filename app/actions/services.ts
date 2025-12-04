'use server';

import { db } from '@/lib/db';
import { services } from '@/db/schema/services';
import { requireRole } from '@/lib/dal';
import { createServiceSchema, updateServiceSchema, serviceFilterSchema, type CreateServiceInput, type UpdateServiceInput, type ServiceFilterInput } from '@/lib/validations/service';
import { eq, and, isNull, gte, lte, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// CREATE - Protected: Super Admin only
export async function createService(input: CreateServiceInput) {
    // Verify authorization FIRST
    await requireRole(['super_admin']);

    // Validate input
    const validatedData = createServiceSchema.parse(input);

    // Insert service
    const [newService] = await db
        .insert(services)
        .values({
            name: validatedData.name,
            slug: validatedData.slug,
            description: validatedData.description,
            category: validatedData.category,
            price: validatedData.price,
            deliveryTime: validatedData.deliveryTime,
            icon: validatedData.icon,
            color: validatedData.color,
            imageUrl: validatedData.imageUrl,
            isActive: validatedData.isActive,
        })
        .returning();

    revalidatePath('/services');
    revalidatePath('/admin/services');

    return { success: true, service: newService };
}

// UPDATE - Protected: Super Admin only
export async function updateService(input: UpdateServiceInput) {
    await requireRole(['super_admin']);

    const validatedData = updateServiceSchema.parse(input);
    const { id, ...updateData } = validatedData;

    // Build update object
    const updates: any = {};
    if (updateData.name !== undefined) updates.name = updateData.name;
    if (updateData.slug !== undefined) updates.slug = updateData.slug;
    if (updateData.description !== undefined) updates.description = updateData.description;
    if (updateData.category !== undefined) updates.category = updateData.category;
    if (updateData.price !== undefined) updates.price = updateData.price;
    if (updateData.deliveryTime !== undefined) updates.deliveryTime = updateData.deliveryTime;
    if (updateData.icon !== undefined) updates.icon = updateData.icon;
    if (updateData.color !== undefined) updates.color = updateData.color;
    if (updateData.imageUrl !== undefined) updates.imageUrl = updateData.imageUrl;
    if (updateData.isActive !== undefined) updates.isActive = updateData.isActive;
    updates.updatedAt = new Date();

    const [updatedService] = await db
        .update(services)
        .set(updates)
        .where(and(eq(services.id, id), isNull(services.deletedAt)))
        .returning();

    if (!updatedService) {
        throw new Error('Service not found');
    }

    revalidatePath('/services');
    revalidatePath('/admin/services');
    revalidatePath(`/services/${updatedService.slug}`);

    return { success: true, service: updatedService };
}

// DELETE (soft delete) - Protected: Super Admin only
export async function deleteService(serviceId: string) {
    await requireRole(['super_admin']);

    const [deletedService] = await db
        .update(services)
        .set({ deletedAt: new Date(), isActive: false })
        .where(and(eq(services.id, serviceId), isNull(services.deletedAt)))
        .returning();

    if (!deletedService) {
        throw new Error('Service not found');
    }

    revalidatePath('/services');
    revalidatePath('/admin/services');

    return { success: true };
}

// GET ALL - Public (with filters)
export async function getServices(filters?: ServiceFilterInput) {
    const validatedFilters = filters ? serviceFilterSchema.parse(filters) : {};

    const conditions = [isNull(services.deletedAt)];

    if (validatedFilters.category) {
        conditions.push(eq(services.category, validatedFilters.category));
    }

    if (validatedFilters.isActive !== undefined) {
        conditions.push(eq(services.isActive, validatedFilters.isActive));
    }

    if (validatedFilters.search) {
        conditions.push(
            or(
                ilike(services.name, `%${validatedFilters.search}%`),
                ilike(services.description, `%${validatedFilters.search}%`)
            )!
        );
    }

    let query = db
        .select()
        .from(services)
        .where(and(...conditions));

    const results = await query;

    // Filter by price range in application layer (since numeric type comparison)
    let filteredResults = results;
    if (validatedFilters.minPrice || validatedFilters.maxPrice) {
        filteredResults = results.filter((service) => {
            const price = parseFloat(service.price);
            if (validatedFilters.minPrice && price < validatedFilters.minPrice) return false;
            if (validatedFilters.maxPrice && price > validatedFilters.maxPrice) return false;
            return true;
        });
    }

    return filteredResults;
}

// GET BY ID - Public
export async function getServiceById(serviceId: string) {
    const [service] = await db
        .select()
        .from(services)
        .where(and(eq(services.id, serviceId), isNull(services.deletedAt)))
        .limit(1);

    return service || null;
}

// GET BY SLUG - Public
export async function getServiceBySlug(slug: string) {
    const [service] = await db
        .select()
        .from(services)
        .where(and(eq(services.slug, slug), isNull(services.deletedAt)))
        .limit(1);

    return service || null;
}
