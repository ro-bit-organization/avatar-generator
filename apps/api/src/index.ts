import GoogleProvider from '@auth/core/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { initAuthConfig, type AuthConfig } from '@hono/auth-js';
import { prisma } from '@repo/db';
import * as dotenv from 'dotenv';
import { Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import creditPackages from './routes/credit-packages.js';
import payments from './routes/payments.js';
import stripe from './routes/stripe.js';

const app = new Hono();

app.use('*', initAuthConfig(getAuthConfig));

app.use(
	'*',
	cors({
		origin: (origin) => origin,
		allowHeaders: ['Content-Type'],
		credentials: true
	})
);

app.route('/api/stripe', stripe);
app.route('/api/credit-packages', creditPackages);
app.route('/api/payments', payments);

function getAuthConfig(c: Context): AuthConfig {
	return {
		secret: c.env.AUTH_SECRET,
		adapter: PrismaAdapter(prisma),
		cookies: {
			sessionToken: {
				name: `next-auth.session-token`,
				options: {
					httpOnly: true,
					sameSite: 'lax',
					path: '/',
					secure: true
				}
			},
			callbackUrl: {
				name: `next-auth.callback-url`,
				options: {
					sameSite: 'lax',
					path: '/',
					secure: true
				}
			},
			csrfToken: {
				name: `next-auth.csrf-token`,
				options: {
					httpOnly: true,
					sameSite: 'lax',
					path: '/',
					secure: true
				}
			},
			pkceCodeVerifier: {
				name: `next-auth.pkce.code_verifier`,
				options: {
					httpOnly: true,
					sameSite: 'lax',
					path: '/',
					secure: true,
					maxAge: 900
				}
			},
			state: {
				name: `next-auth.state`,
				options: {
					httpOnly: true,
					sameSite: 'lax',
					path: '/',
					secure: true,
					maxAge: 900
				}
			},
			nonce: {
				name: `next-auth.nonce`,
				options: {
					httpOnly: true,
					sameSite: 'lax',
					path: '/',
					secure: true
				}
			}
		},
		providers: [
			GoogleProvider({
				clientId: c.env.GOOGLE_CLIENT_ID,
				clientSecret: c.env.GOOGLE_CLIENT_SECRET,
				authorization: {
					params: {
						prompt: 'consent',
						access_type: 'offline',
						response_type: 'code'
					}
				}
			})
		]
	};
}

export default app;
