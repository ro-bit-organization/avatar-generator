import { DefaultSession } from 'next-auth';
import { AdapterUser as BaseNextAuthAdapterUser } from 'next-auth/adapters';
import { AdapterUser as BaseAuthCodedapterUser } from '@auth/core/adapters';

declare module 'next-auth' {
	interface Session {
		user?: {
			id: string;
			email: string;
			name: string;
			credits: number;
		} & DefaultSession['user'];
	}
}

declare module 'next-auth/adapters' {
	interface AdapterUser extends BaseNextAuthAdapterUser {
		credits: number;
	}
}

declare module '@auth/core/adapters' {
	interface AdapterUser extends BaseAuthCodedapterUser {
		credits: number;
	}
}
