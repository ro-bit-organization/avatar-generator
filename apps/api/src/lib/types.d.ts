import { DefaultSession } from '@auth/core/types';
import type { AdapterUser } from '@auth/core/adapters';

declare module '@auth/core' {
	interface Session {
		user: {
			credits: number;
		} & DefaultSession['user'];
	}
}

declare module '@auth/core/adapters' {
	interface AdapterUser {
		credits: number;
	}
}
