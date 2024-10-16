import { BuiltInProviderType, ProviderType, RedirectableProviderType } from '@auth/core/providers';
import { Session } from '@auth/core/types';
import * as React from 'react';

interface AuthClientConfig {
    baseUrl: string;
    basePath: string;
    credentials?: RequestCredentials;
    _session?: Session | null | undefined;
    _lastSync: number;
    _getSession: (...args: any[]) => any;
}
interface UseSessionOptions<R extends boolean> {
    required: R;
    onUnauthenticated?: () => void;
}
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);
interface ClientSafeProvider {
    id: LiteralUnion<BuiltInProviderType>;
    name: string;
    type: ProviderType;
    signinUrl: string;
    callbackUrl: string;
}
interface SignInOptions extends Record<string, unknown> {
    /**
     * Specify to which URL the user will be redirected after signing in. Defaults to the page URL the sign-in is initiated from.
     *
     * [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl)
     */
    callbackUrl?: string;
    /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option) */
    redirect?: boolean;
}
interface SignInResponse {
    error: string | undefined;
    status: number;
    ok: boolean;
    url: string | null;
}
type SignInAuthorizationParams = string | string[][] | Record<string, string> | URLSearchParams;
interface SignOutResponse {
    url: string;
}
interface SignOutParams<R extends boolean = true> {
    /** [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1) */
    callbackUrl?: string;
    /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
    redirect?: R;
}
interface SessionProviderProps {
    children: React.ReactNode;
    session?: Session | null;
    baseUrl?: string;
    basePath?: string;
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
    refetchWhenOffline?: false;
}

declare class AuthConfigManager {
    private static instance;
    _config: AuthClientConfig;
    static getInstance(): AuthConfigManager;
    setConfig(userConfig: Partial<AuthClientConfig>): void;
    getConfig(): AuthClientConfig;
}
declare const authConfigManager: AuthConfigManager;
type UpdateSession = (data?: any) => Promise<Session | null>;
type SessionContextValue<R extends boolean = false> = R extends true ? {
    update: UpdateSession;
    data: Session;
    status: 'authenticated';
} | {
    update: UpdateSession;
    data: null;
    status: 'loading';
} : {
    update: UpdateSession;
    data: Session;
    status: 'authenticated';
} | {
    update: UpdateSession;
    data: null;
    status: 'unauthenticated' | 'loading';
};
declare const SessionContext: React.Context<{
    update: UpdateSession;
    data: Session;
    status: 'authenticated';
} | {
    update: UpdateSession;
    data: null;
    status: 'unauthenticated' | 'loading';
} | undefined>;
declare function useSession<R extends boolean>(options?: UseSessionOptions<R>): SessionContextValue<R>;
interface GetSessionParams {
    event?: 'storage' | 'timer' | 'hidden' | string;
    triggerEvent?: boolean;
    broadcast?: boolean;
}
declare function getSession(params?: GetSessionParams): Promise<Session | null>;
declare function getCsrfToken(): Promise<string>;
type ProvidersType = Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>;
declare function getProviders(): Promise<ProvidersType | null>;
declare function signIn<P extends RedirectableProviderType | undefined = undefined>(provider?: LiteralUnion<P extends RedirectableProviderType ? P | BuiltInProviderType : BuiltInProviderType>, options?: SignInOptions, authorizationParams?: SignInAuthorizationParams): Promise<P extends RedirectableProviderType ? SignInResponse | undefined : undefined>;
/**
 * Initiate a signout, by destroying the current session.
 * Handles CSRF protection.
 */
declare function signOut<R extends boolean = true>(options?: SignOutParams<R>): Promise<R extends true ? undefined : SignOutResponse>;
declare function SessionProvider(props: SessionProviderProps): React.JSX.Element;

export { type GetSessionParams, type LiteralUnion, SessionContext, type SessionContextValue, SessionProvider, type SessionProviderProps, type SignInAuthorizationParams, type SignInOptions, type SignInResponse, type SignOutParams, type UpdateSession, authConfigManager, getCsrfToken, getProviders, getSession, signIn, signOut, useSession };
