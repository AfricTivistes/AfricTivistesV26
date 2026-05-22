/**
 * Minimal shim for `react-router-dom` so that the existing React
 * components keep compiling and working unchanged inside an Astro project,
 * where routing is handled by Astro file-based routes.
 *
 * - `<Link>` becomes a plain `<a>` (full page navigation between Astro pages).
 * - `useParams` / `useLocation` / `useSearchParams` / `useNavigate` /
 *   `useNavigationType` are backed by `window.location` and a small context
 *   that each Astro page sets via `<RouterShimProvider params={...}>`.
 * - `BrowserRouter`, `Routes`, `Route` are inert pass-through containers.
 *
 * This keeps every component identical to the original SPA while letting
 * Astro own the routing layer.
 */

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface RouterShimContextValue {
  params: Record<string, string | undefined>;
}

const RouterShimContext = createContext<RouterShimContextValue>({ params: {} });

interface RouterShimProviderProps {
  params?: Record<string, string | undefined>;
  children: ReactNode;
}

export function RouterShimProvider({ params = {}, children }: RouterShimProviderProps) {
  const value = useMemo(() => ({ params }), [JSON.stringify(params)]);
  return <RouterShimContext.Provider value={value}>{children}</RouterShimContext.Provider>;
}

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                           */
/* -------------------------------------------------------------------------- */

const isBrowser = typeof window !== "undefined";

/**
 * Detects the current language prefix (`fr` | `en`) from the URL.
 * Defaults to `fr` outside of those segments.
 */
function getCurrentLang(): "fr" | "en" {
  if (!isBrowser) return "fr";
  const path = window.location.pathname;
  if (path === "/en" || path.startsWith("/en/")) return "en";
  if (path === "/fr" || path.startsWith("/fr/")) return "fr";
  if (typeof document !== "undefined") {
    const hl = document.documentElement.lang;
    if (hl === "en" || hl === "fr") return hl;
  }
  return "fr";
}

/**
 * Returns true for URLs we should NOT prefix with `/fr|/en`.
 * - Absolute external URLs (http://, mailto:, tel:, etc.)
 * - Protocol-relative (//cdn.example.com)
 * - Pure anchor (#section)
 * - Static asset files served from `public/` (with file extensions: .pdf, .zip, …)
 * - URLs that already start with `/fr/` or `/en/`
 */
function shouldSkipLangPrefix(path: string): boolean {
  if (!path) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return true;
  if (path.startsWith("//")) return true;
  if (path.startsWith("#")) return true;
  if (path === "/fr" || path === "/en") return true;
  if (path.startsWith("/fr/") || path.startsWith("/en/")) return true;
  // Static file in /public (path tail before query/hash has an extension)
  const tail = path.split(/[?#]/)[0].split("/").pop() || "";
  if (tail.includes(".")) return true;
  return false;
}

function withLangPrefix(path: string): string {
  if (shouldSkipLangPrefix(path)) return path;
  if (!path.startsWith("/")) return path;
  const lang = getCurrentLang();
  return "/" + lang + path;
}

function resolveTo(to: To): string {
  if (typeof to === "string") return withLangPrefix(to);
  const { pathname = "", search = "", hash = "" } = to;
  const prefixed = pathname ? withLangPrefix(pathname) : "";
  return `${prefixed}${search}${hash}`;
}

type To = string | { pathname?: string; search?: string; hash?: string };

/* -------------------------------------------------------------------------- */
/* Link / NavLink                                                              */
/* -------------------------------------------------------------------------- */

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: To;
  replace?: boolean;
  state?: unknown;
  reloadDocument?: boolean;
  preventScrollReset?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace, state, reloadDocument, preventScrollReset, children, ...rest },
  ref,
) {
  const href = resolveTo(to);
  return (
    <a ref={ref} href={href} {...rest}>
      {children}
    </a>
  );
});

interface NavLinkProps extends Omit<LinkProps, "children" | "className" | "style"> {
  className?: string | ((args: { isActive: boolean; isPending: boolean }) => string);
  style?: React.CSSProperties | ((args: { isActive: boolean; isPending: boolean }) => React.CSSProperties);
  end?: boolean;
  children?: ReactNode | ((args: { isActive: boolean; isPending: boolean }) => ReactNode);
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, end, className, style, children, ...rest },
  ref,
) {
  const href = resolveTo(to);
  const [pathname, setPathname] = useState("");
  useEffect(() => {
    if (!isBrowser) return;
    setPathname(window.location.pathname);
    const onChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onChange);
    window.addEventListener("hashchange", onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("hashchange", onChange);
    };
  }, []);
  const isActive = pathname
    ? end
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/")
    : false;
  const args = { isActive, isPending: false };
  const resolvedClass = typeof className === "function" ? className(args) : className;
  const resolvedStyle = typeof style === "function" ? style(args) : style;
  const resolvedChildren = typeof children === "function" ? children(args) : children;
  return (
    <a ref={ref} href={href} className={resolvedClass} style={resolvedStyle} {...rest}>
      {resolvedChildren}
    </a>
  );
});

