import { prisma } from '@repo/db';
import { Hono } from 'hono';

const app = new Hono();

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
