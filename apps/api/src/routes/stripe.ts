import { JsonObject, PaymentStatus, prisma } from '@repo/db';
import { Context, Hono } from 'hono';
import Stripe from 'stripe';

const app = new Hono();

app.post('/hooks', async (c: Context) => {
	try {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
		const body = await c.req.text();
		const signature = c.req.raw.headers.get('stripe-signature');
		const event = await stripe.webhooks.constructEventAsync(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);

		return await handleEvent(event);
	} catch (e) {
		return Response.json({ success: false, error: e }, { status: 500 });
	}
});

async function handleEvent(event: Stripe.Event) {
	switch (event.type) {
		case 'checkout.session.completed':
			return await handleCheckoutSessionCompleted(event);
		case 'checkout.session.expired':
			return await handleCheckoutSessionExpired(event);
		default:
			return Response.json({ success: true });
	}
}

async function handleCheckoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
	const { metadata } = event.data.object;

	if (!metadata) {
		return Response.json({ success: false, error: 'Event does not contain metadata.' }, { status: 400 });
	}

	const paymentId = metadata?.payment_id;
	const payment = await prisma.payment.findFirst({ where: { id: paymentId } });

	if (!payment) {
		return Response.json({ success: false, error: 'Payment does not exist' }, { status: 400 });
	}

	if (payment.status !== PaymentStatus.PENDING) {
		return Response.json({ success: false, error: 'Payment is not in PENDING status' }, { status: 500 });
	}

	const user = await prisma.user.findFirst({ where: { id: payment.userId } });

	if (!user) {
		return Response.json({ success: false, error: 'User does not exist' }, { status: 400 });
	}

	await prisma.payment.update({
		where: { id: paymentId },
		data: {
			status: PaymentStatus.COMPLETED
		}
	});

	await prisma.user.update({
		where: { id: payment.userId },
		data: {
			credits: user.credits + ((payment.creditPackage! as JsonObject).credits as number)
		}
	});

	return Response.json({ success: true });
}

async function handleCheckoutSessionExpired(event: Stripe.CheckoutSessionExpiredEvent) {
	const { metadata } = event.data.object;

	if (!metadata) {
		return Response.json({ success: false, error: 'Event does not contain metadata' }, { status: 400 });
	}

	const paymentId = metadata?.payment_id;
	const payment = await prisma.payment.findFirst({ where: { id: paymentId } });

	if (!payment) {
		return Response.json({ success: false, error: 'Payment does not exist' }, { status: 400 });
	}

	if (payment.status !== PaymentStatus.PENDING) {
		return Response.json({ success: false, error: 'Payment is not in PENDING status' }, { status: 500 });
	}

	await prisma.payment.update({
		where: { id: paymentId },
		data: {
			status: PaymentStatus.EXPIRED
		}
	});

	return Response.json({ success: true });
}

export default app;
