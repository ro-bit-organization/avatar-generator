"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  authHandler: () => authHandler,
  getAuthUser: () => getAuthUser,
  initAuthConfig: () => initAuthConfig,
  reqWithEnvUrl: () => reqWithEnvUrl,
  setEnvDefaults: () => setEnvDefaults,
  verifyAuth: () => verifyAuth
});
module.exports = __toCommonJS(src_exports);
var import_core = require("@auth/core");
var import_adapter = require("hono/adapter");
var import_http_exception = require("hono/http-exception");
var import_core2 = require("@auth/core");
function setEnvDefaults(env2, config) {
  config.secret ??= env2.AUTH_SECRET;
  (0, import_core2.setEnvDefaults)(env2, config);
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
  const ctxEnv = (0, import_adapter.env)(c);
  setEnvDefaults(ctxEnv, config);
  const authReq = await reqWithEnvUrl(c.req.raw, ctxEnv.AUTH_URL);
  const origin = new URL(authReq.url).origin;
  const request = new Request(`${origin}${config.basePath}/session`, {
    headers: { cookie: c.req.header("cookie") ?? "" }
  });
  let authUser = {};
  const response = await (0, import_core.Auth)(request, {
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
      throw new import_http_exception.HTTPException(401, { res });
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
    const ctxEnv = (0, import_adapter.env)(c);
    setEnvDefaults(ctxEnv, config);
    if (!config.secret || config.secret.length === 0) {
      throw new import_http_exception.HTTPException(500, { message: "Missing AUTH_SECRET" });
    }
    const authReq = await reqWithEnvUrl(c.req.raw, ctxEnv.AUTH_URL);
    const res = await (0, import_core.Auth)(authReq, config);
    return new Response(res.body, res);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authHandler,
  getAuthUser,
  initAuthConfig,
  reqWithEnvUrl,
  setEnvDefaults,
  verifyAuth
});
