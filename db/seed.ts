import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { services, showcases } from './schema';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

// Load environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create connection
const client = postgres(connectionString);
const db = drizzle(client);

async function seedServices() {
    console.log('🌱 Seeding services...');

    const servicesData = [
        {
            name: 'Logo Design',
            slug: 'logo-design',
            description: 'Professional logo design services for your brand identity. Custom, unique, and memorable logos.',
            category: 'graphic_design' as const,
            price: '99.99',
            deliveryTime: 5,
            icon: 'Palette',
            color: '#ec4899',
            imageUrl: '/services/logo-design.jpg',
        },
        {
            name: 'FiveM Trailer',
            slug: 'fivem-trailer',
            description: 'High-quality cinematic trailers for your FiveM roleplay server. Professional editing and effects.',
            category: 'fivem_trailer' as const,
            price: '199.99',
            deliveryTime: 7,
            icon: 'Video',
            color: '#8b5cf6',
            imageUrl: '/services/fivem-trailer.jpg',
        },
        {
            name: 'Banner Design',
            slug: 'banner-design',
            description: 'Eye-catching banner designs for social media, websites, and promotional materials.',
            category: 'graphic_design' as const,
            price: '49.99',
            deliveryTime: 3,
            icon: 'ImageIcon',
            color: '#3b82f6',
            imageUrl: '/services/banner-design.jpg',
        },
        {
            name: 'Custom Clothing',
            slug: 'custom-clothing',
            description: 'Custom clothing designs for FiveM servers. High-quality textures and realistic designs.',
            category: 'custom_clothing' as const,
            price: '149.99',
            deliveryTime: 10,
            icon: 'Sparkles',
            color: '#f59e0b',
            imageUrl: '/services/custom-clothing.jpg',
        },
        {
            name: 'Streaming Design',
            slug: 'streaming-design',
            description: 'Complete streaming overlay package including alerts, panels, and graphics.',
            category: 'streaming_design' as const,
            price: '179.99',
            deliveryTime: 7,
            icon: 'Zap',
            color: '#10b981',
            imageUrl: '/services/streaming-design.jpg',
        },
        {
            name: 'Business Branding',
            slug: 'business-branding',
            description: 'Complete branding package for your business including logo, business cards, and brand guidelines.',
            category: 'business_branding' as const,
            price: '399.99',
            deliveryTime: 14,
            icon: 'Layers',
            color: '#7c3aed',
            imageUrl: '/services/business-branding.jpg',
        },
        {
            name: 'Discord Design',
            slug: 'discord-design',
            description: 'Custom Discord server branding including banners, icons, and emoji designs.',
            category: 'discord_design' as const,
            price: '79.99',
            deliveryTime: 5,
            icon: 'MessageSquare',
            color: '#06b6d4',
            imageUrl: '/services/discord-design.jpg',
        },
        {
            name: '3D Design',
            slug: '3d-design',
            description: 'Professional 3D modeling and rendering services for products, characters, and environments.',
            category: '3d_design' as const,
            price: '299.99',
            deliveryTime: 14,
            icon: 'Box',
            color: '#ef4444',
            imageUrl: '/services/3d-design.jpg',
        },
    ];

    for (const service of servicesData) {
        // Check if service already exists
        const existing = await db.select().from(services).where(eq(services.slug, service.slug));

        if (existing.length === 0) {
            await db.insert(services).values(service);
            console.log(`✅ Created service: ${service.name}`);
        } else {
            console.log(`⏭️  Service already exists: ${service.name}`);
        }
    }

    console.log('✅ Services seeding completed!\n');
}

async function seedShowcases() {
    console.log('🌱 Seeding showcases...');

    const showcasesData = [
        {
            title: 'FiveM Server Trailer',
            description: 'Cinematic trailer for a roleplay server',
            category: 'Motion Graphics',
            imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=600&fit=crop',
            order: 0,
            isActive: true,
        },
        {
            title: 'Brand Identity',
            description: 'Complete brand identity package',
            category: 'Logo Design',
            imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
            order: 1,
            isActive: true,
        },
        {
            title: 'Twitch Overlay',
            description: 'Custom streaming overlay and alerts',
            category: 'Design',
            imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
            order: 2,
            isActive: true,
        },
        {
            title: 'Social Media Banner',
            description: 'Professional social media graphics',
            category: 'Banners',
            imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
            order: 3,
            isActive: true,
        },
        {
            title: 'Server Logo',
            description: 'Gaming community logo design',
            category: 'Logo Design',
            imageUrl: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&h=600&fit=crop',
            order: 4,
            isActive: true,
        },
        {
            title: 'Promotional Video',
            description: 'Product launch promotional video',
            category: 'Motion Graphics',
            imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop',
            order: 5,
            isActive: true,
        },
        {
            title: 'Discord Branding',
            description: 'Custom Discord server branding',
            category: 'Design',
            imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&h=600&fit=crop',
            order: 6,
            isActive: true,
        },
        {
            title: 'YouTube Thumbnail',
            description: 'Eye-catching YouTube thumbnails',
            category: 'Banners',
            imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop',
            order: 7,
            isActive: true,
        },
    ];

    for (const showcase of showcasesData) {
        // Check if showcase with same title already exists
        const existing = await db.select().from(showcases).where(eq(showcases.title, showcase.title));

        if (existing.length === 0) {
            await db.insert(showcases).values(showcase);
            console.log(`✅ Created showcase: ${showcase.title}`);
        } else {
            console.log(`⏭️  Showcase already exists: ${showcase.title}`);
        }
    }

    console.log('✅ Showcases seeding completed!\n');
}

async function main() {
    console.log('🚀 Starting database seeding...\n');

    try {
        await seedServices();
        await seedShowcases();

        console.log('🎉 All seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
