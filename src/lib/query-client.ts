import { QueryClient } from "@tanstack/react-query";

/**
 * Module-level singleton QueryClient shared across all Astro page islands.
 * Created lazily so SSR doesn't accidentally create one per request.
 */
let _client: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (_client) return _client;
  _client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
  return _client;
}

/**
 * Tracks the last preload reference we consumed so we can detect new
 * preloads injected after View Transition navigations.
 */
let _lastPreload: unknown = null;

/**
 * Hydrate the QueryClient cache from `window.__PRELOAD__` injected by Astro
 * pages that prefetched data server-side. Each entry is `{ key, data }`
 * matching the queryKey used by the corresponding hook.
 *
 * Called synchronously before the first render of each page's islands.
 * Supports View Transitions: detects when a new page injects a fresh
 * `__PRELOAD__` array (different reference) and re-hydrates accordingly.
 */
export function hydratePreloadOnce(): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    __PRELOAD__?: Array<{ key: unknown[]; data: unknown }>;
  };
  const preload = w.__PRELOAD__;
  if (!Array.isArray(preload)) return;
  // Skip if we already consumed this exact preload array (same page re-render)
  if (preload === _lastPreload) return;
  _lastPreload = preload;
  const client = getQueryClient();
  for (const entry of preload) {
    if (entry && Array.isArray(entry.key)) {
      client.setQueryData(entry.key, entry.data);
    }
  }
}
