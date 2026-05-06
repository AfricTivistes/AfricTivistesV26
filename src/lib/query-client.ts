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
 * Hydrate the QueryClient cache from `window.__PRELOAD__` injected by Astro
 * pages that prefetched data server-side. Each entry is `{ key, data }`
 * matching the queryKey used by the corresponding hook.
 *
 * MUST be called inside a `useEffect` (post-mount), NOT during render or
 * module init. Calling it synchronously before React hydrates causes the
 * first CSR render to see populated cache while SSR rendered an empty one,
 * triggering hydration mismatch errors in every island that branches on
 * `isLoading` / `data`.
 */
export function hydratePreloadOnce(): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    __PRELOAD__?: Array<{ key: unknown[]; data: unknown }>;
    __PRELOAD_HYDRATED__?: boolean;
  };
  if (w.__PRELOAD_HYDRATED__) return;
  const preload = w.__PRELOAD__;
  if (!Array.isArray(preload)) return;
  const client = getQueryClient();
  for (const entry of preload) {
    if (entry && Array.isArray(entry.key)) {
      client.setQueryData(entry.key, entry.data);
    }
  }
  w.__PRELOAD_HYDRATED__ = true;
}
