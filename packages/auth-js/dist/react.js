"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react.tsx
var react_exports = {};
__export(react_exports, {
  SessionContext: () => SessionContext,
  SessionProvider: () => SessionProvider,
  authConfigManager: () => authConfigManager,
  getCsrfToken: () => getCsrfToken,
  getProviders: () => getProviders,
  getSession: () => getSession,
  signIn: () => signIn,
  signOut: () => signOut,
  useSession: () => useSession
});
module.exports = __toCommonJS(react_exports);
var React2 = __toESM(require("react"));

// src/client.ts
var import_errors = require("@auth/core/errors");
var React = __toESM(require("react"));
var ClientFetchError = class extends import_errors.AuthError {
};
var ClientSessionError = class extends import_errors.AuthError {
};
async function fetchData(path, config, logger2, req = {}) {
  const url = `${config.baseUrl}${config.basePath}/${path}`;
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
        ...req?.headers?.cookie ? { cookie: req.headers.cookie } : {}
      },
      credentials: config.credentials
    };
    if (req?.body) {
      options.body = JSON.stringify(req.body);
      options.method = "POST";
    }
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) {
      throw data;
    }
    return data;
  } catch (error) {
    logger2.error(new ClientFetchError(error.message, error));
    return null;
  }
}
function useOnline() {
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== "undefined" ? navigator.onLine : false
  );
  React.useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);
    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);
  return isOnline;
}
function now() {
  return Math.floor(Date.now() / 1e3);
}
function parseUrl(url) {
  const defaultUrl = "http://localhost:3000/api/auth";
  const parsedUrl = new URL(url?.startsWith("http") ? url : `https://${url}` || defaultUrl);
  const path = parsedUrl.pathname === "/" ? "/api/auth" : parsedUrl.pathname.replace(/\/$/, "");
  const base = `${parsedUrl.origin}${path}`;
  return {
    origin: parsedUrl.origin,
    host: parsedUrl.host,
    path,
    base,
    toString: () => base
  };
}

