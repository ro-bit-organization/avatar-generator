import { neonConfig, Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

if (!global.WebSocket) {
	neonConfig.webSocketConstructor = ws;
}

const neon = new Pool({
	connectionString: process.env.DATABASE_URL
});

console.log(process.env);

const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export { prisma };
export * from '@prisma/client';
export { type JsonObject } from '@prisma/client/runtime/library';
