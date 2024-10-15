import { prisma } from '@repo/db';
import { Hono } from 'hono';
import { verifyAuth } from '@hono/auth-js';

const app = new Hono();

app.use('/', verifyAuth());

app.get('/', async (c) => {
	const creditPackages = await prisma.creditPackage.findMany();

	return c.json({
		data: creditPackages
			.map(({ id, credits, bonus, price }) => ({
				id,
				credits,
				bonus,
				price
			}))
			.sort((a, b) => a.credits - b.credits)
	});
});

export default app;
