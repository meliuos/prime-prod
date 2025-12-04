import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user } from './schema/auth';
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

async function promoteUser() {
    console.log('👑 Promoting user to super_admin...');

    const email = 'test-admin@example.com';

    const [updatedUser] = await db
        .update(user)
        .set({ role: 'super_admin' })
        .where(eq(user.email, email))
        .returning();

    if (updatedUser) {
        console.log(`✅ User ${updatedUser.email} promoted to ${updatedUser.role}`);
    } else {
        console.log(`❌ User ${email} not found`);
    }
}

async function main() {
    try {
        await promoteUser();
    } catch (error) {
        console.error('❌ Error promoting user:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