/* -------------------------------------------------------------------------- */
/* Hooks                                                                      */
/* -------------------------------------------------------------------------- */

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  const ctx = useContext(RouterShimContext);
  if (ctx.params && Object.keys(ctx.params).length > 0) {
    return ctx.params as T;
  }
  // Astro fallback: each dynamic page injects window.__ASTRO_PARAMS__ via <script is:inline>
  if (isBrowser) {
    const w = window as unknown as { __ASTRO_PARAMS__?: Record<string, string | undefined> };
    if (w.__ASTRO_PARAMS__) return w.__ASTRO_PARAMS__ as T;
  }
  return ctx.params as T;
}

interface ShimLocation {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

function readLocation(): ShimLocation {
  if (!isBrowser) {
    return { pathname: "/", search: "", hash: "", state: null, key: "default" };
  }
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: window.history.state,
    key: "default",
  };
}

export function useLocation(): ShimLocation {
  // Always start with the SSR-safe default so the first CSR render matches the
  // server-rendered HTML, then sync to real window.location after mount.
  const [loc, setLoc] = useState<ShimLocation>(() => ({
    pathname: "/",
    search: "",
    hash: "",
    state: null,
    key: "default",
  }));
  useEffect(() => {
    if (!isBrowser) return;
    setLoc(readLocation());
    const onChange = () => setLoc(readLocation());
    window.addEventListener("popstate", onChange);
    window.addEventListener("hashchange", onChange);
    // Astro view-transitions (ClientRouter) use pushState without firing
    // popstate, so we also listen to its lifecycle events to stay in sync.
    document.addEventListener("astro:page-load", onChange);
    document.addEventListener("astro:after-swap", onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("hashchange", onChange);
      document.removeEventListener("astro:page-load", onChange);
      document.removeEventListener("astro:after-swap", onChange);
    };
  }, []);
  return loc;
}

export function useNavigationType(): "POP" | "PUSH" | "REPLACE" {
  return "POP";
}

interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
  preventScrollReset?: boolean;
}

type NavigateFunction = ((to: To, options?: NavigateOptions) => void) & ((delta: number) => void);

export function useNavigate(): NavigateFunction {
  return useCallback(((to: To | number, options?: NavigateOptions) => {
    if (!isBrowser) return;
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }
    const url = resolveTo(to);
    if (options?.replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  }) as NavigateFunction, []);
}

export function useSearchParams(
  defaultInit?: URLSearchParams | Record<string, string> | string,
): [URLSearchParams, (next: URLSearchParams | Record<string, string>, options?: NavigateOptions) => void] {
  // Start with SSR-safe state — no browser reads during render — then sync to
  // the real URL in useEffect so the first CSR render matches the SSR HTML.
  const [params, setParams] = useState<URLSearchParams>(() => {
    if (isBrowser) return new URLSearchParams(window.location.search);
    if (defaultInit instanceof URLSearchParams) return new URLSearchParams(defaultInit);
    if (typeof defaultInit === "string") return new URLSearchParams(defaultInit);
    if (defaultInit && typeof defaultInit === "object") return new URLSearchParams(defaultInit as Record<string, string>);
    return new URLSearchParams();
  });

  useEffect(() => {
    if (!isBrowser) return;
    setParams(new URLSearchParams(window.location.search));
    const onChange = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  const update = useCallback(
    (next: URLSearchParams | Record<string, string>, options?: NavigateOptions) => {
      const sp = next instanceof URLSearchParams ? next : new URLSearchParams(next);
      const search = sp.toString();
      const url = window.location.pathname + (search ? `?${search}` : "") + window.location.hash;
      if (options?.replace) {
        window.history.replaceState(null, "", url);
      } else {
        window.history.pushState(null, "", url);
      }
      setParams(new URLSearchParams(sp));
    },
    [],
  );

  return [params, update];
}

/* -------------------------------------------------------------------------- */
/* Pass-through routing primitives                                            */
/* -------------------------------------------------------------------------- */

export function BrowserRouter({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
export function HashRouter({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
export function MemoryRouter({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
export function Routes({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
export function Route(_: { path?: string; element?: ReactNode; children?: ReactNode }) {
  return null;
}
export function Outlet() {
  return null;
}
export function Navigate({ to, replace }: { to: To; replace?: boolean }) {
  useEffect(() => {
    if (!isBrowser) return;
    const url = resolveTo(to);
    if (replace) window.location.replace(url);
    else window.location.href = url;
  }, []);
  return null;
}

export default {
  Link,
  NavLink,
  BrowserRouter,
  HashRouter,
  MemoryRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useParams,
  useLocation,
  useNavigate,
  useNavigationType,
  useSearchParams,
};
