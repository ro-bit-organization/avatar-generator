import { verifyAuth } from '@hono/auth-js';
import { prisma } from '@repo/db';
import { Context, Hono } from 'hono';
import { nanoid } from 'nanoid';
import Stripe from 'stripe';

const app = new Hono();

app.use('/api/*', verifyAuth());

app.post('/', async (c: Context) => {
	const body = await c.req.json<{ packageId: string | undefined }>();
	const packageId = body.packageId;

	if (!packageId) {
		return c.json({ error: 'Package id is required!' });
	}

	const session = c.get('authUser');
	const paymentId = nanoid(10);
	const creditPackage = await prisma.creditPackage.findFirst({ where: { id: packageId } });

	if (!creditPackage) {
		return c.json({ error: 'Credit package does not exist!' });
	}

	const params: Stripe.Checkout.SessionCreateParams = {
		mode: 'payment',
		line_items: [
			{
				price_data: {
					currency: 'EUR',
					product_data: {
						name: `${creditPackage.credits + (creditPackage.bonus || 0)} credits`
					},
					unit_amount: creditPackage.price * 100
				},
				quantity: 1
			}
		],
		metadata: {
			payment_id: paymentId
		},
		locale: 'ro',
		success_url: `${c.env.PUBLIC_WEBSITE_URL}/thank-you?payment-id=${paymentId}`,
		cancel_url: c.env.PUBLIC_WEBSITE_URL
	};

	const stripe = new Stripe(c.env.STRIPE_SECRET_KEY!);
	const payment = await stripe.checkout.sessions.create(params);

	await prisma.payment.create({
		data: {
			id: paymentId,
			userId: session!.user!.id,
			creditPackage: {
				price: creditPackage.price,
				credits: creditPackage.credits + (creditPackage.bonus || 0)
			}
		}
	});

	return c.json({
		data: {
			paymentUrl: payment.url
		}
	});
});

export default app;