// src/react.tsx
var AuthConfigManager = class _AuthConfigManager {
  static instance = null;
  _config = {
    baseUrl: typeof window !== "undefined" ? parseUrl(window.location.origin).origin : "",
    basePath: typeof window !== "undefined" ? parseUrl(window.location.origin).path : "/api/auth",
    credentials: "same-origin",
    _lastSync: 0,
    _session: void 0,
    _getSession: () => {
    }
  };
  static getInstance() {
    if (!_AuthConfigManager.instance) {
      _AuthConfigManager.instance = new _AuthConfigManager();
    }
    return _AuthConfigManager.instance;
  }
  setConfig(userConfig) {
    this._config = { ...this._config, ...userConfig };
  }
  getConfig() {
    return this._config;
  }
};
var authConfigManager = AuthConfigManager.getInstance();
function broadcast() {
  if (typeof BroadcastChannel !== "undefined") {
    return new BroadcastChannel("auth-js");
  }
  return {
    postMessage: () => {
    },
    addEventListener: () => {
    },
    removeEventListener: () => {
    }
  };
}
var logger = {
  debug: console.debug,
  error: console.error,
  warn: console.warn
};
var SessionContext = React2.createContext?.(void 0);
function useSession(options) {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }
  const __AUTHJS = authConfigManager.getConfig();
  const value = React2.useContext(SessionContext);
  const { required, onUnauthenticated } = options ?? {};
  const requiredAndNotLoading = required && value.status === "unauthenticated";
  React2.useEffect(() => {
    if (requiredAndNotLoading) {
      const url = `${__AUTHJS.baseUrl}${__AUTHJS.basePath}/signin?${new URLSearchParams({
        error: "SessionRequired",
        callbackUrl: window.location.href
      })}`;
      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        window.location.href = url;
      }
    }
  }, [requiredAndNotLoading, onUnauthenticated]);
  if (requiredAndNotLoading) {
    return {
      data: value.data,
      update: value.update,
      status: "loading"
    };
  }
  return value;
}
async function getSession(params) {
  const session = await fetchData("session", authConfigManager.getConfig(), logger, params);
  if (params?.broadcast ?? true) {
    broadcast().postMessage({
      event: "session",
      data: { trigger: "getSession" }
    });
  }
  return session;
}
async function getCsrfToken() {
  const response = await fetchData(
    "csrf",
    authConfigManager.getConfig(),
    logger
  );
  return response?.csrfToken ?? "";
}
async function getProviders() {
  return fetchData("providers", authConfigManager.getConfig(), logger);
}
async function signIn(provider, options, authorizationParams) {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {};
  const __AUTHJS = authConfigManager.getConfig();
  const href = `${__AUTHJS.baseUrl}${__AUTHJS.basePath}`;
  const providers = await getProviders();
  if (!providers) {
    window.location.href = `${href}/error`;
    return;
  }
  if (!provider || !(provider in providers)) {
    window.location.href = `${href}/signin?${new URLSearchParams({
      callbackUrl
    })}`;
    return;
  }
  const isCredentials = providers[provider].type === "credentials";
  const isEmail = providers[provider].type === "email";
  const isSupportingReturn = isCredentials || isEmail;
  const signInUrl = `${href}/${isCredentials ? "callback" : "signin"}/${provider}`;
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${signInUrl}?${new URLSearchParams(authorizationParams)}`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1"
    },
    // @ts-expect-error TODO: Fix this
    body: new URLSearchParams({ ...options, csrfToken, callbackUrl }),
    credentials: __AUTHJS.credentials
  });
  const data = await res.json();
  if (redirect || !isSupportingReturn) {
    const url = data.url ?? callbackUrl;
    window.location.href = url;
    if (url.includes("#")) {
      window.location.reload();
    }
    return;
  }
  const error = new URL(data.url).searchParams.get("error");
  if (res.ok) {
    await __AUTHJS._getSession({ event: "storage" });
  }
  return {
    error,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url
  };
}
async function signOut(options) {
  const { callbackUrl = window.location.href } = options ?? {};
  const __AUTHJS = authConfigManager.getConfig();
  const href = `${__AUTHJS.baseUrl}${__AUTHJS.basePath}`;
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${href}/signout`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1"
    },
    body: new URLSearchParams({ csrfToken, callbackUrl }),
    credentials: __AUTHJS.credentials
  });
  const data = await res.json();
  broadcast().postMessage({ event: "session", data: { trigger: "signout" } });
  if (options?.redirect ?? true) {
    const url = data.url ?? callbackUrl;
    window.location.href = url;
    if (url.includes("#")) {
      window.location.reload();
    }
    return;
  }
  await __AUTHJS._getSession({ event: "storage" });
  return data;
}
function SessionProvider(props) {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }
  const { children, refetchInterval, refetchWhenOffline } = props;
  const __AUTHJS = authConfigManager.getConfig();
  const hasInitialSession = props.session !== void 0;
  __AUTHJS._lastSync = hasInitialSession ? now() : 0;
  const [session, setSession] = React2.useState(() => {
    if (hasInitialSession) {
      __AUTHJS._session = props.session;
    }
    return props.session;
  });
  const [loading, setLoading] = React2.useState(!hasInitialSession);
  React2.useEffect(() => {
    __AUTHJS._getSession = async ({ event } = {}) => {
      try {
        const storageEvent = event === "storage";
        if (storageEvent || __AUTHJS._session === void 0) {
          __AUTHJS._lastSync = now();
          __AUTHJS._session = await getSession({
            broadcast: !storageEvent
          });
          setSession(__AUTHJS._session);
          return;
        }
        if (
          // If there is no time defined for when a session should be considered
          // stale, then it's okay to use the value we have until an event is
          // triggered which updates it
          !event || // If the client doesn't have a session then we don't need to call
          // the server to check if it does (if they have signed in via another
          // tab or window that will come through as a "stroage" event
          // event anyway)
          __AUTHJS._session === null || // Bail out early if the client session is not stale yet
          now() < __AUTHJS._lastSync
        ) {
          return;
        }
        __AUTHJS._lastSync = now();
        __AUTHJS._session = await getSession();
        setSession(__AUTHJS._session);
      } catch (error) {
        logger.error(new ClientSessionError(error.message, error));
      } finally {
        setLoading(false);
      }
    };
    __AUTHJS._getSession();
    return () => {
      __AUTHJS._lastSync = 0;
      __AUTHJS._session = void 0;
      __AUTHJS._getSession = () => {
      };
    };
  }, []);
  React2.useEffect(() => {
    const handle = () => __AUTHJS._getSession({ event: "storage" });
    broadcast().addEventListener("message", handle);
    return () => broadcast().removeEventListener("message", handle);
  }, []);
  React2.useEffect(() => {
    const { refetchOnWindowFocus = true } = props;
    const visibilityHandler = () => {
      if (refetchOnWindowFocus && document.visibilityState === "visible") {
        __AUTHJS._getSession({ event: "visibilitychange" });
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler, false);
    return () => document.removeEventListener("visibilitychange", visibilityHandler, false);
  }, [props.refetchOnWindowFocus]);
  const isOnline = useOnline();
  const shouldRefetch = refetchWhenOffline !== false || isOnline;
  React2.useEffect(() => {
    if (refetchInterval && shouldRefetch) {
      const refetchIntervalTimer = setInterval(() => {
        if (__AUTHJS._session) {
          __AUTHJS._getSession({ event: "poll" });
        }
      }, refetchInterval * 1e3);
      return () => clearInterval(refetchIntervalTimer);
    }
  }, [refetchInterval, shouldRefetch]);
  const value = React2.useMemo(
    () => ({
      data: session,
      status: loading ? "loading" : session ? "authenticated" : "unauthenticated",
      async update(data) {
        if (loading || !session) {
          return;
        }
        setLoading(true);
        const newSession = await fetchData(
          "session",
          __AUTHJS,
          logger,
          typeof data === "undefined" ? void 0 : { body: { csrfToken: await getCsrfToken(), data } }
        );
        setLoading(false);
        if (newSession) {
          setSession(newSession);
          broadcast().postMessage({
            event: "session",
            data: { trigger: "getSession" }
          });
        }
        return newSession;
      }
    }),
    [session, loading]
  );
  return /* @__PURE__ */ React2.createElement(SessionContext.Provider, { value }, children);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SessionContext,
  SessionProvider,
  authConfigManager,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut,
  useSession
});
