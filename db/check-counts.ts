import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { services, showcases } from './schema';
import { count } from 'drizzle-orm';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function checkCounts() {
    const [servicesCount] = await db.select({ count: count() }).from(services);
    const [showcasesCount] = await db.select({ count: count() }).from(showcases);

    console.log(`📊 Database Verification:`);
    console.log(`- Services found: ${servicesCount.count}`);
    console.log(`- Showcases found: ${showcasesCount.count}`);
}

checkCounts().then(() => process.exit(0)).catch(console.error);
