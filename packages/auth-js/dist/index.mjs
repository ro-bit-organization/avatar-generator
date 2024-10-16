// src/index.ts
import { Auth } from "@auth/core";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import { setEnvDefaults as coreSetEnvDefaults } from "@auth/core";
function setEnvDefaults(env2, config) {
  config.secret ??= env2.AUTH_SECRET;
  coreSetEnvDefaults(env2, config);
}
async function cloneRequest(input, request, _headers) {
  return new Request(input, request);
}
async function reqWithEnvUrl(req, authUrl) {
  if (authUrl) {
    const reqUrlObj = new URL(req.url);
    const authUrlObj = new URL(authUrl);
    const props = ["hostname", "protocol", "port", "password", "username"];
    props.forEach((prop) => reqUrlObj[prop] = authUrlObj[prop]);
    return cloneRequest(reqUrlObj.href, req);
  } else {
    const url = new URL(req.url);
    const headers = new Headers(req.headers);
    const proto = headers.get("x-forwarded-proto");
    const host = headers.get("x-forwarded-host") ?? headers.get("host");
    if (proto != null)
      url.protocol = proto.endsWith(":") ? proto : proto + ":";
    if (host != null) {
      url.host = host;
      const portMatch = host.match(/:(\d+)$/);
      if (portMatch)
        url.port = portMatch[1];
      else
        url.port = "";
      headers.delete("x-forwarded-host");
      headers.delete("Host");
      headers.set("Host", host);
    }
    return cloneRequest(url.href, req, headers);
  }
}
async function getAuthUser(c) {
  const config = c.get("authConfig");
  const ctxEnv = env(c);
  setEnvDefaults(ctxEnv, config);
  const authReq = await reqWithEnvUrl(c.req.raw, ctxEnv.AUTH_URL);
  const origin = new URL(authReq.url).origin;
  const request = new Request(`${origin}${config.basePath}/session`, {
    headers: { cookie: c.req.header("cookie") ?? "" }
  });
  let authUser = {};
  const response = await Auth(request, {
    ...config,
    callbacks: {
      ...config.callbacks,
      async session(...args) {
        authUser = args[0];
        const session2 = await config.callbacks?.session?.(...args) ?? args[0].session;
        const user = args[0].user ?? args[0].token;
        return { user, ...session2 };
      }
    }
  });
  const session = await response.json();
  return session && session.user ? authUser : null;
}
function verifyAuth() {
  return async (c, next) => {
    const authUser = await getAuthUser(c);
    const isAuth = !!authUser?.token || !!authUser?.user;
    if (!isAuth) {
      const res = new Response("Unauthorized", {
        status: 401
      });
      throw new HTTPException(401, { res });
    } else {
      c.set("authUser", authUser);
    }
    await next();
  };
}
function initAuthConfig(cb) {
  return async (c, next) => {
    const config = cb(c);
    c.set("authConfig", config);
    await next();
  };
}
function authHandler() {
  return async (c) => {
    const config = c.get("authConfig");
    const ctxEnv = env(c);
    setEnvDefaults(ctxEnv, config);
    if (!config.secret || config.secret.length === 0) {
      throw new HTTPException(500, { message: "Missing AUTH_SECRET" });
    }
    const authReq = await reqWithEnvUrl(c.req.raw, ctxEnv.AUTH_URL);
    const res = await Auth(authReq, config);
    return new Response(res.body, res);
  };
}
export {
  authHandler,
  getAuthUser,
  initAuthConfig,
  reqWithEnvUrl,
  setEnvDefaults,
  verifyAuth
};
