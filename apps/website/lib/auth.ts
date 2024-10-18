import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@repo/db';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const domain = new URL('https://www.pixpersona.xyz').hostname.replace('www.', '');

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	adapter: PrismaAdapter(prisma),
	cookies: {
		sessionToken: {
			name: `next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				domain: `.${domain}`,
				path: '/',
				secure: true
			}
		},
		callbackUrl: {
			name: `next-auth.callback-url`,
			options: {
				sameSite: 'lax',
				domain: `.${domain}`,
				path: '/',
				secure: true
			}
		},
		csrfToken: {
			name: `next-auth.csrf-token`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				domain: `.${domain}`,
				path: '/',
				secure: true
			}
		},
		pkceCodeVerifier: {
			name: `next-auth.pkce.code_verifier`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				domain: `.${domain}`,
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
				domain: `.${domain}`,
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
				domain: `.${domain}`,
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
		jwt({ token, trigger }) {
			if (trigger === 'update') {
				/*token.name = session?.user?.name;*/
			}

			return token;
		},
		async session({ session, user }) {
			return {
				...session,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					credits: user.credits
				}
			};
		}
	}
};
