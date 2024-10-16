import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@repo/db';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
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
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code'
				}
			}
		})
	],
	session: {
		strategy: 'database'
	},
	callbacks: {
		jwt({ token, trigger /*, session*/ }) {
			if (trigger === 'update') {
				/*token.name = session?.user?.name;*/
			}

			return token;
		},
		async session({ session }) {
			return session;
		}
	}
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
