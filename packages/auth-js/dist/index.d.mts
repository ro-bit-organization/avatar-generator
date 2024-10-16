import { AuthConfig as AuthConfig$1 } from '@auth/core';
import { AdapterUser } from '@auth/core/adapters';
import { JWT } from '@auth/core/jwt';
import { Session } from '@auth/core/types';
import { Context, MiddlewareHandler } from 'hono';

declare module 'hono' {
    interface ContextVariableMap {
        authUser: AuthUser;
        authConfig: AuthConfig;
    }
}
type AuthEnv = {
    AUTH_URL?: string;
    AUTH_SECRET: string;
    AUTH_REDIRECT_PROXY_URL?: string;
    [key: string]: string | undefined;
};
type AuthUser = {
    session: Session;
    token?: JWT;
    user?: AdapterUser;
};
interface AuthConfig extends Omit<AuthConfig$1, 'raw'> {
}
type ConfigHandler = (c: Context) => AuthConfig;
declare function setEnvDefaults(env: AuthEnv, config: AuthConfig): void;
declare function reqWithEnvUrl(req: Request, authUrl?: string): Promise<Request>;
declare function getAuthUser(c: Context): Promise<AuthUser | null>;
declare function verifyAuth(): MiddlewareHandler;
declare function initAuthConfig(cb: ConfigHandler): MiddlewareHandler;
declare function authHandler(): MiddlewareHandler;

export { type AuthConfig, type AuthEnv, type AuthUser, type ConfigHandler, authHandler, getAuthUser, initAuthConfig, reqWithEnvUrl, setEnvDefaults, verifyAuth };
