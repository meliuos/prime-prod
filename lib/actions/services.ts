'use server';

import { requireRole } from '@/lib/dal';
import { db } from '@/lib/db';
import { services } from '@/db/schema';
import { eq, isNull, and, like, sql, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createServiceSchema, updateServiceSchema, type ServiceCategory } from '@/lib/validations/service';

interface GetServicesOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: ServiceCategory;
  isActive?: boolean;
}

export async function getAllServices(options: GetServicesOptions = {}) {
  await requireRole(['super_admin']);

  const {
    page = 1,
    pageSize = 10,
    search,
    category,
    isActive,
  } = options;

  // Build where conditions
  const conditions = [isNull(services.deletedAt)];

  if (search) {
    conditions.push(
      or(
        like(services.name, `%${search}%`),
        like(services.description, `%${search}%`)
      )!
    );
  }

  if (category) {
    conditions.push(eq(services.category, category));
  }

  if (isActive !== undefined) {
    conditions.push(eq(services.isActive, isActive));
  }

  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(services)
    .where(and(...conditions));

  // Get paginated results
  const allServices = await db.query.services.findMany({
    where: and(...conditions),
    orderBy: (services, { desc }) => [desc(services.createdAt)],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    services: allServices,
    pagination: {
      page,
      pageSize,
      total: count,
      totalPages: Math.ceil(count / pageSize),
    },
  };
}

export async function getServiceById(serviceId: string) {
  await requireRole(['super_admin']);

  const service = await db.query.services.findFirst({
    where: and(eq(services.id, serviceId), isNull(services.deletedAt)),
  });

  if (!service) {
    throw new Error('Service not found');
  }

  return service;
}

export async function createService(formData: FormData) {
  await requireRole(['super_admin']);

  // Parse and validate form data
  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as ServiceCategory,
    price: formData.get('price') as string,
    deliveryTime: parseInt(formData.get('deliveryTime') as string),
    icon: formData.get('icon') as string | null,
    color: formData.get('color') as string | null,
    imageUrl: formData.get('imageUrl') as string | null,
    isActive: formData.get('isActive') === 'true',
  };

  const validated = createServiceSchema.parse({
    ...data,
    icon: data.icon || undefined,
    color: data.color || undefined,
    imageUrl: data.imageUrl || undefined,
  });

  // Check for duplicate slug
  const existingService = await db.query.services.findFirst({
    where: and(eq(services.slug, validated.slug), isNull(services.deletedAt)),
  });

  if (existingService) {
    throw new Error('A service with this slug already exists');
  }

  const [newService] = await db
    .insert(services)
    .values({
      ...validated,
      color: validated.color || '#0284c7',
    })
    .returning();

  revalidatePath('/dashboard/services');

  return { success: true, data: newService };
}

export async function updateService(formData: FormData) {
  await requireRole(['super_admin']);

  const serviceId = formData.get('id') as string;

  // Parse and validate form data
  const data = {
    id: serviceId,
    name: formData.get('name') as string | undefined,
    slug: formData.get('slug') as string | undefined,
    description: formData.get('description') as string | undefined,
    category: formData.get('category') as ServiceCategory | undefined,
    price: formData.get('price') as string | undefined,
    deliveryTime: formData.get('deliveryTime') ? parseInt(formData.get('deliveryTime') as string) : undefined,
    icon: formData.get('icon') as string | null,
    color: formData.get('color') as string | null,
    imageUrl: formData.get('imageUrl') as string | null,
    isActive: formData.get('isActive') ? formData.get('isActive') === 'true' : undefined,
  };

  // Filter out undefined values
  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );

  const validated = updateServiceSchema.parse(cleanedData);

  // Check if service exists
  const existingService = await db.query.services.findFirst({
    where: and(eq(services.id, serviceId), isNull(services.deletedAt)),
  });

  if (!existingService) {
    throw new Error('Service not found');
  }

  // Check for duplicate slug if slug is being updated
  if (validated.slug && validated.slug !== existingService.slug) {
    const duplicateSlug = await db.query.services.findFirst({
      where: and(eq(services.slug, validated.slug), isNull(services.deletedAt)),
    });

    if (duplicateSlug) {
      throw new Error('A service with this slug already exists');
    }
  }

  // Remove id from validated data before update
  const { id, ...updateData } = validated;

  const [updatedService] = await db
    .update(services)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(services.id, serviceId))
    .returning();

  revalidatePath('/dashboard/services');

  return { success: true, data: updatedService };
}

export async function deleteService(serviceId: string) {
  await requireRole(['super_admin']);

  // Soft delete
  const [deletedService] = await db
    .update(services)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(services.id, serviceId))
    .returning();

  revalidatePath('/dashboard/services');

  return { success: true, data: deletedService };
}

export async function toggleServiceStatus(serviceId: string, isActive: boolean) {
  await requireRole(['super_admin']);

  const [updatedService] = await db
    .update(services)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(eq(services.id, serviceId))
    .returning();

  revalidatePath('/dashboard/services');

  return updatedService;
}

// Public function to get active services for homepage (no auth required)
export async function getActiveServices(limit: number = 6) {
  const activeServices = await db.query.services.findMany({
    where: and(isNull(services.deletedAt), eq(services.isActive, true)),
    orderBy: (services, { desc }) => [desc(services.createdAt)],
    limit,
  });

  return activeServices;
}
