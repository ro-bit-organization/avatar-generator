import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			credits: number;
		} & DefaultSession['user'];
	}
}
